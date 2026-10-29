import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AccountPage from './components/pages/AccountPage.jsx'
import AdminPage from './components/pages/AdminPage.jsx'
import CartPage from './components/pages/CartPage.jsx'
import CategoriesPage from './components/pages/CategoriesPage.jsx'
import CheckoutPage from './components/pages/CheckoutPage.jsx'
import HomePage from './components/pages/HomePage.jsx'
import InventoryPage from './components/pages/InventoryPage.jsx'
import LocationPage from './components/pages/LocationPage.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
import NotFoundPage from './components/pages/NotFoundPage.jsx'
import OffersPage from './components/pages/OffersPage.jsx'
import ProductDetailPage from './components/pages/ProductDetailPage.jsx'
import PurchaseFailurePage from './components/pages/PurchaseFailurePage.jsx'
import PurchaseSuccessPage from './components/pages/PurchaseSuccessPage.jsx'
import RegisterPage from './components/pages/RegisterPage.jsx'
import ProtectedLayout from './components/templates/ProtectedLayout.jsx'
import CatalogContainer from './containers/CatalogContainer.jsx'
import { createProduct, deleteProduct, loadCatalog, normalizeCatalog, saveCatalog, updateProduct } from './data/catalogStore.js'

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function RoleRoute({ session, allowedRoles, children }) {
  if (!allowedRoles.includes(session?.role)) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const [session, setSession] = useState(() => readStorage('los-maestros-session', null))
  const [cart, setCart] = useState(() => readStorage('los-maestros-cart', []))
  const [orders, setOrders] = useState(() => readStorage('los-maestros-orders', []))
  const [catalog, setCatalog] = useState(() => loadCatalog())

  useEffect(() => {
    localStorage.setItem('los-maestros-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('los-maestros-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    saveCatalog(catalog)
  }, [catalog])

  const login = (user) => {
    localStorage.setItem('los-maestros-session', JSON.stringify(user))
    setSession(user)
  }

  const logout = () => {
    localStorage.removeItem('los-maestros-session')
    setSession(null)
  }

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.codigo === product.codigo)
      if (existing) {
        return current.map((item) =>
          item.codigo === product.codigo
            ? { ...item, cantidad: Math.min(item.cantidad + 1, product.stock) }
            : item,
        )
      }
      return [...current, { ...product, cantidad: 1 }]
    })
  }

  const updateCartQuantity = (code, quantity) => {
    setCart((current) =>
      current
        .map((item) =>
          item.codigo === code
            ? { ...item, cantidad: Math.max(0, Math.min(quantity, item.stock)) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    )
  }

  const createOrder = (orderData) => {
    const newOrder = {
      id: `PED-${String(orders.length + 1).padStart(4, '0')}`,
      cliente: session.email,
      fecha: new Date().toISOString(),
      estado: 'RECIBIDO',
      items: cart,
      ...orderData,
    }
    setOrders((current) => [newOrder, ...current])
    setCart([])
    return newOrder
  }

  const adjustStock = (code, stock) => {
    setCatalog((current) =>
      current.map((product) => (product.codigo === code ? { ...product, stock } : product)),
    )
  }

  const addProduct = (input) => setCatalog((current) => createProduct(current, input))
  const editProduct = (code, changes) => setCatalog((current) => updateProduct(current, code, changes))
  const removeProduct = (code) => setCatalog((current) => deleteProduct(current, code))

  const cartCount = cart.reduce((total, item) => total + item.cantidad, 0)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage session={session} onLogin={login} />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route element={<ProtectedLayout session={session} cartCount={cartCount} onLogout={logout} />}>
        <Route index element={<HomePage products={catalog} />} />
        <Route
          path="/catalogo"
          element={<CatalogContainer initialProducts={catalog} onCatalogLoaded={(data) => setCatalog(normalizeCatalog(data))} onAdd={addToCart} />}
        />
        <Route path="/categorias" element={<CategoriesPage products={catalog} />} />
        <Route path="/ofertas" element={<OffersPage products={catalog} onAdd={addToCart} />} />
        <Route path="/producto/:code" element={<ProductDetailPage products={catalog} onAdd={addToCart} />} />
        <Route
          path="/carrito"
          element={
            <CartPage
              cart={cart}
              onQuantityChange={updateCartQuantity}
            />
          }
        />
        <Route path="/checkout" element={<CheckoutPage cart={cart} session={session} onCreateOrder={createOrder} />} />
        <Route path="/compra-exitosa/:orderId" element={<PurchaseSuccessPage />} />
        <Route path="/compra-fallida" element={<PurchaseFailurePage />} />
        <Route path="/ubicacion" element={<LocationPage />} />
        <Route path="/mi-cuenta" element={<AccountPage session={session} orders={orders} />} />
        <Route
          path="/inventario"
          element={
            <RoleRoute session={session} allowedRoles={['ADMINISTRADOR', 'VENDEDOR']}>
              <InventoryPage products={catalog} onAdjustStock={adjustStock} />
            </RoleRoute>
          }
        />
        <Route
          path="/administracion"
          element={
            <RoleRoute session={session} allowedRoles={['ADMINISTRADOR']}>
              <AdminPage products={catalog} orders={orders} onCreateProduct={addProduct} onUpdateProduct={editProduct} onDeleteProduct={removeProduct} />
            </RoleRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage session={session} />} />
    </Routes>
  )
}

export default App
