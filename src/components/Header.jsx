import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

function Header() {
  return (
    <header className="top wrap">
      <a className="logo" href="#inicio">Ana Beatriz Cruz</a>
      <nav aria-label="Principal">
        <a href="#projetos">Projetos</a>
        <a href="#contato">Contato</a>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <ThemeToggle />
    </header>
  )
}

export default Header