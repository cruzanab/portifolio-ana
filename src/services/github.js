const API_BASE_URL = 'https://api.github.com/repos'
const CACHE_DURATION = 10 * 60 * 1000
const repositoryCache = new Map()
const pendingRequests = new Map()

export function parseGitHubRepositoryUrl(repositoryUrl) {
  if (!repositoryUrl || repositoryUrl.includes('repoIndisponivel')) return null

  try {
    const url = new URL(repositoryUrl)
    const [owner, repositoryPath] = url.pathname.split('/').filter(Boolean)
    const repository = repositoryPath?.replace(/\.git$/i, '')

    if (
      url.protocol !== 'https:'
      || url.hostname !== 'github.com'
      || !owner
      || !repository
    ) {
      return null
    }

    return { owner, repository }
  } catch {
    return null
  }
}

export function getGitHubRepository(repositoryUrl) {
  const parsedRepository = parseGitHubRepositoryUrl(repositoryUrl)
  if (!parsedRepository) return Promise.resolve(null)

  const key = `${parsedRepository.owner}/${parsedRepository.repository}`.toLowerCase()
  const cached = repositoryCache.get(key)
  if (cached && Date.now() - cached.cachedAt < CACHE_DURATION) {
    return Promise.resolve(cached.data)
  }

  if (pendingRequests.has(key)) return pendingRequests.get(key)

  const request = fetch(
    `${API_BASE_URL}/${encodeURIComponent(parsedRepository.owner)}/${encodeURIComponent(parsedRepository.repository)}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  ).then(async (response) => {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repositório não encontrado ou privado.')
      }

      const rateLimitReached = response.status === 429
        || (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0')

      if (rateLimitReached) {
        throw new Error('Limite temporário de consultas do GitHub atingido. Tente novamente mais tarde.')
      }

      throw new Error('Não foi possível consultar este repositório no GitHub.')
    }

    const data = await response.json()
    const repository = {
      name: data.full_name,
      url: data.html_url,
      description: data.description,
      language: data.language,
      updatedAt: data.updated_at,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      archived: data.archived,
    }

    repositoryCache.set(key, { data: repository, cachedAt: Date.now() })
    return repository
  }).catch((error) => {
    if (error instanceof TypeError) {
      throw new Error('Falha de conexão ao consultar o GitHub. Verifique sua internet e tente novamente.')
    }

    throw error
  }).finally(() => {
    pendingRequests.delete(key)
  })

  pendingRequests.set(key, request)
  return request
}
