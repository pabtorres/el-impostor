import { useState } from 'react'


export default function CardSubmission({ socket, roomState, playerId }: any) {
  const [cards, setCards] = useState<string[]>(Array(roomState.cardsPerPlayer).fill(''))
  const player = roomState.players[playerId]
  const submitted = player?.cards && player.cards.length > 0

  const handleCardChange = (index: number, value: string) => {
    const newCards = [...cards]
    newCards[index] = value
    setCards(newCards)
  }

  const submitCards = () => {
    if (cards.some(c => !c.trim())) return alert('Completa todas las tarjetas')
    socket.emit('submit-cards', { roomId: roomState.id, cards }, (res: any) => {
      if (res.error) alert(res.error)
    })
  }

  const startGame = () => {
    socket.emit('start-game', { roomId: roomState.id }, (res: any) => {
      if (res.error) alert(res.error)
    })
  }

  const toggleStartingPlayer = () => {
    socket.emit('toggle-starting-player', { roomId: roomState.id, enabled: !roomState.showStartingPlayer }, (res: any) => {
      if (res.error) alert(res.error)
    })
  }

  const allSubmitted = Object.values(roomState.players).every((p: any) => p.cards && p.cards.length > 0)
  const isAdmin = player?.isAdmin
  const playerCount = Object.keys(roomState.players).length
  const canStartGame = allSubmitted && playerCount >= 3

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:'100vh'}}>
      <div className="card" style={{maxWidth:'600px', width:'100%'}}>
      <h2>Waiting Room</h2>
      <div style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
        <img src="/images/waiting-room-page-image.jpg" alt="Waiting Room" style={{width:'100%', maxWidth:'400px', borderRadius:'8px'}} />
      </div>
      <h3>Sala: {roomState.id}</h3>
      <p>Jugadores: {Object.values(roomState.players).map((p: any) => p.name).join(', ')}</p>

      <div style={{ marginTop: 12 }}>
        <h4>Envío de Tarjetas</h4>
        <p className="small">Cada jugador debe enviar {roomState.cardsPerPlayer} tarjeta(s)</p>

        {!submitted ? (
          <div>
            <div style={{ marginTop: 8 }}>
              {cards.map((card, idx) => (
                <div key={idx} style={{ marginBottom: 8 }}>
                  <label className="small">Tarjeta {idx + 1}</label>
                  <input
                    value={card}
                    onChange={(e) => handleCardChange(idx, e.target.value)}
                    placeholder={`Ej: Tarjeta ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
            <button onClick={submitCards} style={{ marginTop: 12, width: '100%' }}>
              Enviar mis tarjetas
            </button>
          </div>
        ) : (
          <div style={{ padding: 12, backgroundColor: '#e8f5e9', borderRadius: 8, marginTop: 8 }}>
            <p style={{ margin: 0, color: '#2e7d32', fontWeight: 500 }}>✓ Tarjetas enviadas</p>
            <p className="small" style={{ margin: '4px 0 0 0', color: '#558b2f' }}>
              {player.cards.join(', ')}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Estado de Jugadores</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {Object.values(roomState.players).map((p: any) => (
            <li key={p.id} style={{ padding: 8, marginBottom: 4, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
              <span style={{ fontWeight: 500 }}>{p.name}</span>
              <span style={{ marginLeft: 8, fontSize: '0.9rem', color: p.cards?.length > 0 ? '#4caf50' : '#999' }}>
                {p.cards?.length > 0 ? `✓ ${p.cards.length} tarjeta(s)` : 'Esperando...'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 12, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Opciones del Juego:</p>
            <button
              onClick={toggleStartingPlayer}
              style={{
                width: '100%',
                backgroundColor: roomState.showStartingPlayer ? '#2196f3' : '#999',
                color: 'white',
                padding: '8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500,
                marginBottom: 8
              }}
            >
              {roomState.showStartingPlayer ? '🎤 Mostrar jugador que inicia' : '🎤 Ocultar jugador que inicia'}
            </button>
          </div>

          <button 
            onClick={startGame} 
            disabled={!canStartGame}
            style={{ 
              width: '100%', 
              backgroundColor: canStartGame ? '#4caf50' : '#ccc',
              cursor: canStartGame ? 'pointer' : 'not-allowed',
              opacity: canStartGame ? 1 : 0.6
            }}
          >
            ¡Comenzar Juego!
          </button>
          {!canStartGame && (
            <p className="small" style={{ marginTop: 8, color: '#f44336', textAlign: 'center' }}>
              {playerCount < 3 
                ? `Se necesitan al menos 3 jugadores (actualmente: ${playerCount})`
                : 'Esperando que todos envíen sus tarjetas'}
            </p>
          )}
        </div>
      )}
    </div>

    <footer style={{marginTop:'auto', padding:'20px', textAlign:'center', width:'100%', borderTop:'1px solid #ccc'}}>
      <p style={{margin:'5px 0', fontSize:'14px'}}>
        © 2025 <a href="https://dcc.uchile.cl/~patorres/" target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'inherit'}}>Pablo Felipe Torres Gutiérrez</a>
      </p>
      <p style={{margin:'8px 0', fontSize:'12px'}}>
        <a href="https://buymeacoffee.com/pabtorres" target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'#0275d8', fontWeight:500}}>☕ Invítame una Limonada Menta Jengibre</a>
      </p>
    </footer>
    </div>
  )
}
