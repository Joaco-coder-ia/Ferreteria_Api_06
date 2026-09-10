// Reglas usadas por administración al crear o editar usuarios.
(function iniciarValidacionUsuarios() {
  const comunes = window.Ferreteria.validaciones;

  function validarUsuario(datos) {
    const errores = [];
    if (!comunes.textoValido(datos.nombre)) errores.push('El nombre es obligatorio.');
    if (!comunes.correoValido(datos.correo)) errores.push('El correo no es válido.');
    if (!['Administrador', 'Vendedor', 'Contratista', 'Cliente'].includes(datos.rol)) errores.push('Selecciona un rol.');
    if (!['Activo', 'Inactivo'].includes(datos.estado)) errores.push('Selecciona un estado.');
    return errores;
  }

  window.Ferreteria.validacionesUsuario = { validarUsuario };
})();
