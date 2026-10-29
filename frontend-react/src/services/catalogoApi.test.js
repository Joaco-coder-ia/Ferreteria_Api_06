import { fetchProducts } from './catalogoApi.js'
import { product } from '../test/fixtures.js'

describe('catalogoApi', () => {
  it('devuelve los productos del servicio cuando responde correctamente', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([product]) })
    await expect(fetchProducts(true, fetchMock)).resolves.toEqual([product])
    expect(fetchMock).toHaveBeenCalled()
  })

  it('lanza error cuando el servicio responde con fallo', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    await expect(fetchProducts(true, fetchMock)).rejects.toThrow('El servicio de catálogo no está disponible')
  })

  it('omite la petición cuando la API está desactivada', async () => {
    await expect(fetchProducts(false, vi.fn())).resolves.toBeNull()
  })
})
