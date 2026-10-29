import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ProductCard from './ProductCard.jsx'
import { product } from '../../test/fixtures.js'

const renderCard = (changes = {}, onAdd = vi.fn()) => {
  render(<MemoryRouter><ProductCard product={{ ...product, ...changes }} onAdd={onAdd} /></MemoryRouter>)
  return onAdd
}

describe('ProductCard', () => {
  it('renderiza los datos recibidos mediante props', () => {
    renderCard()
    expect(screen.getByRole('heading', { name: product.nombre })).toBeInTheDocument()
    expect(screen.getByText('Marca Maestro')).toBeInTheDocument()
    expect(screen.getByText('-15% oferta')).toBeInTheDocument()
  })

  it('ejecuta el evento de agregar el producto', async () => {
    const user = userEvent.setup()
    const onAdd = renderCard()
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ codigo: 'HE001' }))
  })

  it('renderiza condicionalmente el estado sin stock', () => {
    renderCard({ stock: 0 })
    expect(screen.getByRole('button', { name: 'No disponible' })).toBeDisabled()
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })
})
