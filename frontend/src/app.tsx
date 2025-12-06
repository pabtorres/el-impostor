import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Lobby from './components/Lobby'
import CardSubmission from './components/CardSubmission'
import Game from './components/Game'

declare global {
  interface Window {
    APP_CONFIG?: {
      backendUrl?: string
    }
  }
}

// Determine backend URL
const getBackendUrl = () => {
  // Check window config first (loaded from config.js)
  if (window.APP_CONFIG?.backendUrl) {
    return window.APP_CONFIG.backendUrl
  }
  
  // Use build-time env var if available
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL
  }
  
  // Default: for LAN/local testing
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}:4000`
  }
  
  // Fallback for production
  return `${window.location.protocol}//${window.location.hostname}:4000`
}

const backendUrl = getBackendUrl()
console.log('Connecting to backend:', backendUrl)
const socket = io(backendUrl)


export default function App(){
const [roomState, setRoomState] = useState<any>(null)
const [playerId, setPlayerId] = useState<string | null>(null)
const [endGameData, setEndGameData] = useState<any>(null)


useEffect(() => {
socket.on('connect', () => setPlayerId(socket.id || null))
socket.on('room-state', (rs:any) => setRoomState(rs))
socket.on('round-start', (payload:any) => {
console.log('round-start', payload)
})
socket.on('game-ended', (finalStats:any) => {
console.log('Game ended with stats:', finalStats)
setEndGameData(finalStats)
setRoomState(null)
})
}, [])

const backToLobby = () => {
setEndGameData(null)
setRoomState(null)
window.location.reload()
}

if (endGameData) {
return (
<div className="app-root">
<div className="card" style={{maxWidth:'900px', margin:'40px auto', padding:'30px'}}>
<h2 style={{textAlign:'center', marginBottom:'30px'}}>🏆 Estadísticas Finales</h2>

{endGameData.awards ? (
  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'12px', marginBottom:'24px'}}>
    <div style={{padding:'12px', border:'1px solid #eee', borderRadius:'8px', background:'#f5f9ff'}}>
      <div style={{fontWeight:600}}>😵 Más veces detectado</div>
      <div style={{marginTop:'6px'}}>
        {endGameData.awards?.mostDetectedImpostor ? (
          <>
            <div>{endGameData.awards.mostDetectedImpostor.name}</div>
            <div style={{color:'#555', fontSize:'0.9rem'}}>{endGameData.awards.mostDetectedImpostor.value} veces como impostor detectado</div>
          </>
        ) : '—'}
      </div>
    </div>

    <div style={{padding:'12px', border:'1px solid #eee', borderRadius:'8px', background:'#f5fff7'}}>
      <div style={{fontWeight:600}}>🥷 Más veces indetectable</div>
      <div style={{marginTop:'6px'}}>
        {endGameData.awards?.mostUndetectedImpostor ? (
          <>
            <div>{endGameData.awards.mostUndetectedImpostor.name}</div>
            <div style={{color:'#555', fontSize:'0.9rem'}}>{endGameData.awards.mostUndetectedImpostor.value} rondas sin ser descubierto</div>
          </>
        ) : '—'}
      </div>
    </div>

    <div style={{padding:'12px', border:'1px solid #eee', borderRadius:'8px', background:'#fff8e6'}}>
      <div style={{fontWeight:600}}>🔍 Detectó más impostores</div>
      <div style={{marginTop:'6px'}}>
        {endGameData.awards?.topDetective ? (
          <>
            <div>{endGameData.awards.topDetective.name}</div>
            <div style={{color:'#555', fontSize:'0.9rem'}}>{endGameData.awards.topDetective.value} veces adivinó al impostor</div>
          </>
        ) : '—'}
      </div>
    </div>
  </div>
 ) : null}

<div style={{marginBottom:'30px'}}>
<h3>🎯 Logros</h3>
<div style={{overflowX:'auto'}}>
<table style={{width:'100%', borderCollapse:'collapse', marginTop:12}}>
<thead>
<tr style={{backgroundColor:'#f5f5f5', borderBottom:'2px solid #ddd'}}>
<th style={{padding:'12px', textAlign:'left'}}>Jugador</th>
<th style={{padding:'12px', textAlign:'center'}}>🥷 Ninja</th>
<th style={{padding:'12px', textAlign:'center'}}>🔍 Detective</th>
<th style={{padding:'12px', textAlign:'center'}}>😢 Unbelieved</th>
</tr>
</thead>
<tbody>
{Object.entries(endGameData.stats || {}).map(([pid, stats]: any) => (
<tr key={pid} style={{borderBottom:'1px solid #eee'}}>
<td style={{padding:'12px', fontWeight:500}}>{endGameData.players[pid]?.name || 'Unknown'}</td>
<td style={{padding:'12px', textAlign:'center', color:'#d9534f', fontWeight:'bold'}}>{stats.ninja || 0}</td>
<td style={{padding:'12px', textAlign:'center', color:'#5cb85c', fontWeight:'bold'}}>{stats.detective || 0}</td>
<td style={{padding:'12px', textAlign:'center', color:'#0275d8', fontWeight:'bold'}}>{stats.unbelieved || 0}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>

<div style={{marginBottom:'30px'}}>
<h3>📊 Historial de Rondas</h3>
{endGameData.history && endGameData.history.length > 0 ? (
<div style={{maxHeight:'400px', overflowY:'auto'}}>
{endGameData.history.map((h:any, idx:number) => (
<div key={idx} style={{
padding:'12px',
marginBottom:'8px',
backgroundColor: h.correct ? '#e8f5e9' : '#ffebee',
borderRadius:'6px',
border: h.correct ? '1px solid #4caf50' : '1px solid #f44336'
}}>
<div style={{fontWeight:500}}>
Ronda {idx + 1}: {h.chosenCard}
</div>
<div style={{fontSize:'0.9rem', color:'#666', marginTop:'4px'}}>
Impostor: {endGameData.players[h.impostorId]?.name || 'Unknown'} | 
Votado: {endGameData.players[h.votedPlayerId]?.name || 'Unknown'} | 
{h.correct ? '✅ Correcto' : '❌ Incorrecto'}
</div>
</div>
))}
</div>
) : (
<p className="small">No hay historial de rondas</p>
)}
</div>

<button 
onClick={backToLobby}
style={{width:'100%', padding:'14px', backgroundColor:'#2196f3', color:'white', fontWeight:600, fontSize:'1rem', border:'none', borderRadius:'8px', cursor:'pointer'}}
>
🏠 Volver al Lobby
</button>
</div>
</div>
)
}

return (
<div className="app-root">
{!roomState ? (
<Lobby socket={socket} />
) : roomState.gameState === 'waiting' || roomState.gameState === 'submitting' ? (
<CardSubmission socket={socket} roomState={roomState} playerId={playerId} />
) : (
<Game socket={socket} roomState={roomState} playerId={playerId} />
)}
</div>
)
}
