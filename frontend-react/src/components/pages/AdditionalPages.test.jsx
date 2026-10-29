import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import AccountPage from './AccountPage.jsx'
import AdminPage from './AdminPage.jsx'
import CategoriesPage from './CategoriesPage.jsx'
import HomePage from './HomePage.jsx'
import InventoryPage from './InventoryPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import OffersPage from './OffersPage.jsx'
import ProductDetailPage from './ProductDetailPage.jsx'
import PurchaseFailurePage from './PurchaseFailurePage.jsx'
import PurchaseSuccessPage from './PurchaseSuccessPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import { product, session } from '../../test/fixtures.js'

const router = (element, path = '/') => render(<MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>)

describe('Páginas complementarias de la tienda', () => {
  it('HomePage resume productos recibidos por props', () => {
    router(<HomePage products={[product]} />)
    expect(screen.getAllByText('1')).toHaveLength(2)
    expect(screen.getByText('Martillo profesional')).toBeInTheDocument()
  })

  it('CategoriesPage agrupa los productos por categoría', () => {
    router(<CategoriesPage products={[product]} />)
    expect(screen.getByRole('heading', { name: 'Herramientas' })).toBeInTheDocument()
    expect(screen.getByText(/1 productos disponibles/i)).toBeInTheDocument()
  })

  it('OffersPage muestra solo productos en oferta', () => {
    router(<OffersPage products={[product, { ...product, codigo: 'HE002', nombre: 'Sin oferta', oferta: false }]} onAdd={vi.fn()} />)
    expect(screen.getByText('Martillo profesional')).toBeInTheDocument()
    expect(screen.queryByText('Sin oferta')).not.toBeInTheDocument()
  })

  it('ProductDetailPage presenta el detalle encontrado', () => {
    render(<MemoryRouter initialEntries={['/producto/HE001']}><Routes><Route path="/producto/:code" element={<ProductDetailPage products={[product]} onAdd={vi.fn()} />} /></Routes></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Martillo profesional' })).toBeInTheDocument()
    expect(screen.getByText(/código HE001/i)).toBeInTheDocument()
  })

  it('ProductDetailPage informa un código inexistente', () => {
    render(<MemoryRouter initialEntries={['/producto/NOEXISTE']}><Routes><Route path="/producto/:code" element={<ProductDetailPage products={[product]} onAdd={vi.fn()} />} /></Routes></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument()
  })

  it('PurchaseSuccessPage muestra el número de pedido', () => {
    render(<MemoryRouter initialEntries={['/compra-exitosa/PED-0099']}><Routes><Route path="/compra-exitosa/:orderId" element={<PurchaseSuccessPage />} /></Routes></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'PED-0099' })).toBeInTheDocument()
  })

  it('PurchaseFailurePage conserva un mensaje de reintento', () => {
    router(<PurchaseFailurePage />)
    expect(screen.getByRole('heading', { name: 'El pago no pudo procesarse' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Intentar nuevamente' })).toBeInTheDocument()
  })

  it('AccountPage calcula el saldo de los pedidos del usuario', () => {
    const orders = [{ id: 'PED-1', cliente: session.email, cuentaCorriente: true, total: 8500, fecha: '2026-10-28T12:00:00Z', estado: 'RECIBIDO', tipoEntrega: 'DESPACHO', items: [{ cantidad: 1 }] }]
    router(<AccountPage session={session} orders={orders} />)
    expect(screen.getAllByText('$8.500')).toHaveLength(2)
    expect(screen.getByText('PED-1')).toBeInTheDocument()
  })

  it('InventoryPage propaga un ajuste de stock', () => {
    const onAdjustStock = vi.fn()
    router(<InventoryPage products={[{ ...product, stock: 1, stockMinimo: 2 }]} onAdjustStock={onAdjustStock} />)
    fireEvent.change(screen.getByLabelText('Stock de Martillo profesional'), { target: { value: '5' } })
    expect(onAdjustStock).toHaveBeenCalledWith('HE001', 5)
  })

  it('RegisterPage cambia a confirmación después del formulario válido', async () => {
    const user = userEvent.setup()
    router(<RegisterPage />)
    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez')
    await user.type(screen.getByLabelText('Correo'), 'ana@correo.cl')
    await user.type(screen.getByLabelText('Teléfono'), '912345678')
    await user.type(screen.getByLabelText('Contraseña'), 'segura123')
    await user.click(screen.getByRole('button', { name: 'Validar registro' }))
    expect(screen.getByRole('status')).toHaveTextContent('Formulario validado')
  })

  it('AdminPage envía los datos de un nuevo producto', async () => {
    const user = userEvent.setup()
    const onCreateProduct = vi.fn()
    router(<AdminPage products={[product]} orders={[]} onCreateProduct={onCreateProduct} onUpdateProduct={vi.fn()} onDeleteProduct={vi.fn()} />)
    await user.type(screen.getByLabelText('Código'), 'NU001')
    await user.type(screen.getByLabelText('Nombre'), 'Producto nuevo')
    await user.type(screen.getByLabelText('Marca'), 'Maestros')
    await user.type(screen.getByLabelText('Precio'), '5000')
    await user.type(screen.getByLabelText('Stock'), '10')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))
    expect(onCreateProduct).toHaveBeenCalledWith(expect.objectContaining({ codigo: 'NU001', nombre: 'Producto nuevo' }))
  })

  it('NotFoundPage ofrece una salida a la ruta correcta', () => {
    router(<NotFoundPage session={null} />)
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/login')
  })
})
