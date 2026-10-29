import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Header from './Header.jsx'

describe('Header', () => {
  it('muestra navegación administrativa según el rol', () => {
    render(<MemoryRouter><Header session={{ role: 'ADMINISTRADOR' }} cartCount={2} onLogout={vi.fn()} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Administración' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /carrito/i })).toHaveTextContent('2')
  })

  it('oculta administración para un cliente', () => {
    render(<MemoryRouter><Header session={{ role: 'CLIENTE' }} cartCount={0} onLogout={vi.fn()} /></MemoryRouter>)
    expect(screen.queryByRole('link', { name: 'Administración' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Inventario' })).not.toBeInTheDocument()
  })
})
