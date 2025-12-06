import { useState } from 'react'


export default function Lobby({ socket, onShowAbout }: any){
const [roomId, setRoomId] = useState('room-1')
const [name, setName] = useState('')
const [cardsPerPlayer, setCardsPerPlayer] = useState('1')
const [imageClicks, setImageClicks] = useState(0)
const [showImageEasterEgg, setShowImageEasterEgg] = useState(false)

const handleImageClick = () => {
  const newClicks = imageClicks + 1;
  setImageClicks(newClicks);
  if (newClicks >= 11) {
    setShowImageEasterEgg(true);
  }
};

const createRoom = () => {
if (!name || !cardsPerPlayer) return alert('Nombre y número de tarjetas necesarios')
socket.emit('create-room', { roomId, playerName: name, cardsPerPlayer: parseInt(cardsPerPlayer) }, (res:any) => {
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
<div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:'100vh'}}>
<div className="card" style={{maxWidth:'500px', width:'100%'}}>
<h2>El Impostor — Lobby</h2>
<div style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
<img 
  src={showImageEasterEgg ? "/images/main-page-easter-egg-image.jpg" : "/images/main-page-image-3.jpg"} 
  alt="El Impostor" 
  style={{width:'100%', maxWidth:'400px', borderRadius:'8px', cursor:'pointer', transition:'transform 0.2s'}}
  onClick={handleImageClick}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
/>
</div>
<label className="small">Nombre</label>
<input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />


<label className="small" style={{marginTop:8}}>Room ID</label>
<input value={roomId} onChange={e=>setRoomId(e.target.value)} />


<label className="small" style={{marginTop:8}}>Tarjetas por jugador (solo al crear)</label>
<input type="number" min="1" value={cardsPerPlayer} onChange={e=>setCardsPerPlayer(e.target.value)} placeholder="Ej: 2" />


<div style={{display:'flex', gap:8, marginTop:12}}>
<button onClick={createRoom}>🏠 Crear sala</button>
<button onClick={joinRoom}>➕ Unirse</button>
<button onClick={onShowAbout} style={{marginLeft:'auto'}}>ℹ️ Sobre el proyecto</button>
</div>


<p className="small" style={{marginTop:12}}>1. Crea una sala e indica cuántas tarjetas enviará cada jugador. 2. Los demás se unen con el Room ID. 3. Cada jugador escribe sus tarjetas. 4. ¡Comienza el juego!</p>
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