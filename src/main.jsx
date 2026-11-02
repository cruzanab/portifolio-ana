/* eslint-disable react-refresh/only-export-components */
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import LoadingPage from './components/LoadingPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import assistenteVirtualImg from './assets/assistenteVirtual.webp'
import hestiaImg from './assets/hestia.webp'
import synesthesiaImg from './assets/synesthesiaLp.webp'

const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const DashboardLoginPage = lazy(() => (
  import('./pages/DashboardPage.jsx').then((module) => ({
    default: module.DashboardLoginPage,
  }))
))

const projects = [
  {
    titulo: 'Assistente Virtual',
    tipo: 'empresa',
    andamento: false,
    periodo: 'Mar 2025 – Nov 2025',
    papel: 'Desenvolvedora Front-end e UX',
    resumo: 'Assistente virtual para processos e rotinas.',
    descricao: 'Um chatbot de IA com respostas customizadas com base nos processos de cada area da empresa com objetivo de auxiliar os colaboradores e otimizar tempo. Além do chat o projeto conta com um painel administrativo para subir os arquivos de treinamento do modelo de IA, monitorar o desempenho do chatbot, analisar métricas de uso e gerenciar usuários com base em grupos de cargos e área relacionada.',
    tecnologias: ['React', 'Python', 'MongoDB'],
    imagem: assistenteVirtualImg,
    repo: 'https://github.com/repoIndisponivel',
    demo: '',
  },
  {
    titulo: 'Héstia',
    tipo: 'estudos',
    andamento: false,
    periodo: 'Mai 2024 – Set 2024',
    papel: 'Desenvolvedora Front-end Mobile',
    resumo: 'App de colegas de quarto para estudantes universitários.',
    descricao: 'O app consiste em usar gameficação para ajudar estudantes universitários a encontrar repúblicas e colegas de quarto compatíveis com seu perfil. O sistema de match/slash é baseado em um algoritmo de compatibilidade que leva em consideração preferências, hábitos e interesses dos usuários. O app também conta com um sistema de chat para facilitar a comunicação entre os usuários.',
    tecnologias: ['AndroidStudio', 'Java', 'MongoDB', 'PostgreSQL'],
    imagem: hestiaImg,
    repo: 'https://github.com/repoIndisponivel',
    demo: '',
  },
  {
    titulo: 'Controle de Estoque',
    tipo: 'pessoal',
    andamento: true,
    periodo: 'Set 2026 – Atual',
    papel: 'Desenvolvedora Fullstack',
    resumo: 'Painel de controle de estoque para pequenas empresas.',
    descricao: 'O projeto consiste em um painel de controle de estoque e caixa para pequenas empresas, reunindo informações de produtos, preços, quanto foi arrecadado no dia, meta de vendas etc. Além do painel principal, um site administrativo será desenvolvido para registro de empresas, registro de produtos, categorias etc. O projeto está sendo desenvolvido com React no front-end, Java no back-end e PostgreSQL como banco de dados.',
    tecnologias: ['React', 'Java', 'PostgreSQL'],
    imagem: '',
    repo: 'https://github.com/repoIndisponivel',
    demo: '',
  },
  {
    titulo: 'Synesthesia LP',
    tipo: 'estudos',
    andamento: false,
    periodo: 'Out 2026',
    papel: 'Desenvolvedora Front-end',
    resumo: 'Landing page de apresentação do projeto Synesthesia.',
    descricao: 'O projeto consiste em uma landing page para apresentar o Synesthesia, que é um projeto desenvolvido para o Challange JOVI da FIAP 2026. A landing page apresenta informações sobre o projeto, como objetivo, funcionalidades e equipe envolvida. O projeto foi desenvolvido com React e Tailwind CSS.',
    tecnologias: ['React', 'Tailwind CSS'],
    imagem: synesthesiaImg,
    repo: 'https://github.com/SAVAC-Challenge-FIAP/sprint4-front-webDev',
    demo: 'https://synesthesia-navy.vercel.app',
  },
]

const projectTypes = {
  pessoal: 'Projeto pessoal',
  empresa: 'Empresa privada',
  estudos: 'Estudos',
}

const gradients = [
  'linear-gradient(140deg,#e9a0b0,#b3223f)',
  'linear-gradient(140deg,#f3bcc7,#d9657c)',
  'linear-gradient(140deg,#d9657c,#7e1a30)',
  'linear-gradient(140deg,#f6c9d2,#e48a9d)',
  'linear-gradient(140deg,#e48a9d,#9d1f3a)',
  'linear-gradient(140deg,#efb0be,#c43b57)',
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <App projects={projects} projectTypes={projectTypes} gradients={gradients} />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/projetos/:slug',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <ProjectDetailsPage
          projects={projects}
          projectTypes={projectTypes}
          gradients={gradients}
        />
      </Suspense>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/dashboard/login',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <DashboardLoginPage />
      </Suspense>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <DashboardPage projects={projects} />
      </Suspense>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioProvider>
      <RouterProvider router={router} />
    </PortfolioProvider>
  </StrictMode>
)
