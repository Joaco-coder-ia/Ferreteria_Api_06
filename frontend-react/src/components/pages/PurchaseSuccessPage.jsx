import { Link, useParams } from 'react-router-dom'

function PurchaseSuccessPage() {
  const { orderId } = useParams()
  return <section className="container section-block narrow-content"><div className="success-panel"><span aria-hidden="true">✓</span><p className="eyebrow">Compra aprobada</p><h1>{orderId}</h1><p>Tu pedido quedó registrado y ya puede revisarse en Mi cuenta.</p><div className="button-row justify-content-center"><Link className="button button--primary" to="/mi-cuenta">Ver mis pedidos</Link><Link className="button button--ghost" to="/catalogo">Volver al catálogo</Link></div></div></section>
}

export default PurchaseSuccessPage
