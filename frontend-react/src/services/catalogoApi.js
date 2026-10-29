export async function fetchProducts(useApi = import.meta.env.VITE_USE_API === 'true', fetcher = fetch) {
  // Para la entrega frontend la maqueta usa los datos locales por defecto.
  // Activa VITE_USE_API=true cuando el catalog-service esté levantado.
  if (!useApi) {
    return null
  }

  const response = await fetcher('/api/productos', {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('El servicio de catálogo no está disponible')
  }

  return response.json()
}
