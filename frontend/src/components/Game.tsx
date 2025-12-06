import { useEffect, useState } from 'react'
import Voting from './Voting'


export default function Game({ socket, roomState }: any){
const [myPrivate, setMyPrivate] = useState<{card:string,isImpostor:boolean} | null>(null)
const [tally, setTally] = useState<any>({})
const [history, setHistory] = useState<any[]>([])


useEffect(()=>{
socket.on('round-start', (payload:any) => {
setMyPrivate(payload)
setTally({})
})
socket.on('vote-update', (data:any) => { setTally(data.tally) })
socket.on('round-ended', (data:any) => { setHistory(prev=>[...prev, data.historyItem]); setMyPrivate(null) })
socket.on('room-state', (rs:any) => { if (rs.history) setHistory(rs.history) })
}, [])


const startNext = () => socket.emit('start-next-round', { roomId: roomState.id }, (res:any)=>{ if (res.error) alert(res.error) })
const endRound = () => socket.emit('end-round', { roomId: roomState.id }, (res:any)=>{ 
  if (res.error) alert(res.error); 
  else alert('Ronda terminada. Correcto? '+res.correct) 
})


return (
<div className="card">
<h3>Sala: {roomState.id}</h3>
<p>Jugadores: {Object.values(roomState.players).map((p:any)=>p.name).join(', ')}</p>


<div style={{marginTop:8}}>
<button onClick={startNext}>Iniciar siguiente ronda</button>
<button onClick={endRound} style={{marginLeft:8}}>Terminar ronda</button>
</div>


{myPrivate ? (
<div style={{marginTop:12}}>
<h4>Ronda en curso</h4>
{myPrivate.isImpostor ? (
<>
<p style={{color:'#d9534f', fontWeight:'bold'}}>¡Eres el impostor!</p>
<p>No sabes cuál es la tarjeta. Intenta adivinarla escuchando a los otros jugadores.</p>
</>
) : (
<>
<p>Tu tarjeta: <strong>{myPrivate.card}</strong></p>
<p>No eres impostor</p>
</>
)}
</div>
) : (<p style={{marginTop:12}}>No hay ronda privada para ti ahora.</p>)}


<Voting socket={socket} players={roomState.players} tally={tally} roomId={roomState.id} />

<div style={{marginTop:12}}>
<h4>🏆 Tabla de posiciones</h4>
{roomState.stats && Object.keys(roomState.stats).length > 0 ? (
<div style={{overflowX: 'auto'}}>
<table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem'}}>
<thead>
<tr style={{backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>
<th style={{padding: '8px', textAlign: 'left'}}>Jugador</th>
<th style={{padding: '8px', textAlign: 'center'}}>🥷 Ninja</th>
<th style={{padding: '8px', textAlign: 'center'}}>🔍 Detective</th>
<th style={{padding: '8px', textAlign: 'center'}}>😢 Nobody believed</th>
<th style={{padding: '8px', textAlign: 'left'}}>Tarjetas jugadas</th>
</tr>
</thead>
<tbody>
{Object.entries(roomState.stats).sort((a: any, b: any) => {
  const scoreA = (a[1]?.ninja || 0) * 3 + (a[1]?.detective || 0) * 2 + (a[1]?.unbelieved || 0) * 1;
  const scoreB = (b[1]?.ninja || 0) * 3 + (b[1]?.detective || 0) * 2 + (b[1]?.unbelieved || 0) * 1;
  return scoreB - scoreA;
}).map(([pid, stats]: any, idx) => {
  const playerCards = history
    .filter((h: any) => h.impostorId === pid)
    .map((h: any) => h.chosenCard);
  const uniqueCards = [...new Set(playerCards)];
  return (
    <tr key={pid} style={{borderBottom: '1px solid #eee', backgroundColor: idx % 2 ? '#fafafa' : 'white'}}>
      <td style={{padding: '8px', fontWeight: '500'}}>{roomState.players[pid]?.name || 'Desconocido'}</td>
      <td style={{padding: '8px', textAlign: 'center', color: '#d9534f'}}>{stats.ninja || 0}</td>
      <td style={{padding: '8px', textAlign: 'center', color: '#5cb85c'}}>{stats.detective || 0}</td>
      <td style={{padding: '8px', textAlign: 'center', color: '#0275d8'}}>{stats.unbelieved || 0}</td>
      <td style={{padding: '8px', fontSize: '0.9rem', fontStyle: 'italic'}}>
        {uniqueCards.length > 0 ? uniqueCards.join(', ') : '—'}
      </td>
    </tr>
  );
})}
</tbody>
</table>
</div>
) : (
<p className="small">Sin datos aún. ¡Juega algunas rondas!</p>
)}
</div>

<div style={{marginTop:12}}>
<h4>Matriz de votos</h4>
{history.length > 0 ? (
<div style={{overflowX: 'auto'}}>
<table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem'}}>
<thead>
<tr style={{backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>
<th style={{padding: '6px', textAlign: 'left', borderRight: '1px solid #ddd'}}>De / Para</th>
{Object.values(roomState.players).map((p: any) => (
<th key={p.id} style={{padding: '6px', textAlign: 'center', borderRight: '1px solid #ddd', minWidth: '60px'}}>
{p.name.substring(0, 8)}
</th>
))}
<th style={{padding: '6px', textAlign: 'center', minWidth: '60px'}}>✓/✗</th>
</tr>
</thead>
<tbody>
{Object.values(roomState.players).map((voter: any) => {
const voterCorrect = history.filter((h: any) => {
  const votedForImpostor = h.votes[voter.id] === h.impostorId;
  return votedForImpostor && h.correct;
}).length;
const voterIncorrect = history.filter((h: any) => {
  const votedForImpostor = h.votes[voter.id] === h.impostorId;
  return votedForImpostor && !h.correct;
}).length;
return (
<tr key={voter.id} style={{borderBottom: '1px solid #eee', backgroundColor: voter.id === roomState.players[Object.keys(roomState.players)[0]]?.id ? '#f9f9f9' : 'white'}}>
<td style={{padding: '6px', fontWeight: '500', borderRight: '1px solid #ddd'}}>{voter.name.substring(0, 8)}</td>
{Object.values(roomState.players).map((votee: any) => {
  const count = history.filter((h: any) => h.votes[voter.id] === votee.id).length;
  return (
    <td key={`${voter.id}-${votee.id}`} style={{
      padding: '6px',
      textAlign: 'center',
      borderRight: '1px solid #ddd',
      backgroundColor: count > 0 ? '#e8f4f8' : 'transparent',
      fontWeight: count > 0 ? '500' : 'normal',
      color: count > 0 ? '#0275d8' : '#999'
    }}>
      {count > 0 ? count : '-'}
    </td>
  );
})}
<td style={{padding: '6px', textAlign: 'center', fontWeight: '500'}}>
<span style={{color: '#5cb85c', marginRight: '4px'}}>{voterCorrect}</span>
<span style={{color: '#d9534f'}}>{voterIncorrect}</span>
</td>
</tr>
);
})}
</tbody>
</table>
</div>
) : (
<p className="small">Sin votos aún. ¡Juega la primera ronda!</p>
)}
</div>

<div style={{marginTop:12}}>
<h4>Historial de rondas</h4>
<ul>
{history.slice().reverse().map((h,i)=> (
<li key={i} className="small">{new Date(h.timestamp).toLocaleString()} — Tarjeta: {h.chosenCard} — Impostor: {roomState.players[h.impostorId]?.name || 'desconocido'} — Votado: {roomState.players[h.votedPlayerId]?.name || '—'} — Correcto: {h.correct ? 'Sí' : 'No'}</li>
))}
</ul>
</div>
</div>
)
}