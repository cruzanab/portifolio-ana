import { usePortfolio } from '../hooks/usePortfolio'

function ThemeToggle() {
  const { theme, toggleTheme } = usePortfolio()

  return (
    <button
      className="chip theme-toggle"
      type="button"
      aria-label={`Ativar tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
    >
      {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
    </button>
  )
}

export default ThemeToggle
