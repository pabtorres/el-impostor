import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Lobby from './components/Lobby'
import CardSubmission from './components/CardSubmission'
import Game from './components/Game'


const socket = io('http://localhost:4000')


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
