import { afterEach, describe, expect, it, vi } from 'vitest'
import { getGitHubRepository, parseGitHubRepositoryUrl } from './github'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('parseGitHubRepositoryUrl', () => {
  it('extracts the owner and repository from a public GitHub URL', () => {
    expect(parseGitHubRepositoryUrl('https://github.com/owner/project.git')).toEqual({
      owner: 'owner',
      repository: 'project',
    })
  })

  it('rejects placeholders and non-HTTPS links', () => {
    expect(parseGitHubRepositoryUrl('https://github.com/repoIndisponivel')).toBeNull()
    expect(parseGitHubRepositoryUrl('http://github.com/owner/project')).toBeNull()
  })
})

describe('getGitHubRepository', () => {
  it('loads public repository metadata and reuses the result from cache', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        full_name: 'owner/cache-test',
        html_url: 'https://github.com/owner/cache-test',
        description: 'Public project',
        language: 'JavaScript',
        updated_at: '2026-10-01T10:00:00Z',
        stargazers_count: 4,
        forks_count: 2,
        open_issues_count: 1,
        archived: false,
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const first = await getGitHubRepository('https://github.com/owner/cache-test')
    const second = await getGitHubRepository('https://github.com/owner/cache-test')

    expect(first.name).toBe('owner/cache-test')
    expect(first.language).toBe('JavaScript')
    expect(second).toEqual(first)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('reports missing and rate-limited repositories explicitly', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers(),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Headers({ 'x-ratelimit-remaining': '0' }),
      })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getGitHubRepository('https://github.com/owner/missing-test'))
      .rejects.toThrow('Repositório não encontrado ou privado.')
    await expect(getGitHubRepository('https://github.com/owner/limited-test'))
      .rejects.toThrow('Limite temporário de consultas do GitHub atingido.')
  })
})
