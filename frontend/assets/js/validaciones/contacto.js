// Reglas específicas del formulario de contacto.
(function iniciarValidacionContacto() {
  const comunes = window.Ferreteria.validaciones;

  function validarContacto(datos) {
    return comunes.textoValido(datos.nombre)
      && comunes.correoValido(datos.correo)
      && comunes.textoValido(datos.comentario, 10);
  }

  window.Ferreteria.validacionesContacto = { validarContacto };
})();
