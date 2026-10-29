import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import CartPage from './CartPage.jsx'
import { product } from '../../test/fixtures.js'

describe('CartPage', () => {
  it('muestra el estado vacío de forma condicional', () => {
    render(<MemoryRouter><CartPage cart={[]} onQuantityChange={vi.fn()} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'El carrito está vacío' })).toBeInTheDocument()
  })

  it('propaga el cambio de cantidad', () => {
    const onQuantityChange = vi.fn()
    render(<MemoryRouter><CartPage cart={[{ ...product, cantidad: 1 }]} onQuantityChange={onQuantityChange} /></MemoryRouter>)
    const input = screen.getByLabelText('Cantidad')
    fireEvent.change(input, { target: { value: '3' } })
    expect(onQuantityChange).toHaveBeenLastCalledWith('HE001', 3)
  })
})
