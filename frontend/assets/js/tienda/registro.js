// Registra una cuenta simulada desde la tienda.
(function iniciarRegistro() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, mostrarMensaje } = sistema.utilidades;
  const { correoValido, textoValido, claveValida, ponerError } = sistema.validaciones;
  const formulario = buscar('#register-form');
  if (!formulario) return;

  function leerDatos() {
    const datos = new FormData(formulario);
    return {
      nombre: String(datos.get('nombre') || '').trim(),
      correo: String(datos.get('correo') || '').trim().toLowerCase(),
      telefono: String(datos.get('telefono') || '').trim(),
      region: String(datos.get('region') || ''),
      comuna: String(datos.get('comuna') || ''),
      clave: String(datos.get('clave') || ''),
      confirmarClave: String(datos.get('confirmarClave') || '')
    };
  }

  function validar() {
    const datos = leerDatos();
    const errores = {
      nombre: textoValido(datos.nombre, 1, 50) ? '' : 'Ingresa tu nombre (máximo 50 caracteres).',
      correo: correoValido(datos.correo) ? '' : 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).',
      region: datos.region ? '' : 'Selecciona una región.',
      comuna: datos.comuna ? '' : 'Selecciona una comuna.',
      clave: claveValida(datos.clave) ? '' : 'La contraseña debe tener entre 4 y 10 caracteres.',
      confirmarClave: datos.confirmarClave === datos.clave && datos.confirmarClave ? '' : 'Las contraseñas deben coincidir.'
    };
    Object.entries(errores).forEach(([nombre, error]) => ponerError(formulario.elements[nombre], error));
    return { datos, errores };
  }

  ['input', 'change'].forEach((evento) => formulario.addEventListener(evento, (e) => {
    if (e.target.matches('input, select')) validar();
  }));

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const { datos, errores } = validar();
    const mensaje = buscar('#register-message');
    if (Object.values(errores).some(Boolean)) {
      mostrarMensaje(mensaje, 'Revisa los campos marcados antes de crear la cuenta.', 'error');
      return;
    }
    if (estado.usuarios.some((usuario) => usuario.correo.toLowerCase() === datos.correo)) {
      ponerError(formulario.elements.correo, 'Este correo ya está registrado.');
      mostrarMensaje(mensaje, 'El correo indicado ya pertenece a otra cuenta.', 'error');
      return;
    }

    estado.usuarios.push({
      id: `USR-${String(estado.usuarios.length + 1).padStart(3, '0')}`,
      nombre: datos.nombre,
      apellidos: '',
      correo: datos.correo,
      telefono: datos.telefono,
      region: datos.region,
      comuna: datos.comuna,
      clave: datos.clave,
      rol: 'Cliente',
      estado: 'Activo'
    });
    sincronizar();
    mostrarMensaje(mensaje, 'Cuenta creada correctamente. Ya puedes iniciar sesión.');
    formulario.reset();
    formulario.querySelectorAll('.field-error').forEach((error) => { error.hidden = true; error.textContent = ''; });
  });
})();
