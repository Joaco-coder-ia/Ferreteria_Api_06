import { createProduct, deleteProduct, loadCatalog, saveCatalog, updateProduct } from './catalogStore.js'
import { product } from '../test/fixtures.js'

describe('catalogStore CRUD y persistencia', () => {
  it('crea un producto nuevo', () => {
    const result = createProduct([product], { ...product, codigo: ' nu001 ', nombre: 'Nuevo' })
    expect(result).toHaveLength(2)
    expect(result[1].codigo).toBe('NU001')
  })

  it('rechaza códigos duplicados', () => {
    expect(() => createProduct([product], product)).toThrow('Ya existe')
  })

  it('actualiza un producto sin mutar su código', () => {
    const result = updateProduct([product], 'HE001', { nombre: 'Martillo actualizado', stock: 4 })
    expect(result[0]).toMatchObject({ codigo: 'HE001', nombre: 'Martillo actualizado', stock: 4 })
  })

  it('elimina el producto indicado', () => {
    expect(deleteProduct([product], 'HE001')).toEqual([])
  })

  it('guarda y recupera el catálogo usando un mock de almacenamiento', () => {
    const memory = new Map()
    const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) }
    saveCatalog([product], storage)
    expect(loadCatalog(storage)[0]).toMatchObject({ codigo: 'HE001', oferta: true })
  })
})
