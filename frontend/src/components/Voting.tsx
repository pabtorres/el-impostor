interface VotingProps {
  socket: any
  players: any
  tally: any
  roomId: string
}

export default function Voting({ socket, players, tally, roomId }: VotingProps){
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
{playerList.map((p:any)=> (
<div key={p.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div>{p.name}</div>
<div style={{display:'flex', gap:8, alignItems:'center'}}>
<button onClick={()=>castVote(p.id)}>Votar</button>
<div className="small">Votos: {tally[p.id] || 0}</div>
</div>
</div>
))}
</div>
</div>
)
}