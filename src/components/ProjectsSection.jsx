import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import ProjectFilters from './ProjectFilters'

function ProjectsSection({ projects, projectTypes, gradients, featuredProjectIds }) {
  const navigate = useNavigate()
  const [tipoSelecionado, setTipoSelecionado] = useState('todos')
  const [somenteAndamento, setSomenteAndamento] = useState(false)
  const filteredProjects = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => (
      (tipoSelecionado === 'todos' || project.tipo === tipoSelecionado)
      && (!somenteAndamento || project.andamento)
    ))
  const featuredProjects = featuredProjectIds
    .map(Number)
    .filter((index) => Number.isInteger(index) && index >= 0 && projects[index])
    .map((index) => ({ project: projects[index], index }))

  function renderCards(entries, prefix = '') {
    return entries.map(({ project, index }) => (
      <ProjectCard
        key={`${prefix}${project.titulo}`}
        project={project}
        index={index}
        projectTypes={projectTypes}
        gradients={gradients}
        onSelect={() => navigate(`/projetos/${index}`)}
      />
    ))
  }

  return (
    <section id="projetos">
      {featuredProjects.length > 0 && (
        <div className="featured-projects">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Seleção</span>
              <h2>Em destaque</h2>
            </div>
          </div>
          <div className="grid">{renderCards(featuredProjects, 'featured-')}</div>
        </div>
      )}
      <div className="sec-head">
        <div>
          <span className="eyebrow">Portfólio</span>
          <h2>Projetos</h2>
        </div>
        <ProjectFilters
          projectTypes={projectTypes}
          selectedType={tipoSelecionado}
          onTypeChange={setTipoSelecionado}
          onlyInProgress={somenteAndamento}
          onProgressChange={() => setSomenteAndamento((valor) => !valor)}
        />
      </div>
      <div className="grid">
        {filteredProjects.length ? renderCards(filteredProjects) : (
          <div className="empty">Nenhum projeto com esse filtro ainda.</div>
        )}
      </div>
    </section>
  )
}

export default ProjectsSection