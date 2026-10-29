import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters.js'
import { getCartTotal, getOfferPrice } from '../../utils/commerce.js'

function CartPage({ cart, onQuantityChange }) {
  const total = useMemo(() => getCartTotal(cart), [cart])

  return (
    <section className="container section-block">
      <div className="section-heading">
        <p className="eyebrow">Solicitud de productos</p>
        <h1>Tu carrito</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <h2>El carrito está vacío</h2>
          <p>Agrega productos disponibles y vuelve para confirmar.</p>
          <Link className="button button--primary" to="/catalogo">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <div className="cart-list">
            {cart.map((item) => (
              <article key={item.codigo} className="cart-item">
                <div>
                  <span>{item.codigo}</span>
                  <h2>{item.nombre}</h2>
                  <p>{formatCurrency(getOfferPrice(item))} por {item.unidad.toLowerCase()}</p>
                </div>
                <div className="quantity-control">
                  <label htmlFor={`quantity-${item.codigo}`}>Cantidad</label>
                  <input
                    id={`quantity-${item.codigo}`}
                    type="number"
                    min="0"
                    max={item.stock}
                    value={item.cantidad}
                    onChange={(event) => onQuantityChange(item.codigo, Number(event.target.value))}
                  />
                  <strong>{formatCurrency(getOfferPrice(item) * item.cantidad)}</strong>
                </div>
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <h2>Resumen</h2>
            <div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
            <p className="text-secondary">La dirección, entrega y medio de pago se confirman en el siguiente paso.</p>
            <Link className="button button--accent button--full text-center" to="/checkout">Continuar al pago</Link>
          </aside>
        </div>
      )}
    </section>
  )
}

export default CartPage
