interface VotingProps {
  socket: any
  players: any
  tally: any
  roomId: string
  playerId: string | null
}

export default function Voting({ socket, players, tally, roomId, playerId }: VotingProps){
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
  return (
  <div key={p.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
    <div>{p.name}</div>
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <button onClick={()=>castVote(p.id)} disabled={isSelf} style={{opacity: isSelf ? 0.5 : 1}}>
        {isSelf ? 'No puedes votarte' : 'Votar'}
      </button>
      <div className="small">Votos: {tally[p.id] || 0}</div>
    </div>
  </div>
)})}
</div>
</div>
)
}