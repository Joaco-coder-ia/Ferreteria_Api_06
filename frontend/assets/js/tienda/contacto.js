// Valida y guarda consultas para que administración pueda revisarlas.
(function iniciarContacto() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, mostrarMensaje, fechaActual } = sistema.utilidades;

  buscar('#contact-form')?.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(evento.target);
    const nombre = datos.get('nombre').trim();
    const correo = datos.get('correo').trim();
    const comentario = datos.get('comentario').trim();
    const mensaje = buscar('#contact-message-status');

    if (!sistema.validacionesContacto.validarContacto({ nombre, correo, comentario })) {
      mostrarMensaje(mensaje, 'Completa tus datos y escribe una consulta de al menos 10 caracteres.', 'error');
      return;
    }

    estado.consultas.unshift({
      id: `CON-${String(estado.consultas.length + 1).padStart(3, '0')}`,
      nombre, correo, comentario, asunto: datos.get('asunto'), fecha: fechaActual(), estado: 'Nueva'
    });
    sincronizar();
    mostrarMensaje(mensaje, 'Consulta enviada. Nuestro equipo podrá revisarla en administración.');
    evento.target.reset();
  });
})();
