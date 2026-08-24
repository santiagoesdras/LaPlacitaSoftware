import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('presenta una estructura principal accesible', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /base del sitio lista para desarrollar/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
