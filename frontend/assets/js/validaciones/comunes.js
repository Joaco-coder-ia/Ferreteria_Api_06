// Validaciones reutilizadas por los formularios.
(function iniciarValidacionesComunes() {
  function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim());
  }

  function textoValido(texto, minimo = 2) {
    return String(texto).trim().length >= minimo;
  }

  function claveValida(clave) {
    return String(clave).length >= 6;
  }

  function numeroPositivo(valor) {
    return Number.isFinite(Number(valor)) && Number(valor) >= 0;
  }

  window.Ferreteria = window.Ferreteria || {};
  window.Ferreteria.validaciones = {
    correoValido,
    textoValido,
    claveValida,
    numeroPositivo
  };
})();
