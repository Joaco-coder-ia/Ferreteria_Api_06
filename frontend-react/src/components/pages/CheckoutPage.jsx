import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters.js'
import { getCartTotal } from '../../utils/commerce.js'

function CheckoutPage({ cart, session, onCreateOrder }) {
  const navigate = useNavigate()
  const total = useMemo(() => getCartTotal(cart), [cart])
  const [form, setForm] = useState({ nombre: session.name || '', correo: session.email || '', direccion: '', comuna: 'La Serena', tipoEntrega: 'DESPACHO', medioPago: 'TARJETA' })

  if (cart.length === 0) return <Navigate to="/carrito" replace />

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    if (form.medioPago === 'RECHAZADO') {
      navigate('/compra-fallida', { state: { motivo: 'La transacción de demostración fue rechazada.' } })
      return
    }
    const order = onCreateOrder({ ...form, total })
    navigate(`/compra-exitosa/${order.id}`)
  }

  return (
    <section className="container section-block">
      <div className="section-heading"><p className="eyebrow">Último paso</p><h1>Completar compra</h1><p>Revisa tus datos y confirma la modalidad de entrega.</p></div>
      <form className="row g-4 checkout-form" onSubmit={submit}>
        <div className="col-12 col-lg-8"><div className="card border-0 shadow-sm"><div className="card-body p-4 row g-3">
          <div className="col-md-6"><label className="form-label" htmlFor="nombre">Nombre</label><input className="form-control" id="nombre" name="nombre" value={form.nombre} onChange={change} required /></div>
          <div className="col-md-6"><label className="form-label" htmlFor="correo">Correo</label><input className="form-control" id="correo" name="correo" type="email" value={form.correo} onChange={change} required /></div>
          <div className="col-12"><label className="form-label" htmlFor="direccion">Dirección de entrega</label><input className="form-control" id="direccion" name="direccion" value={form.direccion} onChange={change} required={form.tipoEntrega === 'DESPACHO'} /></div>
          <div className="col-md-6"><label className="form-label" htmlFor="comuna">Comuna</label><select className="form-select" id="comuna" name="comuna" value={form.comuna} onChange={change}><option>La Serena</option><option>Coquimbo</option><option>Ovalle</option></select></div>
          <div className="col-md-6"><label className="form-label" htmlFor="tipoEntrega">Entrega</label><select className="form-select" id="tipoEntrega" name="tipoEntrega" value={form.tipoEntrega} onChange={change}><option value="DESPACHO">Despacho a obra</option><option value="RETIRO">Retiro en tienda</option></select></div>
          <div className="col-12"><label className="form-label" htmlFor="medioPago">Medio de pago</label><select className="form-select" id="medioPago" name="medioPago" value={form.medioPago} onChange={change}><option value="TARJETA">Tarjeta (simulación aprobada)</option><option value="TRANSFERENCIA">Transferencia</option><option value="RECHAZADO">Simular pago rechazado</option></select><div className="form-text">La opción rechazada permite demostrar la vista de compra fallida solicitada en la pauta.</div></div>
        </div></div></div>
        <div className="col-12 col-lg-4"><aside className="order-summary h-100"><h2>Resumen final</h2><p>{cart.length} líneas de productos</p><div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div><button className="button button--accent button--full" type="submit">Confirmar compra</button></aside></div>
      </form>
    </section>
  )
}

export default CheckoutPage
