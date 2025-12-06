import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Lobby from './components/Lobby'
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
) : (
<Game socket={socket} roomState={roomState} playerId={playerId} />
)}
</div>
)
}
