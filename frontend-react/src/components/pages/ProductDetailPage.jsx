import { Link, useParams } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters.js'
import { getOfferPrice } from '../../utils/commerce.js'

function ProductDetailPage({ products, onAdd }) {
  const { code } = useParams()
  const product = products.find((item) => item.codigo === code)

  if (!product) {
    return <section className="container section-block empty-state"><h1>Producto no encontrado</h1><Link to="/catalogo">Volver al catálogo</Link></section>
  }

  return (
    <section className="container section-block">
      <div className="row g-5 align-items-center product-detail">
        <div className="col-12 col-lg-5">
          <div className="product-detail__visual" aria-hidden="true">{product.categoria.slice(0, 2).toUpperCase()}</div>
        </div>
        <div className="col-12 col-lg-7">
          <p className="eyebrow">{product.categoria} · {product.subcategoria}</p>
          <h1>{product.nombre}</h1>
          <p className="lead">Marca {product.marca} · Código {product.codigo}</p>
          <dl className="row">
            <dt className="col-5">Unidad de venta</dt><dd className="col-7">{product.unidad}</dd>
            <dt className="col-5">Stock disponible</dt><dd className="col-7">{product.stock}</dd>
          </dl>
          {product.oferta && <p className="badge text-bg-warning fs-6">Oferta {product.descuento}%</p>}
          <p className="display-6 fw-bold text-success">{formatCurrency(getOfferPrice(product))}</p>
          <div className="d-flex gap-3 flex-wrap">
            <button className="button button--accent" type="button" disabled={product.stock === 0} onClick={() => onAdd(product)}>Agregar al carrito</button>
            <Link className="button button--ghost" to="/catalogo">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
