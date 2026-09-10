// Reglas exigidas para crear y editar usuarios desde administracion.
(function iniciarValidacionUsuarios() {
  const comunes = window.Ferreteria.validaciones;

  function erroresUsuario(datos, opciones = {}) {
    const errores = {};
    if (!comunes.runValido(datos.run)) errores.run = 'Ingresa un RUN válido, sin puntos ni guion, de 7 a 9 caracteres.';
    if (!comunes.textoValido(datos.nombre, 1, 50)) errores.nombre = 'El nombre es obligatorio y admite hasta 50 caracteres.';
    if (!comunes.textoValido(datos.apellidos, 1, 100)) errores.apellidos = 'Los apellidos son obligatorios y admiten hasta 100 caracteres.';
    if (!comunes.correoValido(datos.correo)) errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).';
    if (!comunes.textoValido(datos.direccion, 1, 300)) errores.direccion = 'La dirección es obligatoria y admite hasta 300 caracteres.';
    if (!comunes.textoValido(datos.region, 1)) errores.region = 'Selecciona una región.';
    if (!comunes.textoValido(datos.comuna, 1)) errores.comuna = 'Selecciona una comuna de la región indicada.';
    if (!['Administrador', 'Vendedor', 'Cliente', 'Contratista'].includes(datos.rol)) errores.rol = 'Selecciona un perfil válido.';
    if (!['Activo', 'Inactivo'].includes(datos.estado)) errores.estado = 'Selecciona un estado válido.';
    if (!opciones.claveOpcional || datos.clave) {
      if (!comunes.claveValida(datos.clave)) errores.clave = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }
    return errores;
  }

  function validarUsuario(datos, opciones = {}) {
    return Object.values(erroresUsuario(datos, opciones));
  }

  window.Ferreteria.validacionesUsuario = { erroresUsuario, validarUsuario };
})();
