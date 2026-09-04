// Este archivo valida acceso, registro y contacto.


// Funciones compartidas desde app.js.
const validacionesSistema = window.ferreteria;
const validacionesUsuarios = validacionesSistema.usuariosDemo;
const validacionesEstado = validacionesSistema.estadoAplicacion;
const validacionesBuscar = validacionesSistema.buscarElemento;
const validacionesGuardar = validacionesSistema.guardarEstado;
const validacionesMostrarVista = validacionesSistema.mostrarVista;


// Comprueba una forma básica de correo.
function correoEsValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}


// Muestra mensajes de éxito o error.
function mostrarMensajeFormulario(elemento, mensaje, esError = false) {
  if (!elemento) {
    return;
  }

  elemento.hidden = false;
  elemento.textContent = mensaje;
  elemento.classList.toggle('is-error', esError);
}


// Completa un usuario de demostración.
function completarUsuarioDemo(usuario) {
  const correo = validacionesBuscar('#login-email');
  const clave = validacionesBuscar('#login-password');

  if (!correo || !clave) {
    return;
  }

  correo.value = usuario.email;
  clave.value = 'demo123';

  // Marca el perfil seleccionado.
  document.querySelectorAll('[data-demo]').forEach((boton) => {
    const claveUsuario = Object.keys(validacionesUsuarios).find(
      (claveDemo) =>
        validacionesUsuarios[claveDemo].email === usuario.email
    );

    boton.classList.toggle(
      'is-selected',
      boton.dataset.demo === claveUsuario
    );
  });
}


// Controla los botones de usuarios demo.
document.addEventListener('click', (evento) => {
  const nombreDemo = evento.target
    .closest('[data-demo]')
    ?.dataset.demo;

  if (nombreDemo && validacionesUsuarios[nombreDemo]) {
    completarUsuarioDemo(validacionesUsuarios[nombreDemo]);
  }
});


// Controla cada formulario según su id.
document.addEventListener('submit', (evento) => {
  // Este formulario inicia una sesión simulada.
  if (evento.target.id === 'login-form') {
    evento.preventDefault();

    const correo = validacionesBuscar('#login-email').value
      .trim()
      .toLowerCase();

    const clave = validacionesBuscar('#login-password').value;
    const mensajeError = validacionesBuscar('#login-error');

    const usuarioEncontrado = Object.values(validacionesUsuarios).find(
      (usuario) =>
        usuario.email.toLowerCase() === correo &&
        clave === 'demo123'
    );

    // Muestra un error cuando los datos no coinciden.
    if (!correoEsValido(correo) || !usuarioEncontrado) {
      mostrarMensajeFormulario(
        mensajeError,
        'Correo o contraseña incorrectos para la demostración.',
        true
      );

      return;
    }

    mensajeError.hidden = true;
    validacionesEstado.user = usuarioEncontrado;
    validacionesGuardar();
    validacionesMostrarVista('cuenta');
  }

  // Este formulario simula un registro.
  if (evento.target.id === 'register-form') {
    evento.preventDefault();

    const nombre = validacionesBuscar('#register-name').value.trim();
    const correo = validacionesBuscar('#register-email').value.trim();
    const clave = validacionesBuscar('#register-password').value;
    const mensajeRegistro = validacionesBuscar('#register-message');

    if (!nombre || !correoEsValido(correo) || clave.length < 6) {
      mostrarMensajeFormulario(
        mensajeRegistro,
        'Completa el nombre, un correo válido y una contraseña de 6 caracteres.',
        true
      );

      return;
    }

    // La EP1 no crea una cuenta real.
    mostrarMensajeFormulario(
      mensajeRegistro,
      'Registro simulado correctamente. Ya puedes iniciar sesión.'
    );

    evento.target.reset();
  }

  // Este formulario guarda una consulta local.
  if (evento.target.id === 'contact-form') {
    evento.preventDefault();

    const nombre = validacionesBuscar('#contact-name').value.trim();
    const correo = validacionesBuscar('#contact-email').value.trim();
    const comentario = validacionesBuscar('#contact-message').value.trim();
    const mensajeContacto = validacionesBuscar('#contact-message-status');

    if (!nombre || !correoEsValido(correo) || !comentario) {
      mostrarMensajeFormulario(
        mensajeContacto,
        'Completa tu nombre, un correo válido y el comentario.',
        true
      );

      return;
    }

    validacionesEstado.messages.unshift({
      id: `CON-${String(validacionesEstado.messages.length + 1).padStart(4, '0')}`,
      name: nombre,
      email: correo,
      comment: comentario,
      date: new Date().toLocaleDateString('es-CL')
    });

    validacionesGuardar();

    // La consulta se guarda sólo para la demostración.
    mostrarMensajeFormulario(
      mensajeContacto,
      'Consulta registrada correctamente para esta demostración.'
    );

    evento.target.reset();
  }
});
