export default function About({ onBack }: any) {
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:'100vh'}}>
      <div className="card" style={{maxWidth:'600px', width:'100%'}}>
        <h2>Sobre "El Impostor"</h2>
        <div style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
          <img
            src="/images/about-page-image.jpg"
            alt="El Impostor"
            style={{width:'100%', maxWidth:'480px', borderRadius:'12px', boxShadow:'0 6px 18px rgba(0,0,0,0.12)'}}
          />
        </div>
        <p style={{lineHeight:1.6}}>
          Nos juntamos con amigos y este juego me pareció entretenido. Además para ser más sustentables (ahorrando papel, aunque escribirlo también es grato) y, por supuesto, aplicar la computación, decidí hacer este proyecto: "El Impostor".
        </p>
        <button onClick={onBack} style={{marginTop:20, width:'100%'}}>⬅️ Volver</button>
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
  );
}
