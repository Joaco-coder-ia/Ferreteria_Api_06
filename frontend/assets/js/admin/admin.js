// Protege y completa las páginas del área administrativa.
(function iniciarAdministracion() {
  const sistema = window.Ferreteria;
  const { estado, cargarProductos } = sistema.almacenamiento;
  const { buscar, dinero, escapar, ruta, fechaActual } = sistema.utilidades;
  const principal = buscar('#admin-main');

  if (!principal) return;
  if (!estado.usuario || estado.usuario.rol !== 'Administrador') {
    principal.innerHTML = `<div class="access-denied"><span>Acceso restringido</span><h1>Esta sección es sólo para administración.</h1><p>Inicia sesión con el perfil Administrador para continuar.</p><a class="button button-primary" href="${ruta('tienda/inicio-sesion.html')}">Ir al inicio de sesión</a></div>`;
    document.body.classList.add('is-locked');
    return;
  }

  document.querySelectorAll('[data-admin-name]').forEach((elemento) => { elemento.textContent = estado.usuario.nombre; });
  if (buscar('[data-current-date]')) buscar('[data-current-date]').textContent = fechaActual();
  const dashboard = buscar('#admin-dashboard');
  if (!dashboard) return;

  // Dibuja las últimas ventas sin usar librerias externas.
  function renderGraficoVentas() {
    const contenedor = buscar('#admin-sales-chart');
    if (!contenedor) return;
    const pedidos = estado.pedidos.slice(-6);
    const maximo = Math.max(...pedidos.map((pedido) => Number(pedido.total) || 0), 1);
    contenedor.innerHTML = pedidos.length ? pedidos.map((pedido) => {
      const altura = Math.max(12, Math.round((Number(pedido.total) / maximo) * 100));
      return `<div class="sales-chart-column" title="${escapar(pedido.id)}: ${dinero(pedido.total)}"><span class="sales-chart-value">${dinero(pedido.total)}</span><div class="sales-chart-track"><i style="height:${altura}%"></i></div><small>${escapar(pedido.id.replace('PED-', '#'))}</small></div>`;
    }).join('') : '<div class="chart-empty"><strong>Sin ventas registradas</strong><span>Los pedidos confirmados aparecerán aquí.</span></div>';
  }

  // Resume el avance de pedidos en un gráfico circular.
  function renderGraficoPedidos() {
    const contenedor = buscar('#admin-order-chart');
    if (!contenedor) return;
    const estados = [
      { nombre: 'Pendiente', clase: 'pending', cantidad: estado.pedidos.filter((pedido) => pedido.estado === 'Pendiente').length },
      { nombre: 'Preparando', clase: 'working', cantidad: estado.pedidos.filter((pedido) => pedido.estado === 'Preparando').length },
      { nombre: 'Listo', clase: 'ready', cantidad: estado.pedidos.filter((pedido) => pedido.estado === 'Listo').length }
    ];
    const total = estados.reduce((suma, item) => suma + item.cantidad, 0);
    const pendiente = total ? (estados[0].cantidad / total) * 100 : 0;
    const preparando = total ? (estados[1].cantidad / total) * 100 : 0;
    const corteDos = pendiente + preparando;
    const fondo = total ? `conic-gradient(#f2b705 0 ${pendiente}%,#3f76d3 ${pendiente}% ${corteDos}%,#239665 ${corteDos}% 100%)` : 'conic-gradient(#e4e9ef 0 100%)';
    contenedor.innerHTML = `<div class="donut-chart" style="background:${fondo}" role="img" aria-label="${total} pedidos"><div><strong>${total}</strong><span>pedidos</span></div></div><ul class="chart-legend">${estados.map((item) => `<li><span class="legend-dot legend-${item.clase}"></span><span>${item.nombre}</span><strong>${item.cantidad}</strong></li>`).join('')}</ul>`;
  }

  // Compara el stock disponible agrupando productos por categoría.
  function renderGraficoCategorias(productos) {
    const contenedor = buscar('#admin-category-chart');
    if (!contenedor) return;
    const resumen = productos.reduce((categorias, producto) => {
      const nombre = producto.categoria || 'Otros';
      categorias[nombre] = (categorias[nombre] || 0) + Number(producto.stock || 0);
      return categorias;
    }, {});
    const categorias = Object.entries(resumen).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maximo = Math.max(...categorias.map(([, stock]) => stock), 1);
    contenedor.innerHTML = categorias.map(([nombre, stock]) => `<div class="horizontal-chart-row"><div><strong>${escapar(nombre)}</strong><span>${stock} unidades</span></div><div class="horizontal-chart-track"><i style="width:${Math.max(4, Math.round((stock / maximo) * 100))}%"></i></div></div>`).join('');
  }

  cargarProductos(document.body.dataset.products || ruta('data/catalogo/productos.json')).then((productos) => {
    const stockBajo = productos.filter((producto) => Number(producto.stock) <= Number(producto.stockMinimo));
    const ventas = estado.pedidos.reduce((total, pedido) => total + Number(pedido.total), 0);
    const pedidosPendientes = estado.pedidos.filter((pedido) => pedido.estado === 'Pendiente').length;
    buscar('[data-admin-metrics]').innerHTML = `<article class="admin-metric metric-sales"><span>Ventas registradas</span><strong>${dinero(ventas)}</strong><small>Acumulado simulado</small></article><article class="admin-metric metric-orders"><span>Pedidos</span><strong>${estado.pedidos.length}</strong><small>${pedidosPendientes} pendientes</small></article><article class="admin-metric metric-products"><span>Productos</span><strong>${productos.length}</strong><small>${stockBajo.length} con stock bajo</small></article><article class="admin-metric metric-users"><span>Usuarios activos</span><strong>${estado.usuarios.filter((usuario) => usuario.estado === 'Activo').length}</strong><small>${estado.usuarios.length} registrados</small></article>`;
    buscar('#admin-orders').innerHTML = estado.pedidos.length ? estado.pedidos.slice(-6).reverse().map((pedido) => `<tr><td><strong>${escapar(pedido.id)}</strong></td><td>${escapar(pedido.cliente)}</td><td>${dinero(pedido.total)}</td><td><span class="status-badge status-${pedido.estado.toLowerCase()}">${escapar(pedido.estado)}</span></td></tr>`).join('') : '<tr><td colspan="4" class="table-empty">Todavía no existen pedidos.</td></tr>';
    buscar('#admin-stock').innerHTML = stockBajo.length ? stockBajo.slice(0, 6).map((producto) => `<li><div><strong>${escapar(producto.nombre)}</strong><span>${escapar(producto.codigo)}</span></div><b>${producto.stock} un.</b></li>`).join('') : '<li>Todos los productos superan su stock mínimo.</li>';
    buscar('#admin-messages').innerHTML = estado.consultas.length ? estado.consultas.slice(-4).reverse().map((consulta) => `<article><div><strong>${escapar(consulta.nombre)}</strong><span>${escapar(consulta.asunto)} · ${escapar(consulta.fecha)}</span></div><p>${escapar(consulta.comentario)}</p></article>`).join('') : '<p class="table-empty">No hay consultas nuevas.</p>';
    renderGraficoVentas();
    renderGraficoPedidos();
    renderGraficoCategorias(productos);
  }).catch(() => { dashboard.innerHTML = '<div class="empty"><h2>No pudimos cargar los datos</h2><p>Abre el proyecto con Live Server para permitir la lectura del catálogo.</p></div>'; });
})();
