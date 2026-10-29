import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters.js'

function HomePage({ products }) {
  const categories = new Set(products.map((product) => product.categoria)).size
  const lowStock = products.filter((product) => product.stock <= product.stockMinimo).length
  const featured = [...products].sort((a, b) => b.precioVenta - a.precioVenta).slice(0, 3)

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">22 años apoyando a La Serena</p>
            <h1>Materiales listos cuando la obra los necesita.</h1>
            <p className="hero-copy">
              Consulta disponibilidad antes de salir, prepara tu pedido y elige retiro o despacho.
            </p>
            <div className="button-row">
              <Link className="button button--accent" to="/catalogo">Ver catálogo</Link>
              <Link className="button button--ghost" to="/ubicacion">Revisar cobertura</Link>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Resumen del catálogo">
            <p>Catálogo de muestra</p>
            <strong>{products.length}</strong>
            <span>referencias cargadas desde la planilla oficial</span>
            <dl>
              <div><dt>Categorías</dt><dd>{categories}</dd></div>
              <div><dt>Alertas de stock</dt><dd>{lowStock}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="container section-block" aria-labelledby="benefits-title">
        <div className="section-heading">
          <p className="eyebrow">Una consulta sin llamadas</p>
          <h2 id="benefits-title">Pensado para contratistas y para el equipo de tienda</h2>
        </div>
        <div className="benefit-grid">
          <article><span>01</span><h3>Stock visible</h3><p>Disponibilidad y unidad de venta en cada ficha de producto.</p></article>
          <article><span>02</span><h3>Pedido trazable</h3><p>Carrito, tipo de entrega y estado del pedido en una sola vista.</p></article>
          <article><span>03</span><h3>Reposición oportuna</h3><p>El equipo interno identifica productos bajo su mínimo.</p></article>
        </div>
      </section>

      <section className="surface-section">
        <div className="container section-block">
          <div className="section-heading section-heading--row">
            <div><p className="eyebrow">Productos destacados</p><h2>Equipamiento para trabajos exigentes</h2></div>
            <Link to="/catalogo">Explorar todo →</Link>
          </div>
          <div className="featured-grid">
            {featured.map((product) => (
              <article key={product.codigo}>
                <span>{product.categoria}</span>
                <h3>{product.nombre}</h3>
                <p>{product.marca}</p>
                <strong>{formatCurrency(product.precioVenta)}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
