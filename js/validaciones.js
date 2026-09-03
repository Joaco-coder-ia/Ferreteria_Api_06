// En este archivo revisamos los formularios antes de aceptar sus datos.
// Asi las validaciones no quedan mezcladas con el catalogo o la navegacion.


// Recuperamos el estado y las funciones generales que vienen desde app.js.
const validacionesSistema = window.ferreteria;
const validacionesUsuarios = validacionesSistema.usuariosDemo;
const validacionesEstado = validacionesSistema.estadoAplicacion;
const validacionesBuscar = validacionesSistema.buscarElemento;
const validacionesGuardar = validacionesSistema.guardarEstado;
const validacionesMostrarVista = validacionesSistema.mostrarVista;


// Esta expresion comprueba una forma basica de correo: texto@dominio.cl.
// No envia ningun dato, solamente lo revisa dentro del navegador.
function correoEsValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}


// Esta funcion muestra los mensajes de exito o error debajo de cada formulario.
function mostrarMensajeFormulario(elemento, mensaje, esError = false) {
  if (!elemento) {
    return;
  }

  elemento.hidden = false;
  elemento.textContent = mensaje;
  elemento.classList.toggle('is-error', esError);
}


// Esto rellena el correo y la clave cuando elegimos un perfil de demostracion.
function completarUsuarioDemo(usuario) {
  const correo = validacionesBuscar('#login-email');
  const clave = validacionesBuscar('#login-password');

  if (!correo || !clave) {
    return;
  }

  correo.value = usuario.email;
  clave.value = 'demo123';

  // Marcamos el boton elegido para que sea facil reconocerlo visualmente.
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


// Escuchamos los perfiles demo porque esos botones no envian un formulario.
document.addEventListener('click', (evento) => {
  const nombreDemo = evento.target
    .closest('[data-demo]')
    ?.dataset.demo;

  if (nombreDemo && validacionesUsuarios[nombreDemo]) {
    completarUsuarioDemo(validacionesUsuarios[nombreDemo]);
  }
});


// Esta parte controla todos los formularios, pero cada uno se reconoce por su id.
document.addEventListener('submit', (evento) => {
  // Primero validamos el formulario para iniciar sesion.
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

    // Si falta informacion o no coincide dejamos un mensaje explicativo.
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
    validacionesMostrarVista('inicio');
  }

  // Despues revisamos el registro de un cliente nuevo.
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

    // La EP1 no crea una cuenta real, solamente demuestra la validacion visual.
    mostrarMensajeFormulario(
      mensajeRegistro,
      'Registro simulado correctamente. Ya puedes iniciar sesión.'
    );

    evento.target.reset();
  }

  // Por ultimo revisamos el formulario que se encuentra en contacto.html.
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

    // La consulta se simula y no se manda a una base de datos externa.
    mostrarMensajeFormulario(
      mensajeContacto,
      'Consulta registrada correctamente para esta demostración.'
    );

    evento.target.reset();
  }
});
