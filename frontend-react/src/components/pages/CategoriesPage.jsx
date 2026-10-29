import { Link } from 'react-router-dom'
import { getCategories } from '../../utils/commerce.js'

function CategoriesPage({ products }) {
  const categories = getCategories(products)

  return (
    <section className="container section-block">
      <div className="section-heading">
        <p className="eyebrow">Explora por área</p>
        <h1>Categorías de productos</h1>
        <p>Accesos directos a las familias principales del catálogo.</p>
      </div>
      <div className="row g-4">
        {categories.map((category) => {
          const count = products.filter((product) => product.categoria === category).length
          return (
            <div className="col-12 col-md-6 col-xl-4" key={category}>
              <article className="card h-100 border-0 shadow-sm category-card">
                <div className="card-body p-4">
                  <span className="category-icon" aria-hidden="true">{category.slice(0, 2).toUpperCase()}</span>
                  <h2 className="h4 mt-3">{category}</h2>
                  <p className="text-secondary">{count} productos disponibles en esta categoría.</p>
                  <Link className="btn btn-outline-success" to={`/catalogo?categoria=${encodeURIComponent(category)}`}>Ver productos</Link>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default CategoriesPage
