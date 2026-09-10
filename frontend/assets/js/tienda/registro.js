// Registra un cliente nuevo solamente dentro de la demostración.
(function iniciarRegistro() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, mostrarMensaje } = sistema.utilidades;
  const { correoValido, textoValido, claveValida } = sistema.validaciones;

  buscar('#register-form')?.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(evento.target);
    const nombre = datos.get('nombre').trim();
    const correo = datos.get('correo').trim().toLowerCase();
    const clave = datos.get('clave');
    const mensaje = buscar('#register-message');

    if (!textoValido(nombre) || !correoValido(correo) || !claveValida(clave)) {
      mostrarMensaje(mensaje, 'Revisa el nombre, el correo y una contraseña de al menos 6 caracteres.', 'error');
      return;
    }

    if (estado.usuarios.some((usuario) => usuario.correo.toLowerCase() === correo)) {
      mostrarMensaje(mensaje, 'Este correo ya está registrado.', 'error');
      return;
    }

    estado.usuarios.push({
      id: `USR-${String(estado.usuarios.length + 1).padStart(3, '0')}`,
      nombre, correo, clave, rol: 'Contratista', estado: 'Activo', comuna: datos.get('comuna')
    });
    sincronizar();
    mostrarMensaje(mensaje, 'Cuenta creada correctamente. Ya puedes iniciar sesión.');
    evento.target.reset();
  });
})();
