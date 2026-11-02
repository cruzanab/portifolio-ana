import { useEffect, useState } from 'react'
import { getGitHubRepository, parseGitHubRepositoryUrl } from '../services/github'

export function useGitHubRepository(repositoryUrl) {
  const [result, setResult] = useState(null)
  const configuredRepository = parseGitHubRepositoryUrl(repositoryUrl)

  useEffect(() => {
    if (!parseGitHubRepositoryUrl(repositoryUrl)) return undefined

    let active = true

    getGitHubRepository(repositoryUrl)
      .then((repository) => {
        if (active) {
          setResult({ repositoryUrl, status: 'ready', repository, error: '' })
        }
      })
      .catch((error) => {
        if (active) {
          setResult({
            repositoryUrl,
            status: 'error',
            repository: null,
            error: error.message || 'Falha ao consultar o GitHub.',
          })
        }
      })

    return () => {
      active = false
    }
  }, [repositoryUrl])

  if (!configuredRepository) {
    return { status: 'unconfigured', repository: null, error: '' }
  }

  if (!result || result.repositoryUrl !== repositoryUrl) {
    return { status: 'loading', repository: null, error: '' }
  }

  return result
}
