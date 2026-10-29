import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import CheckoutPage from './CheckoutPage.jsx'
import { product, session } from '../../test/fixtures.js'

const cart = [{ ...product, cantidad: 2 }]

function renderCheckout(onCreateOrder = vi.fn(() => ({ id: 'PED-0001' }))) {
  render(
    <MemoryRouter initialEntries={['/checkout']}>
      <Routes>
        <Route path="/checkout" element={<CheckoutPage cart={cart} session={session} onCreateOrder={onCreateOrder} />} />
        <Route path="/compra-exitosa/:orderId" element={<h1>Compra PED-0001 aprobada</h1>} />
        <Route path="/compra-fallida" element={<h1>Compra rechazada</h1>} />
      </Routes>
    </MemoryRouter>,
  )
  return onCreateOrder
}

describe('CheckoutPage', () => {
  it('completa una compra aprobada y navega al resultado', async () => {
    const user = userEvent.setup()
    const onCreateOrder = renderCheckout()
    await user.type(screen.getByLabelText('Dirección de entrega'), 'Av. Principal 123')
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    expect(onCreateOrder).toHaveBeenCalledWith(expect.objectContaining({ medioPago: 'TARJETA' }))
    expect(screen.getByRole('heading', { name: 'Compra PED-0001 aprobada' })).toBeInTheDocument()
  })

  it('navega a la vista fallida al simular rechazo', async () => {
    const user = userEvent.setup()
    renderCheckout()
    await user.type(screen.getByLabelText('Dirección de entrega'), 'Av. Principal 123')
    await user.selectOptions(screen.getByLabelText('Medio de pago'), 'RECHAZADO')
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    expect(screen.getByRole('heading', { name: 'Compra rechazada' })).toBeInTheDocument()
  })
})
