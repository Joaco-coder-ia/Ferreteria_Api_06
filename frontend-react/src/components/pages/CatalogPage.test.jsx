import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import CatalogContainer from '../../containers/CatalogContainer.jsx'
import { product } from '../../test/fixtures.js'
import { fetchProducts } from '../../services/catalogoApi.js'

vi.mock('../../services/catalogoApi.js', () => ({ fetchProducts: vi.fn() }))

const secondProduct = { ...product, codigo: 'EL001', categoria: 'Electricidad', nombre: 'Cable eléctrico', marca: 'Volt', oferta: false, descuento: 0 }

describe('CatalogPage', () => {
  beforeEach(() => fetchProducts.mockResolvedValue(null))

  it('filtra productos al escribir en el buscador', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><CatalogContainer initialProducts={[product, secondProduct]} onAdd={vi.fn()} /></MemoryRouter>)
    await user.type(screen.getByLabelText(/buscar por nombre/i), 'cable')
    expect(screen.getByText('Cable eléctrico')).toBeInTheDocument()
    expect(screen.queryByText('Martillo profesional')).not.toBeInTheDocument()
  })

  it('filtra el catálogo usando el estado de categoría', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><CatalogContainer initialProducts={[product, secondProduct]} onAdd={vi.fn()} /></MemoryRouter>)
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Electricidad')
    expect(screen.getByText('Cable eléctrico')).toBeInTheDocument()
    expect(screen.queryByText('Martillo profesional')).not.toBeInTheDocument()
  })

  it('usa datos locales cuando el servicio simulado no entrega datos', async () => {
    render(<MemoryRouter><CatalogContainer initialProducts={[product]} onAdd={vi.fn()} /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText(/datos locales de demostración/i)).toBeInTheDocument())
    expect(fetchProducts).toHaveBeenCalled()
  })
})
