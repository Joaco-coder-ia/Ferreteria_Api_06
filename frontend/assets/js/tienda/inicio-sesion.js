// Inicia una sesion simulada y explica el espacio de cada perfil.
(function iniciarSesion() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, mostrarMensaje, ruta } = sistema.utilidades;
  const { correoValido, claveValida, ponerError } = sistema.validaciones;

  const perfiles = {
    Administrador: { kicker: 'Centro de control administrativo', titulo: 'Decisiones claras con toda la operación a la vista.', descripcion: 'El administrador controla usuarios, catálogo, inventario, consultas y resultados desde un panel ejecutivo.', capacidades: ['Indicadores y gráficos del negocio', 'Creación y edición de usuarios', 'Administración completa de productos'], estadistica: '360°', etiqueta: 'visión del negocio' },
    Vendedor: { kicker: 'Estación operativa de ventas', titulo: 'Cada pedido avanza sin perder el control.', descripcion: 'El vendedor consulta stock, prioriza solicitudes y actualiza el estado de cada pedido durante la preparación.', capacidades: ['Cola de pedidos filtrable', 'Consulta completa del catálogo', 'Alertas visuales de inventario'], estadistica: '3', etiqueta: 'etapas de preparación' },
    Contratista: { kicker: 'Espacio profesional de obra', titulo: 'Compras y presupuesto pensados para cada proyecto.', descripcion: 'El contratista revisa su historial, controla pedidos activos y estima rápidamente el valor de nuevos materiales.', capacidades: ['Historial y gráfico de compras', 'Seguimiento de pedidos', 'Calculadora de materiales e IVA'], estadistica: '1', etiqueta: 'panel personal de obra' },
    Cliente: { kicker: 'Cuenta de compras personales', titulo: 'Una experiencia simple para comprar con confianza.', descripcion: 'El usuario explora el catálogo, guarda productos, confirma su pedido y revisa todo desde una cuenta personal.', capacidades: ['Catálogo con fotografías reales', 'Carrito y entrega simulada', 'Historial personal protegido'], estadistica: '24/7', etiqueta: 'acceso a la tienda' }
  };

  function actualizarPresentacion(rol) {
    const perfil = perfiles[rol];
    if (!perfil) return;
    buscar('[data-profile-panel]').dataset.profilePanel = rol.toLowerCase();
    buscar('[data-profile-kicker]').textContent = perfil.kicker;
    buscar('[data-profile-title]').textContent = perfil.titulo;
    buscar('[data-profile-description]').textContent = perfil.descripcion;
    buscar('[data-profile-capabilities]').innerHTML = perfil.capacidades.map((texto) => `<li>${texto}</li>`).join('');
    buscar('[data-profile-stat]').textContent = perfil.estadistica;
    buscar('[data-profile-stat-label]').textContent = perfil.etiqueta;
  }

  function validarCampos() {
    const correo = buscar('#login-email').value.trim().toLowerCase();
    const clave = buscar('#login-password').value;
    const errorCorreo = correoValido(correo) ? '' : 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).';
    const errorClave = claveValida(clave) ? '' : 'La contraseña debe tener entre 4 y 10 caracteres.';
    ponerError(buscar('#login-email'), errorCorreo);
    ponerError(buscar('#login-password'), errorClave);
    return { correo, clave, valido: !errorCorreo && !errorClave };
  }

  document.querySelectorAll('[data-demo-user]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const usuario = estado.usuarios.find((item) => item.rol === boton.dataset.demoUser && item.estado === 'Activo');
      if (!usuario) return;
      buscar('#login-email').value = usuario.correo;
      buscar('#login-password').value = usuario.clave;
      document.querySelectorAll('[data-demo-user]').forEach((item) => item.classList.toggle('is-selected', item === boton));
      actualizarPresentacion(boton.dataset.demoUser);
      validarCampos();
    });
  });

  buscar('#login-email')?.addEventListener('input', validarCampos);
  buscar('#login-password')?.addEventListener('input', validarCampos);

  buscar('#login-form')?.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const { correo, clave, valido } = validarCampos();
    const mensaje = buscar('#login-message');
    if (!valido) {
      mostrarMensaje(mensaje, 'Corrige los datos marcados antes de continuar.', 'error');
      return;
    }

    const usuario = estado.usuarios.find((item) => item.correo.toLowerCase() === correo && item.clave === clave && item.estado === 'Activo');
    if (!usuario) {
      mostrarMensaje(mensaje, 'El correo o la contraseña no coinciden con un perfil activo.', 'error');
      return;
    }

    estado.usuario = usuario;
    sincronizar();
    if (usuario.rol === 'Administrador') window.location.href = ruta('admin/index.html');
    else if (usuario.rol === 'Vendedor') window.location.href = ruta('vendedor/index.html');
    else window.location.href = 'cuenta.html';
  });
})();
