import { formatCurrency } from '../../utils/formatters.js'
import { getOfferPrice } from '../../utils/commerce.js'
import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import AppButton from '../atoms/AppButton.jsx'

function ProductCard({ product, onAdd }) {
  const lowStock = product.stock <= product.stockMinimo
  const outOfStock = product.stock === 0

  return (
    <Card as="article" className="product-card">
      <div className="product-card__topline">
        <span>{product.codigo}</span>
        <span className={`stock-badge ${lowStock ? 'stock-badge--low' : ''}`}>
          {outOfStock ? 'Sin stock' : `${product.stock} ${product.unidad.toLowerCase()}`}
        </span>
      </div>
      <div className="product-visual" aria-hidden="true">
        {product.categoria.slice(0, 2).toUpperCase()}
      </div>
      <p className="product-category">{product.categoria} · {product.subcategoria}</p>
      <h3>{product.nombre}</h3>
      <p className="product-brand">Marca {product.marca}</p>
      {product.oferta && <Badge bg="warning" text="dark" className="mb-2 align-self-start">-{product.descuento}% oferta</Badge>}
      <div className="product-card__footer">
        <div>
          {product.oferta && <del className="d-block text-secondary small">{formatCurrency(product.precioVenta)}</del>}
          <strong>{formatCurrency(getOfferPrice(product))}</strong>
        </div>
        <AppButton type="button" disabled={outOfStock} onClick={() => onAdd(product)}>
          {outOfStock ? 'No disponible' : 'Agregar'}
        </AppButton>
      </div>
      <Link className="stretched-link-safe" to={`/producto/${product.codigo}`}>Ver detalle</Link>
    </Card>
  )
}

export default ProductCard
