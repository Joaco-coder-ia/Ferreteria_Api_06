// Reglas comunes exigidas por la EP1 para los formularios.
(function iniciarValidacionesComunes() {
  const dominiosCorreo = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

  function textoValido(texto, minimo = 1, maximo = Infinity) {
    const largo = String(texto ?? '').trim().length;
    return largo >= minimo && largo <= maximo;
  }

  function correoValido(correo) {
    const valor = String(correo ?? '').trim().toLowerCase();
    if (!valor || valor.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return false;
    return dominiosCorreo.includes(valor.split('@').pop());
  }

  function claveValida(clave) {
    const largo = String(clave ?? '').length;
    return largo >= 4 && largo <= 10;
  }

  function numeroNoNegativo(valor) {
    return valor !== '' && Number.isFinite(Number(valor)) && Number(valor) >= 0;
  }

  function enteroNoNegativo(valor) {
    return numeroNoNegativo(valor) && Number.isInteger(Number(valor));
  }

  function runValido(run) {
    const valor = String(run ?? '').trim().toUpperCase();
    if (!/^[0-9]{6,8}[0-9K]$/.test(valor) || valor.length < 7 || valor.length > 9) return false;

    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1);
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
      suma += Number(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resultado = 11 - (suma % 11);
    const esperado = resultado === 11 ? '0' : resultado === 10 ? 'K' : String(resultado);
    return dv === esperado;
  }

  function ponerError(campo, mensaje = '') {
    if (!campo) return;
    let salida = campo.parentElement?.querySelector(`.field-error[data-error-for="${campo.id}"]`);
    if (!salida) {
      salida = document.createElement('small');
      salida.className = 'field-error';
      salida.dataset.errorFor = campo.id;
      salida.setAttribute('role', 'alert');
      campo.insertAdjacentElement('afterend', salida);
    }
    salida.textContent = mensaje;
    salida.hidden = !mensaje;
    campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  }

  // Compatibilidad con el nombre utilizado por el codigo anterior.
  const numeroPositivo = numeroNoNegativo;

  window.Ferreteria = window.Ferreteria || {};
  window.Ferreteria.validaciones = {
    dominiosCorreo,
    textoValido,
    correoValido,
    claveValida,
    numeroNoNegativo,
    numeroPositivo,
    enteroNoNegativo,
    runValido,
    ponerError
  };
})();
