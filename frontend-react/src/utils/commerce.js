export const getOfferPrice = (product) => {
  const discount = Number(product.descuento || 0)
  return Math.round(product.precioVenta * (1 - discount / 100))
}

export const getCartTotal = (cart) => cart.reduce(
  (total, item) => total + getOfferPrice(item) * item.cantidad,
  0,
)

export const getCategories = (products) => [...new Set(products.map((product) => product.categoria))]
