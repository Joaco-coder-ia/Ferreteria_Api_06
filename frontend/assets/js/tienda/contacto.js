// Valida y guarda consultas para que administracion pueda revisarlas.
(function iniciarContacto() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, mostrarMensaje, fechaActual } = sistema.utilidades;
  const { ponerError } = sistema.validaciones;
  const formulario = buscar('#contact-form');
  if (!formulario) return;

  function datosFormulario() {
    const datos = new FormData(formulario);
    return {
      nombre: String(datos.get('nombre') || '').trim(),
      correo: String(datos.get('correo') || '').trim().toLowerCase(),
      comentario: String(datos.get('comentario') || '').trim(),
      asunto: String(datos.get('asunto') || '')
    };
  }

  function validar(mostrar = true) {
    const datos = datosFormulario();
    const errores = sistema.validacionesContacto.erroresContacto(datos);
    if (mostrar) {
      ponerError(buscar('#contact-name'), errores.nombre);
      ponerError(buscar('#contact-email'), errores.correo);
      ponerError(buscar('#contact-message'), errores.comentario);
    }
    return { datos, errores };
  }

  ['#contact-name', '#contact-email', '#contact-message'].forEach((selector) => {
    buscar(selector)?.addEventListener('input', () => validar(true));
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const { datos, errores } = validar(true);
    const mensaje = buscar('#contact-message-status');
    if (Object.keys(errores).length) {
      mostrarMensaje(mensaje, 'Revisa los campos marcados antes de enviar la consulta.', 'error');
      return;
    }

    estado.consultas.unshift({
      id: `CON-${String(estado.consultas.length + 1).padStart(3, '0')}`,
      nombre: datos.nombre,
      correo: datos.correo,
      comentario: datos.comentario,
      asunto: datos.asunto,
      fecha: fechaActual(),
      estado: 'Nueva'
    });
    sincronizar();
    mostrarMensaje(mensaje, 'Consulta enviada correctamente. La simulación quedó registrada para administración.');
    formulario.reset();
    ['#contact-name', '#contact-email', '#contact-message'].forEach((selector) => ponerError(buscar(selector), ''));
  });
})();
