import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginPage from './LoginPage.jsx'

describe('LoginPage', () => {
  it('muestra los tres perfiles de demostración', () => {
    render(<MemoryRouter><LoginPage session={null} onLogin={vi.fn()} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Dueño' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vendedor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Contratista demo' })).toBeInTheDocument()
  })

  it('informa credenciales incorrectas', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage session={null} onLogin={vi.fn()} /></MemoryRouter>)
    await user.clear(screen.getByLabelText('Contraseña'))
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos')
  })

  it('envía el usuario válido al evento onLogin', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()
    render(<MemoryRouter><LoginPage session={null} onLogin={onLogin} /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ role: 'CLIENTE' }))
  })
})
