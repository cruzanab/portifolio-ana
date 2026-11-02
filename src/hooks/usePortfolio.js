import { useContext } from 'react'
import { PortfolioContext } from '../context/portfolioContext'

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio deve ser usado dentro de PortfolioProvider.')
  }
  return context
}
