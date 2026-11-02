import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePortfolio } from './hooks/usePortfolio'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

function App({ projects, projectTypes, gradients }) {
  const location = useLocation()
  const { featuredProjectIds } = usePortfolio()

  useEffect(() => {
    document.title = 'Portfólio | Ana Beatriz Cruz'
    if (location.hash === '#projetos') {
      document.getElementById('projetos')?.scrollIntoView()
    }
  }, [location.hash])

  return (
    <div>
      <Header />
      <main className="wrap">
        <Hero />
        <ProjectsSection
          projects={projects}
          projectTypes={projectTypes}
          gradients={gradients}
          featuredProjectIds={featuredProjectIds}
        />
        <ContactSection />
        <Footer />
      </main>
    </div>
  )
}

export default App
