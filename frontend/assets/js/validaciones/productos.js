// Reglas exigidas para crear y editar productos.
(function iniciarValidacionProductos() {
  const comunes = window.Ferreteria.validaciones;

  function erroresProducto(datos) {
    const errores = {};
    if (!comunes.textoValido(datos.codigo, 3)) errores.codigo = 'El código es obligatorio y debe tener al menos 3 caracteres.';
    if (!comunes.textoValido(datos.nombre, 1, 100)) errores.nombre = 'El nombre es obligatorio y admite hasta 100 caracteres.';
    if (String(datos.descripcion ?? '').trim().length > 500) errores.descripcion = 'La descripción es opcional, con un máximo de 500 caracteres.';
    if (!comunes.numeroNoNegativo(datos.precioVenta)) errores.precioVenta = 'El precio debe ser un número igual o superior a 0.';
    if (!comunes.enteroNoNegativo(datos.stock)) errores.stock = 'El stock debe ser un número entero igual o superior a 0.';
    if (String(datos.stockMinimo ?? '') !== '' && !comunes.enteroNoNegativo(datos.stockMinimo)) errores.stockMinimo = 'El stock crítico es opcional; si lo ingresas debe ser un entero desde 0.';
    if (!comunes.textoValido(datos.categoria, 1)) errores.categoria = 'Selecciona una categoría.';
    return errores;
  }

  function validarProducto(datos) {
    return Object.values(erroresProducto(datos));
  }

  window.Ferreteria.validacionesProducto = { erroresProducto, validarProducto };
})();
