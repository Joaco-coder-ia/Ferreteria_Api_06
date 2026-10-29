import ProductCard from '../organisms/ProductCard.jsx'

function OffersPage({ products, onAdd }) {
  const offers = products.filter((product) => product.oferta)

  return (
    <section className="container section-block">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Precios especiales</p>
          <h1>Ofertas vigentes</h1>
          <p>{offers.length} oportunidades seleccionadas para tu obra.</p>
        </div>
      </div>
      <div className="product-grid">
        {offers.map((product) => <ProductCard key={product.codigo} product={product} onAdd={onAdd} />)}
      </div>
    </section>
  )
}

export default OffersPage
