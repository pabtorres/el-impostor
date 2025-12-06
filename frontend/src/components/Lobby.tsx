import { useState } from 'react'


export default function Lobby({ socket }: any){
const [roomId, setRoomId] = useState('room-1')
const [name, setName] = useState('')
const [cardsText, setCardsText] = useState('')


const createRoom = () => {
const cards = cardsText.split('\n').map(s => s.trim()).filter(Boolean)
if (!name || cards.length === 0) return alert('Nombre y tarjetas necesarias (una por jugador)')
socket.emit('create-room', { roomId, playerName: name, cards }, (res:any) => {
if (res.error) alert(res.error)
})
}


const joinRoom = () => {
if (!name) return alert('Pon tu nombre')
socket.emit('join-room', { roomId, playerName: name }, (res:any) => {
if (res.error) alert(res.error)
})
}


return (
<div className="card">
<h2>El Impostor — Lobby</h2>
<label className="small">Nombre</label>
<input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />


<label className="small" style={{marginTop:8}}>Room ID</label>
<input value={roomId} onChange={e=>setRoomId(e.target.value)} />


<label className="small" style={{marginTop:8}}>Tarjetas (una por línea, solo al crear)</label>
<textarea rows={6} value={cardsText} onChange={e=>setCardsText(e.target.value)} placeholder={`Ej:\nLeña\nEstufa\nLluvia`} />


<div style={{display:'flex', gap:8, marginTop:12}}>
<button onClick={createRoom}>Crear sala</button>
<button onClick={joinRoom}>Unirse</button>
</div>


<p className="small" style={{marginTop:12}}>Nota: la persona que crea la sala debe pegar N tarjetas (N = número jugadores). Cada partida usa una tarjeta y se reparten réplicas.</p>
</div>
)
}