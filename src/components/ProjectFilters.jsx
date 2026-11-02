function ProjectFilters({
  projectTypes,
  selectedType,
  onTypeChange,
  onlyInProgress,
  onProgressChange,
}) {
  return (
    <div className="filters" role="group" aria-label="Filtrar projetos">
      {[['todos', 'Todos'], ...Object.entries(projectTypes)].map(([tipo, label]) => (
        <button
          className="chip"
          type="button"
          key={tipo}
          aria-pressed={selectedType === tipo}
          onClick={() => onTypeChange(tipo)}
        >
          {label}
        </button>
      ))}
      <button
        className="chip"
        type="button"
        aria-pressed={onlyInProgress}
        onClick={onProgressChange}
      >
        Em andamento
      </button>
    </div>
  )
}

export default ProjectFilters