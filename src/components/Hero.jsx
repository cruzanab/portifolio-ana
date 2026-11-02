import { useState } from 'react'
import anaImg from '../assets/ana.webp'

function Hero() {
  const [mostrarFoto, setMostrarFoto] = useState(true)

  return (
    <div className="hero" id="inicio">
      <div className="hero-text">
        <span className="eyebrow">Desenvolvedora de Software Fullstack</span>
        <h1>
          Ana Beatriz <em>Cruz</em>
        </h1>
        <p>
          Sou desenvolvedora Fullstack que trabalha na área a 3 anos. Estou na minha
          graduação em Engenharia de Software pela FIAP, trabalhando atualmente focada no back-end.
        </p>
        <div className="row">
          <a className="btn main" href="#projetos">Ver projetos</a>
          <a className="btn ghost" href="#contato">Entrar em contato</a>
        </div>
      </div>

      <figure className="photo">
        <div className="frame">
          <div className="ph">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            <span>Foto de Ana Beatriz Cruz</span>
          </div>
          {mostrarFoto && (
            <img
              src={anaImg}
              alt="Foto de Ana Beatriz Cruz"
              width="200"
              height="200"
              onError={() => setMostrarFoto(false)}
            />
          )}
        </div>
      </figure>
    </div>
  )
}

export default Hero