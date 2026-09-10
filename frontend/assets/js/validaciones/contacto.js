// Reglas especificas del formulario de contacto.
(function iniciarValidacionContacto() {
  const comunes = window.Ferreteria.validaciones;

  function erroresContacto(datos) {
    const errores = {};
    if (!comunes.textoValido(datos.nombre, 1, 100)) errores.nombre = 'Ingresa tu nombre (máximo 100 caracteres).';
    if (!comunes.correoValido(datos.correo)) errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).';
    if (!comunes.textoValido(datos.comentario, 1, 500)) errores.comentario = 'Escribe un comentario de hasta 500 caracteres.';
    return errores;
  }

  function validarContacto(datos) {
    return Object.keys(erroresContacto(datos)).length === 0;
  }

  window.Ferreteria.validacionesContacto = { erroresContacto, validarContacto };
})();
