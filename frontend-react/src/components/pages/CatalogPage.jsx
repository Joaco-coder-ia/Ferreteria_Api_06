import CatalogFilters from '../molecules/CatalogFilters.jsx'
import ProductCard from '../organisms/ProductCard.jsx'

function CatalogPage({ products, categories, search, category, stockOnly, source, onSearchChange, onCategoryChange, onStockChange, onAdd }) {

  return (
    <section className="container section-block catalog-page">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Catálogo actualizado</p>
          <h1>Encuentra lo que necesitas</h1>
          <p>{products.length} productos · datos {source === 'api' ? 'desde la API' : 'locales de demostración'}</p>
        </div>
      </div>

      <CatalogFilters search={search} category={category} stockOnly={stockOnly} categories={categories} onSearchChange={onSearchChange} onCategoryChange={onCategoryChange} onStockChange={onStockChange} />

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.codigo} product={product} onAdd={onAdd} />
          ))}
        </div>
      ) : (
        <div className="empty-state"><h2>Sin resultados</h2><p>Prueba otra búsqueda o categoría.</p></div>
      )}
    </section>
  )
}

export default CatalogPage
