import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProtectedLayout from './ProtectedLayout.jsx'

describe('ProtectedLayout', () => {
  it('redirige al login cuando no existe sesión', () => {
    render(<MemoryRouter initialEntries={['/privado']}><Routes><Route path="/login" element={<h1>Ingreso</h1>} /><Route path="/privado" element={<ProtectedLayout session={null} cartCount={0} onLogout={vi.fn()} />} /></Routes></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Ingreso' })).toBeInTheDocument()
  })

  it('renderiza el contenido para una sesión válida', () => {
    render(<MemoryRouter initialEntries={['/privado']}><Routes><Route element={<ProtectedLayout session={{ role: 'CLIENTE' }} cartCount={0} onLogout={vi.fn()} />}><Route path="/privado" element={<h1>Contenido privado</h1>} /></Route></Routes></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Contenido privado' })).toBeInTheDocument()
    expect(screen.getByText('Ferretería Los Maestros')).toBeInTheDocument()
  })
})
