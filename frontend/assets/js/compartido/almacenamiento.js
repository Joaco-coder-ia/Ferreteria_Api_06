// Centraliza los datos simulados que se guardan en este navegador.
(function iniciarAlmacenamiento() {
  const claves = {
    usuario: 'ferreteria-usuario',
    usuarios: 'ferreteria-usuarios',
    carrito: 'ferreteria-carrito',
    pedidos: 'ferreteria-pedidos',
    consultas: 'ferreteria-consultas',
    productos: 'ferreteria-productos'
  };

  const usuariosIniciales = [
    {
      id: 'USR-001',
      nombre: 'Administrador',
      apellidos: 'General',
      correo: 'admin@duoc.cl',
      clave: 'demo123',
      rol: 'Administrador',
      estado: 'Activo',
      run: '123456785',
      fechaNacimiento: '1990-01-15',
      telefono: '+56 9 5000 1001',
      region: 'Coquimbo',
      comuna: 'La Serena',
      direccion: 'Casa matriz Los Maestros'
    },
    {
      id: 'USR-002',
      nombre: 'Camila',
      apellidos: 'Vendedora',
      correo: 'vendedor@duoc.cl',
      clave: 'demo123',
      rol: 'Vendedor',
      estado: 'Activo',
      run: '154803203',
      fechaNacimiento: '1995-06-20',
      telefono: '+56 9 5000 1002',
      region: 'Coquimbo',
      comuna: 'Coquimbo',
      direccion: 'Sucursal centro'
    },
    {
      id: 'USR-003',
      nombre: 'Contratista',
      apellidos: 'Demo',
      correo: 'contratista@gmail.com',
      clave: 'demo123',
      rol: 'Contratista',
      estado: 'Activo',
      run: '182041165',
      fechaNacimiento: '',
      telefono: '+56 9 5000 1003',
      region: 'Coquimbo',
      comuna: 'La Serena',
      direccion: 'Av. Balmaceda 2450'
    },
    {
      id: 'USR-004',
      nombre: 'Cliente',
      apellidos: 'Demo',
      correo: 'cliente@gmail.com',
      clave: 'demo123',
      rol: 'Cliente',
      estado: 'Activo',
      run: '197346213',
      fechaNacimiento: '',
      telefono: '+56 9 5000 1004',
      region: 'Coquimbo',
      comuna: 'Ovalle',
      direccion: 'Sector centro, Ovalle'
    }
  ];

  // Información de ejemplo para que los paneles tengan datos al presentarlos.
  const pedidosIniciales = [
    { id: 'PED-0001', cliente: 'Contratista Demo', correo: 'contratista@gmail.com', total: 189990, entrega: 'Retiro en tienda', fecha: '12 ago 2026', fechaISO: '2026-08-12', estado: 'Listo' },
    { id: 'PED-0002', cliente: 'Constructora Horizonte', correo: 'compras@horizonte.cl', total: 428500, entrega: 'Despacho a obra', fecha: '19 ago 2026', fechaISO: '2026-08-19', estado: 'Listo' },
    { id: 'PED-0003', cliente: 'Contratista Demo', correo: 'contratista@gmail.com', total: 76490, entrega: 'Despacho a domicilio', fecha: '27 ago 2026', fechaISO: '2026-08-27', estado: 'Listo' },
    { id: 'PED-0004', cliente: 'Servicios Elqui', correo: 'operaciones@elqui.cl', total: 315800, entrega: 'Retiro en tienda', fecha: '2 sept 2026', fechaISO: '2026-09-02', estado: 'Preparando' },
    { id: 'PED-0005', cliente: 'Contratista Demo', correo: 'contratista@gmail.com', total: 142350, entrega: 'Despacho a domicilio', fecha: '6 sept 2026', fechaISO: '2026-09-06', estado: 'Preparando' },
    { id: 'PED-0006', cliente: 'Maestranza Norte', correo: 'bodega@mnorte.cl', total: 99800, entrega: 'Retiro en tienda', fecha: '8 sept 2026', fechaISO: '2026-09-08', estado: 'Pendiente' },
    { id: 'PED-0007', cliente: 'Contratista Demo', correo: 'contratista@gmail.com', total: 234900, entrega: 'Despacho a domicilio', fecha: '10 sept 2026', fechaISO: '2026-09-10', estado: 'Pendiente' },
    { id: 'PED-0008', cliente: 'Cliente Demo', correo: 'cliente@gmail.com', total: 48990, entrega: 'Retiro en tienda', fecha: '10 sept 2026', fechaISO: '2026-09-10', estado: 'Preparando' }
  ];

  const consultasIniciales = [
    { id: 'CON-001', nombre: 'María Soto', correo: 'maria@ejemplo.cl', asunto: 'Cotización para obra', comentario: 'Necesito disponibilidad y despacho para materiales de construcción.', fecha: '9 sept 2026', estado: 'Nueva' },
    { id: 'CON-002', nombre: 'Diego Pérez', correo: 'diego@ejemplo.cl', asunto: 'Retiro de pedido', comentario: '¿Puedo autorizar a otra persona para retirar mi compra?', fecha: '10 sept 2026', estado: 'Nueva' }
  ];

  function leer(clave, valorInicial) {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado ? JSON.parse(guardado) : valorInicial;
    } catch (error) {
      return valorInicial;
    }
  }

  function guardar(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
    return valor;
  }

  const usuarioAnterior = leer('ep1-user', null);
  const usuarioMigrado = usuarioAnterior ? {
    id: usuarioAnterior.id || 'USR-ANTERIOR',
    nombre: usuarioAnterior.nombre || usuarioAnterior.name,
    correo: usuarioAnterior.correo || usuarioAnterior.email,
    clave: usuarioAnterior.clave || 'demo123',
    rol: usuarioAnterior.rol || usuarioAnterior.role,
    estado: usuarioAnterior.estado || 'Activo'
  } : null;

  const pedidosAnteriores = leer('ep1-orders', []).map((pedido) => ({
    id: pedido.id,
    cliente: pedido.cliente || pedido.customer,
    correo: pedido.correo || pedido.customerEmail || '',
    total: pedido.total,
    entrega: pedido.entrega || pedido.delivery,
    fecha: pedido.fecha || pedido.date,
    estado: pedido.estado || 'Pendiente'
  }));

  const consultasAnteriores = leer('ep1-messages', []).map((consulta) => ({
    id: consulta.id,
    nombre: consulta.nombre || consulta.name,
    correo: consulta.correo || consulta.email,
    comentario: consulta.comentario || consulta.comment,
    asunto: consulta.asunto || 'Consulta general',
    fecha: consulta.fecha || consulta.date,
    estado: consulta.estado || 'Nueva'
  }));

  const estado = {
    usuario: leer(claves.usuario, usuarioMigrado),
    usuarios: leer(claves.usuarios, usuariosIniciales),
    carrito: leer(claves.carrito, leer('ep1-cart', [])),
    pedidos: leer(claves.pedidos, pedidosAnteriores.length ? pedidosAnteriores : pedidosIniciales),
    consultas: leer(claves.consultas, consultasAnteriores.length ? consultasAnteriores : consultasIniciales),
    productos: leer(claves.productos, [])
  };

  // Agrega el escenario de muestra una sola vez, sin reemplazar datos creados por la persona.
  const versionDemo = 'paneles-2026-09-v3-validaciones';
  if (localStorage.getItem('ferreteria-version-demo') !== versionDemo) {
    if (!estado.pedidos.length) estado.pedidos = pedidosIniciales.map((pedido) => ({ ...pedido }));
    if (!estado.consultas.length) estado.consultas = consultasIniciales.map((consulta) => ({ ...consulta }));
    estado.usuarios = estado.usuarios.map((usuario) => {
      const demo = usuariosIniciales.find((item) => item.id === usuario.id);
      return demo ? { ...usuario, ...demo } : usuario;
    });
    usuariosIniciales.forEach((demo) => {
      if (!estado.usuarios.some((usuario) => usuario.correo === demo.correo)) estado.usuarios.push({ ...demo });
    });
    const pedidoCliente = pedidosIniciales.find((pedido) => pedido.id === 'PED-0008');
    if (pedidoCliente && !estado.pedidos.some((pedido) => pedido.id === pedidoCliente.id)) estado.pedidos.push({ ...pedidoCliente });
    localStorage.setItem('ferreteria-version-demo', versionDemo);
  }

  function sincronizar() {
    guardar(claves.usuario, estado.usuario);
    guardar(claves.usuarios, estado.usuarios);
    guardar(claves.carrito, estado.carrito);
    guardar(claves.pedidos, estado.pedidos);
    guardar(claves.consultas, estado.consultas);
    guardar(claves.productos, estado.productos);
  }

  async function cargarProductos(rutaJson) {
    if (estado.productos.length) {
      return estado.productos;
    }

    const respuesta = await fetch(rutaJson);

    if (!respuesta.ok) {
      throw new Error('No fue posible cargar el catálogo.');
    }

    estado.productos = await respuesta.json();
    guardar(claves.productos, estado.productos);
    return estado.productos;
  }

  window.Ferreteria = window.Ferreteria || {};
  window.Ferreteria.almacenamiento = {
    claves,
    estado,
    leer,
    guardar,
    sincronizar,
    cargarProductos
  };
})();
