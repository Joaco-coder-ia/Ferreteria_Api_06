import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'

const clientSession = { name: 'Contratista demo', email: 'contratista@demo.cl', role: 'CLIENTE' }

const renderApp = (path = '/', session = null) => {
  if (session) localStorage.setItem('los-maestros-session', JSON.stringify(session))
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

describe('App y rutas principales', () => {
  it('redirige al login cuando no existe sesión', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('renderiza el inicio para una sesión válida', () => {
    renderApp('/', clientSession)
    expect(screen.getByRole('heading', { name: 'Materiales listos cuando la obra los necesita.' })).toBeInTheDocument()
  })

  it('protege la administración según el rol', () => {
    renderApp('/administracion', clientSession)
    expect(screen.getByRole('heading', { name: 'Materiales listos cuando la obra los necesita.' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Panel de administración' })).not.toBeInTheDocument()
  })

  it('actualiza el contador del carrito al agregar un producto', async () => {
    const user = userEvent.setup()
    renderApp('/catalogo', clientSession)
    await user.click(screen.getAllByRole('button', { name: 'Agregar' })[0])
    expect(screen.getByRole('link', { name: /carrito 1 productos/i })).toBeInTheDocument()
  })
})
