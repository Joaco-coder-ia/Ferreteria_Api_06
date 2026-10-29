import { formatCurrency, formatDate } from '../../utils/formatters.js'

function AccountPage({ session, orders }) {
  const ownOrders = orders.filter((order) => order.cliente === session.email)
  const balance = ownOrders
    .filter((order) => order.cuentaCorriente)
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <section className="container section-block">
      <div className="section-heading section-heading--row">
        <div><p className="eyebrow">Área privada</p><h1>Mi cuenta</h1><p>{session.name} · {session.email}</p></div>
        <div className="balance-card"><span>Saldo pendiente</span><strong>{formatCurrency(balance)}</strong></div>
      </div>

      <div className="section-heading"><h2>Historial de pedidos</h2></div>
      {ownOrders.length === 0 ? (
        <div className="empty-state"><h3>Aún no hay pedidos</h3><p>Los pedidos confirmados aparecerán aquí.</p></div>
      ) : (
        <div className="order-list">
          {ownOrders.map((order) => (
            <article key={order.id} className="order-card">
              <div><span>{order.id}</span><h3>{formatDate(order.fecha)}</h3></div>
              <dl>
                <div><dt>Estado</dt><dd>{order.estado}</dd></div>
                <div><dt>Entrega</dt><dd>{order.tipoEntrega}</dd></div>
                <div><dt>Productos</dt><dd>{order.items.reduce((sum, item) => sum + item.cantidad, 0)}</dd></div>
                <div><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default AccountPage
