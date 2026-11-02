import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoadingPage from '../components/LoadingPage'
import ThemeToggle from '../components/ThemeToggle'
import { usePortfolio } from '../hooks/usePortfolio'

export function ProtectedDashboard({ children }) {
  const { isAuthenticated, authReady } = usePortfolio()
  const location = useLocation()

  if (!authReady) return <LoadingPage />
  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" replace state={{ from: location }} />
  }

  return children
}

export function DashboardLoginPage() {
  const {
    isAuthenticated,
    login,
    authReady,
    authError,
    firebaseConfigured,
  } = usePortfolio()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const destination = location.state?.from?.pathname || '/dashboard'

  if (!authReady) return <LoadingPage />
  if (isAuthenticated) return <Navigate to={destination} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setSubmitting(true)
    setError('')

    try {
      await login(formData.get('email'), formData.get('password'))
      navigate(destination, { replace: true })
    } catch (loginError) {
      console.error('Não foi possível entrar no dashboard.', loginError)
      setError(loginError.code === 'auth/invalid-credential'
        ? 'E-mail ou senha incorretos.'
        : loginError.message || 'Não foi possível entrar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="wrap dashboard-login">
      <div className="dashboard-top">
        <a className="logo" href="/">Ana Beatriz Cruz</a>
        <ThemeToggle />
      </div>
      <form className="dashboard-panel login-panel" onSubmit={handleSubmit}>
        <span className="eyebrow">{firebaseConfigured ? 'Área do proprietário' : 'Área demonstrativa'}</span>
        <h1 className="details-title">Entrar no dashboard</h1>
        <p>{firebaseConfigured
          ? 'Entre com a conta cadastrada no Firebase.'
          : 'Esta demonstração local não oferece autenticação segura.'}</p>
        {firebaseConfigured && (
          <label className="form-field">
            E-mail
            <input name="email" type="email" required autoComplete="username" />
          </label>
        )}
        <label className="form-field">
          Senha
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        <button className="btn main" type="submit" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
        {(error || authError) && <p className="form-feedback" role="alert">{error || authError}</p>}
        {!firebaseConfigured && (
          <p className="form-hint">Senha de demonstração: <code>portfolio-demo</code></p>
        )}
      </form>
    </main>
  )
}

function Dashboard({ projects }) {
  const {
    messages,
    featuredProjectIds,
    updateFeaturedProjects,
    updateMessageAnswered,
    logout,
    firebaseConfigured,
    messagesLoading,
    messagesError,
    settingsError,
  } = usePortfolio()
  const navigate = useNavigate()
  const [actionError, setActionError] = useState('')

  async function toggleFeatured(id) {
    const nextIds = featuredProjectIds.includes(id)
      ? featuredProjectIds.filter((currentId) => currentId !== id)
      : [...featuredProjectIds, id]
    try {
      setActionError('')
      await updateFeaturedProjects(nextIds)
    } catch (error) {
      console.error('Não foi possível salvar os projetos em destaque.', error)
      setActionError('Não foi possível salvar os projetos em destaque.')
    }
  }

  async function toggleAnswered(message) {
    try {
      setActionError('')
      await updateMessageAnswered(message.id, !message.answered)
    } catch (error) {
      console.error('Não foi possível atualizar o status da mensagem.', error)
      setActionError('Não foi possível atualizar o status da mensagem.')
    }
  }

  async function handleLogout() {
    try {
      await logout()
      navigate('/dashboard/login', { replace: true })
    } catch (error) {
      console.error('Não foi possível encerrar a sessão.', error)
      setActionError('Não foi possível encerrar a sessão. Tente novamente.')
    }
  }

  return (
    <main className="wrap dashboard">
      <div className="dashboard-top">
        <div>
          <span className="eyebrow">{firebaseConfigured ? 'Área do proprietário' : 'Área demonstrativa'}</span>
          <h1 className="details-title">Dashboard</h1>
        </div>
        <div className="dashboard-actions">
          <ThemeToggle />
          <button className="btn ghost" type="button" onClick={handleLogout}>Sair</button>
        </div>
      </div>
      {!firebaseConfigured && (
        <p className="demo-warning">
          Demonstração local: os dados ficam neste navegador. O acesso não é seguro
          e as mensagens não são enviadas por e-mail.
        </p>
      )}
      {actionError && <p className="form-feedback" role="alert">{actionError}</p>}

      <section className="dashboard-panel">
        <h2>Projetos em destaque</h2>
        <p>Selecione os projetos que aparecem na seção de destaque da página inicial.</p>
        {settingsError && <p className="form-feedback" role="alert">{settingsError}</p>}
        <div className="featured-options">
          {projects.map((project, index) => {
            const id = String(index)
            return (
              <label className="featured-option" key={project.titulo}>
                <input
                  type="checkbox"
                  checked={featuredProjectIds.includes(id)}
                  onChange={() => toggleFeatured(id)}
                />
                <span>{project.titulo}</span>
              </label>
            )
          })}
        </div>
      </section>

      <section className="dashboard-panel">
        <h2>Mensagens recebidas</h2>
        {messagesLoading ? (
          <p className="loading-message" role="status">Carregando mensagens...</p>
        ) : messagesError ? (
          <p className="form-feedback" role="alert">{messagesError}</p>
        ) : messages.length ? (
          <div className="message-list">
            {messages.map((message) => (
              <article className={`message-card ${message.answered ? 'answered' : ''}`} key={message.id}>
                <div className="message-meta">
                  <strong>{message.name}</strong>
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                  <time dateTime={message.createdAt}>
                    {new Date(message.createdAt).toLocaleString('pt-BR')}
                  </time>
                </div>
                <p>{message.message}</p>
                {message.emailStatus === 'failed' && (
                  <p className="form-feedback">Mensagem salva, mas o e-mail não foi enviado.</p>
                )}
                <button
                  className="chip"
                  type="button"
                  aria-pressed={message.answered}
                  onClick={() => toggleAnswered(message)}
                >
                  {message.answered ? 'Marcar como pendente' : 'Marcar como respondida'}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty">
            {firebaseConfigured
              ? 'Nenhuma mensagem recebida.'
              : 'Nenhuma mensagem registrada neste navegador.'}
          </p>
        )}
      </section>
    </main>
  )
}

export default function ProtectedDashboardPage({ projects }) {
  return (
    <ProtectedDashboard>
      <Dashboard projects={projects} />
    </ProtectedDashboard>
  )
}
