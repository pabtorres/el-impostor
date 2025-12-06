import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Lobby from './components/Lobby'
import CardSubmission from './components/CardSubmission'
import Game from './components/Game'

// Determine backend URL
// Try env var first (for build-time config), then check localStorage (for runtime config), then default to LAN
const getBackendUrl = () => {
  // Check if we have a stored backend URL (set by user or admin)
  const storedUrl = window.localStorage.getItem('backendUrl')
  if (storedUrl) return storedUrl
  
  // Use build-time env var if available
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL
  }
  
  // Default: for LAN/local testing, use localhost:4000; for deployed, use same domain
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}:4000`
  }
  
  // For production Railway deployment, we need the backend URL
  // This will be set via VITE_BACKEND_URL env var at build time
  return `${window.location.protocol}//${window.location.hostname}:4000`
}

const backendUrl = getBackendUrl()
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
