import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('presenta una estructura principal accesible', () => {
    render(<App />)

    expect(
            screen.getByRole('heading', { level: 1, name: /comida chapina de casa/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
