export default function Instructions({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '700px', width: '100%' }}>
        <button onClick={onBack} style={{ marginBottom: '20px' }}>← Volver al Lobby</button>
        
        <h2>¿Cómo jugar?</h2>

        {/* Espacio para imagen con las mismas proporciones naturales de la portada */}
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto 20px',
            background: '#f2f2f2',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/instructions-page-image.jpg"
            alt="El Impostor"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
        
        <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <h3>🎯 Objetivo del Juego</h3>
          <p>
            En cada ronda, un jugador será el <strong>impostor</strong> secreto. Los demás jugadores deben descubrir quién es 
            el impostor votando, mientras el impostor intenta pasar desapercibido.
          </p>

          <h3>📝 Preparación (3+ jugadores)</h3>
          <ol>
            <li><strong>Crear sala:</strong> Un jugador crea una sala indicando cuántas tarjetas enviará cada jugador (recomendado: 1-3).</li>
            <li><strong>Unirse:</strong> Los demás jugadores se unen usando el mismo Room ID.</li>
            <li><strong>Escribir tarjetas:</strong> Cada jugador escribe sus tarjetas (palabras, conceptos, lugares, etc.).</li>
            <li><strong>Iniciar juego:</strong> Cuando todos hayan enviado sus tarjetas, cualquiera puede iniciar el juego.</li>
          </ol>

          <h3>🎮 Cómo se Juega Cada Ronda</h3>
          <ol>
            <li><strong>Asignación secreta:</strong> 
              <ul>
                <li>Se elige una tarjeta al azar del mazo.</li>
                <li>Se elige un impostor al azar.</li>
                <li>Todos los jugadores ven la tarjeta elegida, <strong>EXCEPTO el impostor</strong>.</li>
              </ul>
            </li>
            
            <li><strong>Conversación:</strong> 
              <ul>
                <li>Los jugadores conversan entre sí (por voz, chat, o en persona).</li>
                <li>Hacen preguntas sutiles sobre la tarjeta sin revelarla directamente.</li>
                <li>El impostor intenta actuar como si supiera de qué se habla.</li>
              </ul>
            </li>
            
            <li><strong>Votación:</strong> 
              <ul>
                <li>Cada jugador vota a quién cree que es el impostor.</li>
                <li>Los votos son públicos y se actualizan en tiempo real.</li>
              </ul>
            </li>
            
            <li><strong>Resultado:</strong> 
              <ul>
                <li>Se revela quién era el impostor y a quién votó la mayoría.</li>
                <li>Si atraparon al impostor: ganan los detectives 🔍</li>
                <li>Si el impostor pasó desapercibido: gana el impostor 🥷</li>
              </ul>
            </li>
            
            <li><strong>Siguiente ronda:</strong> Cualquier jugador puede iniciar la siguiente ronda hasta que se acaben las tarjetas.</li>
          </ol>

          <h3>🏆 Sistema de Puntos</h3>
          <p>Al final del juego se muestran 3 premios especiales:</p>
          <ul>
            <li><strong>🥷 Impostor Más Detectado:</strong> El jugador que fue impostor y lo atraparon más veces.</li>
            <li><strong>🤫 Impostor Más Silencioso:</strong> El jugador que fue impostor y NO lo atraparon más veces.</li>
            <li><strong>🔍 Mejor Detective:</strong> El jugador que votó correctamente al impostor más veces.</li>
          </ul>

          <h3>💡 Consejos</h3>
          <ul>
            <li><strong>Para los detectives:</strong> Hagan preguntas específicas pero sin revelar la palabra. Observen quién responde de forma vaga o contradictoria.</li>
            <li><strong>Para el impostor:</strong> Escucha atentamente las respuestas de otros y trata de ser consistente con lo que dicen. ¡No te delates con respuestas muy genéricas!</li>
            <li><strong>Estrategia grupal:</strong> Entre más rondas jueguen, más divertido se vuelve porque aprenden los patrones de cada jugador.</li>
          </ul>

          <h3>🎲 Variantes Opcionales</h3>
          <ul>
            <li><strong>Modo silencioso:</strong> Los jugadores no pueden hablar, solo hacer gestos o mímica.</li>
            <li><strong>Un minuto:</strong> Límite de tiempo de 1 minuto para la conversación antes de votar.</li>
            <li><strong>Doble impostor:</strong> Usar múltiples tarjetas por ronda (avanzado).</li>
          </ul>

          <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
            <p style={{ margin: 0 }}>
              <strong>Nota:</strong> Este juego es más divertido cuando se juega con comunicación por voz 
              (Discord, Zoom, WhatsApp, o en persona). La aplicación solo maneja las tarjetas y votaciones.
            </p>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', width: '100%', borderTop: '1px solid #ccc' }}>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          © 2025 <a href="https://dcc.uchile.cl/~patorres/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Pablo Felipe Torres Gutiérrez</a>
        </p>
        <p style={{ margin: '8px 0', fontSize: '12px' }}>
          <a href="https://buymeacoffee.com/pabtorres" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0275d8', fontWeight: 500 }}>☕ Invítame una Limonada Menta Jengibre</a>
        </p>
      </footer>
    </div>
  )
}
