import { useCallback, useEffect, useMemo, useState } from 'react'
import { PortfolioContext } from './portfolioContext'
import { firebaseConfigured } from '../services/firebaseConfig'

const DEMO_PASSWORD = 'portfolio-demo'

function readJson(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue === null ? fallback : JSON.parse(storedValue)
  } catch (error) {
    console.error(`Não foi possível carregar os dados locais (${key}).`, error)
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Não foi possível salvar os dados locais (${key}).`, error)
  }
}

export function PortfolioProvider({ children }) {
  const [messages, setMessages] = useState(
    () => firebaseConfigured ? [] : readJson('portfolio.messages', []),
  )
  const [featuredProjectIds, setFeaturedProjectIds] = useState(
    () => firebaseConfigured ? [] : readJson('portfolio.featured-projects', []),
  )
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [demoAuthenticated, setDemoAuthenticated] = useState(
    () => !firebaseConfigured && sessionStorage.getItem('portfolio.dashboard-auth') === 'true',
  )
  const [authReady, setAuthReady] = useState(!firebaseConfigured)
  const [authError, setAuthError] = useState('')
  const [messagesLoading, setMessagesLoading] = useState(firebaseConfigured)
  const [messagesError, setMessagesError] = useState('')
  const [settingsError, setSettingsError] = useState('')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('portfolio.theme') || 'light'
    } catch (error) {
      console.error('Não foi possível carregar o tema salvo.', error)
      return 'light'
    }
  })

  useEffect(() => {
    if (!firebaseConfigured) writeJson('portfolio.messages', messages)
  }, [messages])
  useEffect(() => {
    if (!firebaseConfigured) writeJson('portfolio.featured-projects', featuredProjectIds)
  }, [featuredProjectIds])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('portfolio.theme', theme)
    } catch (error) {
      console.error('Não foi possível salvar o tema.', error)
    }
  }, [theme])

  useEffect(() => {
    if (!firebaseConfigured) return undefined

    let active = true
    let unsubscribe
    import('../services/firebaseAuth').then(({ auth, onAuthStateChanged }) => {
      if (!active) return

      unsubscribe = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user)
        setAuthError('')
        setAuthReady(true)

        if (!user) {
          setMessages([])
          setFeaturedProjectIds([])
          setMessagesLoading(false)
        } else {
          setMessagesLoading(true)
        }
      }, (error) => {
        console.error('Não foi possível verificar a sessão do Firebase.', error)
        setAuthError('Não foi possível verificar sua sessão. Recarregue a página e tente novamente.')
        setAuthReady(true)
      })
    }).catch((error) => {
      console.error('Não foi possível carregar o Firebase Authentication.', error)
      setAuthError('Não foi possível carregar o login. Verifique a configuração do Firebase.')
      setAuthReady(true)
    })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    if (!firebaseConfigured) return undefined

    let active = true
    let unsubscribe
    import('../services/firebaseFirestore').then(({ subscribeToFeaturedProjects }) => {
      if (!active) return
      unsubscribe = subscribeToFeaturedProjects((projectIds) => {
        setFeaturedProjectIds(projectIds)
        setSettingsError('')
      }, (error) => {
        console.error('Não foi possível carregar as preferências do portfólio.', error)
        setSettingsError('Não foi possível carregar os projetos em destaque.')
      })
    }).catch((error) => {
      console.error('Não foi possível carregar as preferências do Firebase.', error)
      setSettingsError('Não foi possível carregar os projetos em destaque.')
    })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    if (!firebaseConfigured || !firebaseUser) return undefined

    let active = true
    let unsubscribe
    import('../services/firebaseFirestore').then(({ subscribeToMessages }) => {
      if (!active) return
      unsubscribe = subscribeToMessages((nextMessages) => {
        setMessages(nextMessages)
        setMessagesLoading(false)
        setMessagesError('')
      }, (error) => {
        console.error('Não foi possível carregar as mensagens do Firebase.', error)
        setMessagesLoading(false)
        setMessagesError('Não foi possível carregar as mensagens. Verifique as regras do Firestore.')
      })
    }).catch((error) => {
      console.error('Não foi possível carregar as mensagens do Firebase.', error)
      setMessagesLoading(false)
      setMessagesError('Não foi possível carregar as mensagens. Verifique a configuração do Firebase.')
    })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [firebaseUser])

  const addMessage = useCallback(async (message) => {
    if (firebaseConfigured) {
      const { sendContactMessage } = await import('../services/firebaseFunctions')
      return sendContactMessage(message)
    }

    setMessages((currentMessages) => [
      {
        ...message,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        answered: false,
      },
      ...currentMessages,
    ])
    return { savedLocally: true, emailSent: false }
  }, [])

  const login = useCallback(async (email, password) => {
    if (firebaseConfigured) {
      setAuthError('')
      const { loginWithFirebase } = await import('../services/firebaseAuth')
      await loginWithFirebase(email, password)
      return
    }

    if (password !== DEMO_PASSWORD) throw new Error('Senha incorreta.')
    sessionStorage.setItem('portfolio.dashboard-auth', 'true')
    setDemoAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    if (firebaseConfigured) {
      const { logoutFromFirebase } = await import('../services/firebaseAuth')
      await logoutFromFirebase()
      return
    }

    sessionStorage.removeItem('portfolio.dashboard-auth')
    setDemoAuthenticated(false)
  }, [])

  const updateMessageAnswered = useCallback(async (id, answered) => {
    if (firebaseConfigured) {
      const { setMessageAnswered } = await import('../services/firebaseFirestore')
      await setMessageAnswered(id, answered)
      return
    }

    setMessages((currentMessages) => currentMessages.map((message) => (
      message.id === id ? { ...message, answered } : message
    )))
  }, [])

  const updateFeaturedProjects = useCallback(async (projectIds) => {
    if (firebaseConfigured) {
      const { saveFeaturedProjects } = await import('../services/firebaseFirestore')
      await saveFeaturedProjects(projectIds)
    }
    setFeaturedProjectIds(projectIds)
  }, [])

  const isAuthenticated = firebaseConfigured ? Boolean(firebaseUser) : demoAuthenticated

  const value = useMemo(() => ({
    messages,
    featuredProjectIds,
    updateFeaturedProjects,
    theme,
    toggleTheme: () => setTheme((currentTheme) => (
      currentTheme === 'light' ? 'dark' : 'light'
    )),
    isAuthenticated,
    authReady,
    authError,
    firebaseConfigured,
    messagesLoading,
    messagesError,
    settingsError,
    login,
    logout,
    addMessage,
    updateMessageAnswered,
  }), [
    messages,
    featuredProjectIds,
    theme,
    isAuthenticated,
    authReady,
    authError,
    messagesLoading,
    messagesError,
    settingsError,
    login,
    logout,
    addMessage,
    updateFeaturedProjects,
    updateMessageAnswered,
  ])

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}
