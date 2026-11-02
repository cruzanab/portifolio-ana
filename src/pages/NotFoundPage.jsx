import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  useEffect(() => {
    document.title = 'Página não encontrada | Portfólio'
  }, [])

  return (
    <main className="wrap">
      <section className="project-details not-found">
        <span className="eyebrow">Erro 404</span>
        <h1 className="details-title">Página não encontrada</h1>
        <p>O endereço pode estar incorreto ou a página não existe mais.</p>
        <Link className="btn main" to="/">Voltar ao início</Link>
      </section>
    </main>
  )
}

export default NotFoundPage
