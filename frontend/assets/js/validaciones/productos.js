// Reglas usadas por administración para mantener el catálogo.
(function iniciarValidacionProductos() {
  const comunes = window.Ferreteria.validaciones;

  function validarProducto(datos) {
    const errores = [];
    if (!comunes.textoValido(datos.codigo)) errores.push('El código es obligatorio.');
    if (!comunes.textoValido(datos.nombre)) errores.push('El nombre es obligatorio.');
    if (!comunes.textoValido(datos.categoria)) errores.push('La categoría es obligatoria.');
    if (!comunes.numeroPositivo(datos.precioVenta)) errores.push('El precio debe ser un número positivo.');
    if (!comunes.numeroPositivo(datos.stock)) errores.push('El stock debe ser un número positivo.');
    return errores;
  }

  window.Ferreteria.validacionesProducto = { validarProducto };
})();
