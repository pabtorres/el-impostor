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

  const allSubmitted = Object.values(roomState.players).every((p: any) => p.cards && p.cards.length > 0)
  const isAdmin = player?.isAdmin

  return (
    <div className="card">
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

      {isAdmin && allSubmitted && (
        <button onClick={startGame} style={{ marginTop: 12, width: '100%', backgroundColor: '#4caf50' }}>
          ¡Comenzar Juego!
        </button>
      )}
    </div>
  )
}
