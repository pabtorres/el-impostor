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


useEffect(() => {
socket.on('connect', () => setPlayerId(socket.id || null))
socket.on('room-state', (rs:any) => setRoomState(rs))
socket.on('round-start', (payload:any) => {
console.log('round-start', payload)
})
}, [])


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
