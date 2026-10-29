import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatalogPage from '../components/pages/CatalogPage.jsx'
import { fetchProducts } from '../services/catalogoApi.js'

function CatalogContainer({ initialProducts, onCatalogLoaded, onAdd }) {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(() => searchParams.get('categoria') || 'Todas')
  const [stockOnly, setStockOnly] = useState(false)
  const [source, setSource] = useState('local')

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((data) => {
        if (active && data) {
          onCatalogLoaded?.(data)
          setSource('api')
        }
      })
      .catch(() => {
        if (active) setSource('local')
      })
    return () => { active = false }
  }, [onCatalogLoaded])

  const categories = useMemo(() => ['Todas', ...new Set(initialProducts.map((product) => product.categoria))], [initialProducts])
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return initialProducts.filter((product) => {
      const matchesSearch = !term || [product.codigo, product.nombre, product.marca].some((value) => value.toLowerCase().includes(term))
      const matchesCategory = category === 'Todas' || product.categoria === category
      const matchesStock = !stockOnly || product.stock > 0
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [initialProducts, search, category, stockOnly])

  return <CatalogPage products={filteredProducts} categories={categories} search={search} category={category} stockOnly={stockOnly} source={source} onSearchChange={setSearch} onCategoryChange={setCategory} onStockChange={setStockOnly} onAdd={onAdd} />
}

export default CatalogContainer
