import { Link, useLocation } from 'react-router-dom'

function PurchaseFailurePage() {
  const location = useLocation()
  return <section className="container section-block narrow-content"><div className="failure-panel"><span aria-hidden="true">!</span><p className="eyebrow">Compra no completada</p><h1>El pago no pudo procesarse</h1><p>{location.state?.motivo || 'No se recibió confirmación del medio de pago.'}</p><p>Tu carrito continúa intacto para que puedas reintentar.</p><Link className="button button--primary" to="/checkout">Intentar nuevamente</Link></div></section>
}

export default PurchaseFailurePage
