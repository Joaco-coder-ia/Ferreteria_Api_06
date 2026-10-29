import seedProducts from './productos.json'

export const CATALOG_STORAGE_KEY = 'los-maestros-catalog-v2'

const offerCodes = new Set(['MC001', 'HE001', 'HE006', 'EL001', 'GA001', 'PI001', 'SE001', 'JA001'])

export const normalizeCatalog = (products = seedProducts) => products.map((product) => ({
  ...product,
  oferta: product.oferta ?? offerCodes.has(product.codigo),
  descuento: product.descuento ?? (offerCodes.has(product.codigo) ? 15 : 0),
}))

export const loadCatalog = (storage = localStorage) => {
  try {
    const saved = storage.getItem(CATALOG_STORAGE_KEY)
    return saved ? normalizeCatalog(JSON.parse(saved)) : normalizeCatalog()
  } catch {
    return normalizeCatalog()
  }
}

export const saveCatalog = (products, storage = localStorage) => {
  storage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products))
  return products
}

export const createProduct = (products, input) => {
  const code = input.codigo.trim().toUpperCase()
  if (!code) throw new Error('El código es obligatorio.')
  if (products.some((product) => product.codigo === code)) {
    throw new Error('Ya existe un producto con ese código.')
  }
  return [...products, { ...input, codigo: code, stock: Number(input.stock), precioVenta: Number(input.precioVenta), stockMinimo: Number(input.stockMinimo || 0) }]
}

export const updateProduct = (products, code, changes) => products.map((product) => (
  product.codigo === code
    ? { ...product, ...changes, codigo: code, stock: Number(changes.stock ?? product.stock), precioVenta: Number(changes.precioVenta ?? product.precioVenta) }
    : product
))

export const deleteProduct = (products, code) => products.filter((product) => product.codigo !== code)

export const resetCatalog = () => normalizeCatalog()
