interface VotingProps {
  socket: any
  players: any
  tally: any
  roomId: string
  playerId: string | null
  isImpostor?: boolean
}

export default function Voting({ socket, players, tally, roomId, playerId, isImpostor = false }: VotingProps){
const playerList = Object.values(players || {})


const castVote = (targetId: string) => {
socket.emit('vote', { roomId, targetPlayerId: targetId }, (res: any) => { 
  if (res.error) alert(res.error) 
})
}

return (
<div style={{marginTop:12}}>
<h4>Votar</h4>
<div style={{display:'flex', flexDirection:'column', gap:8}}>
{playerList.map((p:any)=> {
  const isSelf = p.id === playerId
  const getButtonText = () => {
    if (isSelf) return isImpostor ? 'Voto Aleatorio' : 'No puedes votarte'
    return 'Votar'
  }
  return (
  <div key={p.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
    <div>{p.name}</div>
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <button onClick={()=>castVote(p.id)} disabled={isSelf && !isImpostor} style={{opacity: (isSelf && !isImpostor) ? 0.5 : 1}}>
        {getButtonText()}
      </button>
      <div className="small">Votos: {tally[p.id] || 0}</div>
    </div>
  </div>
)})}
</div>
</div>
)
}