import ProjectImage from './ProjectImage'
import GitHubRepositoryStatus from './GitHubRepositoryStatus'

function ProjectCard({ project, index, projectTypes, gradients, onSelect }) {
  const iniciais = project.titulo
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palavra) => [...palavra][0])
    .join('')
    .toUpperCase()

  return (
    <button
      className="card"
      type="button"
      aria-label={`Ver detalhes de ${project.titulo}`}
      onClick={onSelect}
    >
      <div className="thumb" style={{ background: gradients[index % gradients.length] }}>
        <ProjectImage
          src={project.imagem}
          alt={`Imagem do projeto ${project.titulo}`}
          initials={iniciais}
          width="640"
          height="400"
        />
        <div className={`stamp ${project.andamento ? '' : 'done'}`}>
          {project.andamento && <span className="dot" />}
          {project.andamento ? 'Em andamento' : 'Concluído'}
        </div>
      </div>
      <div className="perf" />
      <div className="card-body">
        <span className="tipo">{projectTypes[project.tipo] || project.tipo}</span>
        <h3>{project.titulo}</h3>
        <p>{project.resumo}</p>
        <GitHubRepositoryStatus repositoryUrl={project.repo} compact />
        <div className="more">Ver detalhes <span>→</span></div>
      </div>
    </button>
  )
}

export default ProjectCard