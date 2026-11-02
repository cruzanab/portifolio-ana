import { useGitHubRepository } from '../hooks/useGitHubRepository'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

function GitHubRepositoryStatus({ repositoryUrl, compact = false }) {
  const { status, repository, error } = useGitHubRepository(repositoryUrl)

  if (status === 'unconfigured') {
    return (
      <div className={`github-status ${compact ? 'compact' : ''}`} aria-live="polite">
        <strong>GitHub</strong>
        <span>Repositório não vinculado.</span>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className={`github-status ${compact ? 'compact' : ''}`} role="status" aria-live="polite">
        <strong>GitHub</strong>
        <span>Carregando dados do repositório...</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={`github-status error ${compact ? 'compact' : ''}`} role="status" aria-live="polite">
        <strong>GitHub</strong>
        <span>{error}</span>
      </div>
    )
  }

  const updatedDate = new Date(repository.updatedAt)
  const lastUpdated = Number.isNaN(updatedDate.getTime())
    ? 'Data indisponível'
    : dateFormatter.format(updatedDate)

  return (
    <div className={`github-status ${compact ? 'compact' : ''}`}>
      <div className="github-status-heading">
        <strong>{repository.name}</strong>
        {repository.archived && <span className="github-archived">Arquivado</span>}
      </div>
      {repository.description && <p>{repository.description}</p>}
      <dl>
        <div><dt>Linguagem</dt><dd>{repository.language || 'Não informada'}</dd></div>
        <div><dt>Estrelas</dt><dd>{repository.stars}</dd></div>
        <div><dt>Atualizado</dt><dd>{lastUpdated}</dd></div>
      </dl>
      {!compact && (
        <a href={repository.url} target="_blank" rel="noopener noreferrer">
          Ver no GitHub
        </a>
      )}
    </div>
  )
}

export default GitHubRepositoryStatus
