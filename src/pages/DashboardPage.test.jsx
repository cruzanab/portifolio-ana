import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PortfolioProvider } from '../context/PortfolioContext.jsx'
import { ProtectedDashboard } from './DashboardPage'

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})

describe('ProtectedDashboard', () => {
  it('redirects visitors without a session to the login route', async () => {
    render(
      <PortfolioProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={<ProtectedDashboard><p>Dashboard privado</p></ProtectedDashboard>}
            />
            <Route path="/dashboard/login" element={<p>Login do dashboard</p>} />
          </Routes>
        </MemoryRouter>
      </PortfolioProvider>,
    )

    expect(await screen.findByText('Login do dashboard')).toBeTruthy()
    expect(screen.queryByText('Dashboard privado')).toBeNull()
  })
})
