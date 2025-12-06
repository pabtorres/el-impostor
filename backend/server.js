const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Datos en memoria (ejemplo simple). Para producción usar DB.
let rooms = {}; // { roomId: { players: {}, deck: [], playedCards: [], history: [...] } }

// Helpers
function makeDeckFromCards(cards) {
  // cards: array of strings (one per player initially)
  return [...cards];
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('create-room', ({ roomId, playerName, cards }, cb) => {
    if (rooms[roomId]) return cb({ error: 'Room exists' });

    const players = {};
    players[socket.id] = { id: socket.id, name: playerName };

    rooms[roomId] = {
      id: roomId,
      players,
      cards, // array length n
      deck: makeDeckFromCards(cards),
      currentRound: null,
      history: [],
      stats: {} // { playerId: { ninja: 0, detective: 0, unbelieved: 0 } }
    };

    socket.join(roomId);
    cb({ ok: true });
    io.to(roomId).emit('room-state', rooms[roomId]);
  });

  socket.on('join-room', ({ roomId, playerName }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb({ error: 'Room not found' });
    if (Object.keys(room.players).length >= room.cards.length)
      return cb({ error: 'Room full' });

    room.players[socket.id] = { id: socket.id, name: playerName };
    socket.join(roomId);
    io.to(roomId).emit('room-state', room);
    cb({ ok: true });
  });

  socket.on('start-next-round', ({ roomId }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb({ error: 'No room' });

    // Choose a card randomly from remaining deck
    if (room.deck.length === 0) return cb({ error: 'No more cards' });

    const idx = Math.floor(Math.random() * room.deck.length);
    const chosenCard = room.deck.splice(idx, 1)[0];

    // Choose a player to be impostor randomly among connected players
    const playerIds = Object.keys(room.players);
    const impostorIndex = Math.floor(Math.random() * playerIds.length);
    const impostorId = playerIds[impostorIndex];

    // Build assignment: regular players get the card, impostor doesn't
    const assignments = {};
    playerIds.forEach(pid => {
      assignments[pid] = { card: pid === impostorId ? null : chosenCard, isImpostor: pid === impostorId };
    });

    // Initialize votes tracking
    room.currentRound = {
      chosenCard,
      assignments,
      votes: {}, // voterId -> votedPlayerId
      startedAt: Date.now(),
      impostorId
    };

    // Tell each player their private info
    playerIds.forEach(pid => {
      const sock = io.sockets.sockets.get(pid);
      if (sock) {
        sock.emit('round-start', {
          card: assignments[pid].card,
          isImpostor: assignments[pid].isImpostor
        });
      }
    });

    io.to(roomId).emit('room-state', room);
    cb({ ok: true });
  });

  socket.on('vote', ({ roomId, targetPlayerId }, cb) => {
    const room = rooms[roomId];
    if (!room || !room.currentRound) return cb({ error: 'No round' });

    room.currentRound.votes[socket.id] = targetPlayerId;

    // traceability: count votes
    const votes = Object.values(room.currentRound.votes);
    const tally = votes.reduce((acc, v) => { acc[v] = (acc[v]||0)+1; return acc; }, {});

    io.to(roomId).emit('vote-update', { votes: room.currentRound.votes, tally });

    cb({ ok: true });
  });

  socket.on('end-round', ({ roomId }, cb) => {
    const room = rooms[roomId];
    if (!room || !room.currentRound) return cb({ error: 'No round' });

    // Determine who got most votes
    const votes = Object.values(room.currentRound.votes);
    const tally = votes.reduce((acc, v) => { acc[v] = (acc[v]||0)+1; return acc; }, {});
    let maxVotes = -1;
    let votedPlayerId = null;
    for (const [pid, cnt] of Object.entries(tally)) {
      if (cnt > maxVotes) { maxVotes = cnt; votedPlayerId = pid; }
    }

    const correct = votedPlayerId === room.currentRound.impostorId;
    const impostorId = room.currentRound.impostorId;

    // Calculate stats for each player
    const playerIds = Object.keys(room.players);
    playerIds.forEach(pid => {
      if (!room.stats[pid]) {
        room.stats[pid] = { ninja: 0, detective: 0, unbelieved: 0 };
      }

      if (pid === impostorId) {
        // Impostor achievements
        if (correct) {
          // Impostor was detected
        } else {
          // Impostor was NOT detected - this is "Ninja"
          room.stats[pid].ninja += 1;
        }
      } else {
        // Regular player achievements
        const theyVotedForImpostor = room.currentRound.votes[pid] === impostorId;
        
        if (theyVotedForImpostor) {
          if (correct) {
            // They guessed correctly and impostor was detected - "Detective"
            room.stats[pid].detective += 1;
          } else {
            // They guessed but it wasn't the impostor (shouldn't happen if correct logic works)
          }
        } else {
          if (correct) {
            // Someone else voted for impostor but they didn't - no achievement
          } else {
            // Nobody detected the impostor, but they believed they knew who it was
            // Only count if they voted for someone (not null)
            if (room.currentRound.votes[pid]) {
              room.stats[pid].unbelieved += 1;
            }
          }
        }
      }
    });

    // Save history
    room.history.push({
      chosenCard: room.currentRound.chosenCard,
      impostorId: room.currentRound.impostorId,
      votedPlayerId,
      correct,
      votes: { ...room.currentRound.votes },
      timestamp: Date.now()
    });

    // Clear currentRound
    room.currentRound = null;

    io.to(roomId).emit('room-state', room);
    io.to(roomId).emit('round-ended', { votedPlayerId, correct, historyItem: room.history[room.history.length-1] });

    cb({ ok: true, correct });
  });

  socket.on('disconnecting', () => {
    // remove player from rooms
    const myRooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    myRooms.forEach(roomId => {
      const room = rooms[roomId];
      if (!room) return;
      delete room.players[socket.id];
      // Optional: if no players left, delete room
      if (Object.keys(room.players).length === 0) delete rooms[roomId];
      else io.to(roomId).emit('room-state', room);
    });
  });

});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('Server listening on', PORT));