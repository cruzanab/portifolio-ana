import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProjectImage from '../components/ProjectImage'
import GitHubRepositoryStatus from '../components/GitHubRepositoryStatus'
import { parseGitHubRepositoryUrl } from '../services/github'
import NotFoundPage from './NotFoundPage'

function ProjectDetailsPage({ projects, projectTypes, gradients }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const index = Number(slug)
  const validIndex = Number.isInteger(index) && index >= 0 && index < projects.length
  const project = validIndex ? projects[index] : null

  useEffect(() => {
    document.title = project ? `${project.titulo} | Portfólio` : 'Projeto não encontrado | Portfólio'
    window.scrollTo(0, 0)
  }, [project])

  if (!project) {
    return <NotFoundPage />
  }

  const initials = project.titulo
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => [...word][0])
    .join('')
    .toUpperCase()

  return (
    <section className="project-details">
      <button className="btn ghost back-button" type="button" onClick={() => navigate('/#projetos')}>
        ← Voltar aos projetos
      </button>
      <article className="sheet">
        <div className="m-img" style={{ background: gradients[index % gradients.length] }}>
          <ProjectImage
            src={project.imagem}
            alt={`Imagem do projeto ${project.titulo}`}
            initials={initials}
            loading="eager"
            width="1400"
            height="700"
          />
        </div>
        <div className="m-body">
          <div className="badges">
            <span className="badge t">{projectTypes[project.tipo] || project.tipo}</span>
            <span className={`badge s ${project.andamento ? '' : 'done'}`}>
              {project.andamento && <span className="dot" />}
              {project.andamento ? 'Em andamento' : 'Concluído'}
            </span>
          </div>
          <h1 className="details-title">{project.titulo}</h1>
          <p className="desc">{project.descricao}</p>
          <div className="facts">
            {project.periodo && (
              <div className="fact"><b>Período</b>{project.periodo}</div>
            )}
            {project.papel && (
              <div className="fact"><b>Meu papel</b>{project.papel}</div>
            )}
          </div>
          <div className="tags">
            {(project.tecnologias || []).map((technology) => (
              <span className="tag" key={technology}>{technology}</span>
            ))}
          </div>
          <div className="links">
            {parseGitHubRepositoryUrl(project.repo) && (
              <a className="btn main" href={project.repo} target="_blank" rel="noopener noreferrer">
                Ver código
              </a>
            )}
            {project.demo && (
              <a className="btn ghost" href={project.demo} target="_blank" rel="noopener noreferrer">
                Ver online
              </a>
            )}
          </div>
          {parseGitHubRepositoryUrl(project.repo) && (
            <p className="external-note">
              Repositórios privados ou que exigem autorização não podem ser consultados pela API pública.
            </p>
          )}
          <GitHubRepositoryStatus repositoryUrl={project.repo} />
        </div>
      </article>
    </section>
  )
}

export default ProjectDetailsPage
