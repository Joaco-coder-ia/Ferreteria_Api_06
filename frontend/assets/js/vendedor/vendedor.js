// Panel operativo del vendedor: pedidos, ventas y alertas de stock.
(function iniciarPanelVendedor() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar, cargarProductos } = sistema.almacenamiento;
  const { buscar, dinero, escapar, ruta, fechaActual, imagenProducto, mostrarMensaje } = sistema.utilidades;
  const principal = buscar('#seller-main');
  if (!principal) return;

  if (!estado.usuario || estado.usuario.rol !== 'Vendedor') {
    principal.innerHTML = `<div class="access-denied"><span>Acceso restringido</span><h1>Este espacio corresponde al equipo de ventas.</h1><p>Utiliza el perfil Vendedor para administrar la preparación de pedidos.</p><a class="button button-primary" href="${ruta('tienda/inicio-sesion.html')}">Iniciar sesión como vendedor</a></div>`;
    return;
  }

  document.querySelectorAll('[data-seller-name]').forEach((elemento) => { elemento.textContent = estado.usuario.nombre; });
  buscar('[data-current-date]').textContent = fechaActual();

  function pedidosFiltrados() {
    const texto = (buscar('#seller-search')?.value || '').trim().toLowerCase();
    const estadoElegido = buscar('#seller-status-filter')?.value || 'todos';
    return estado.pedidos.filter((pedido) => {
      const coincideTexto = `${pedido.id} ${pedido.cliente}`.toLowerCase().includes(texto);
      const coincideEstado = estadoElegido === 'todos' || pedido.estado === estadoElegido;
      return coincideTexto && coincideEstado;
    });
  }

  function renderPedidos() {
    const pedidos = pedidosFiltrados();
    buscar('#seller-orders').innerHTML = pedidos.length
      ? pedidos.slice().reverse().map((pedido) => `<tr><td><strong>${escapar(pedido.id)}</strong><span>${escapar(pedido.cliente)}</span></td><td>${dinero(pedido.total)}</td><td>${escapar(pedido.entrega)}</td><td><select data-order-status="${pedido.id}" aria-label="Estado de ${pedido.id}"><option ${pedido.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option><option ${pedido.estado === 'Preparando' ? 'selected' : ''}>Preparando</option><option ${pedido.estado === 'Listo' ? 'selected' : ''}>Listo</option></select></td></tr>`).join('')
      : '<tr><td colspan="4" class="table-empty">No hay pedidos que coincidan con el filtro.</td></tr>';
  }

  function renderIndicadores(stockBajo) {
    const activos = estado.pedidos.filter((pedido) => pedido.estado !== 'Listo').length;
    const listos = estado.pedidos.filter((pedido) => pedido.estado === 'Listo').length;
    const ventaTotal = estado.pedidos.reduce((total, pedido) => total + Number(pedido.total), 0);
    buscar('[data-seller-metrics]').innerHTML = `<article class="admin-metric"><span>Pedidos activos</span><strong>${activos}</strong><small>En la cola de trabajo</small></article><article class="admin-metric"><span>Pedidos listos</span><strong>${listos}</strong><small>Proceso completado</small></article><article class="admin-metric"><span>Venta registrada</span><strong>${dinero(ventaTotal)}</strong><small>Total simulado</small></article><article class="admin-metric"><span>Stock bajo</span><strong>${stockBajo.length}</strong><small>Productos para informar</small></article>`;
  }

  function renderGrafico() {
    const datos = [
      { nombre: 'Pendiente', clase: 'pending', cantidad: estado.pedidos.filter((pedido) => pedido.estado === 'Pendiente').length },
      { nombre: 'Preparando', clase: 'working', cantidad: estado.pedidos.filter((pedido) => pedido.estado === 'Preparando').length },
      { nombre: 'Listo', clase: 'ready', cantidad: estado.pedidos.filter((pedido) => pedido.estado === 'Listo').length }
    ];
    const total = datos.reduce((suma, item) => suma + item.cantidad, 0);
    const uno = total ? (datos[0].cantidad / total) * 100 : 0;
    const dos = total ? uno + (datos[1].cantidad / total) * 100 : 0;
    const fondo = total ? `conic-gradient(#f2b705 0 ${uno}%,#3f76d3 ${uno}% ${dos}%,#239665 ${dos}% 100%)` : '#e4e9ef';
    buscar('#seller-order-chart').innerHTML = `<div class="donut-chart" style="background:${fondo}"><div><strong>${total}</strong><span>pedidos</span></div></div><ul class="chart-legend">${datos.map((item) => `<li><span class="legend-dot legend-${item.clase}"></span><span>${item.nombre}</span><strong>${item.cantidad}</strong></li>`).join('')}</ul>`;

    const pendientes = estado.pedidos.filter((pedido) => pedido.estado !== 'Listo').slice(-4).reverse();
    buscar('#seller-priority').innerHTML = pendientes.length
      ? pendientes.map((pedido, indice) => `<article><span>${String(indice + 1).padStart(2, '0')}</span><div><strong>${escapar(pedido.cliente)}</strong><small>${escapar(pedido.id)} · ${escapar(pedido.entrega)}</small></div><b class="status-badge status-${pedido.estado.toLowerCase()}">${escapar(pedido.estado)}</b><em>${dinero(pedido.total)}</em></article>`).join('')
      : '<div class="chart-empty"><strong>Trabajo al día</strong><span>No hay pedidos pendientes.</span></div>';
  }

  let alertasStock = [];
  cargarProductos(document.body.dataset.products || ruta('data/catalogo/productos.json')).then((productos) => {
    alertasStock = productos.filter((producto) => Number(producto.stock) <= Number(producto.stockMinimo));
    buscar('#seller-stock').innerHTML = alertasStock.slice(0, 7).map((producto) => `<li><img class="inventory-thumb" src="${imagenProducto(producto)}" alt="" loading="lazy" /><div><strong>${escapar(producto.nombre)}</strong><span>${escapar(producto.codigo)}</span></div><b>${producto.stock} un.</b></li>`).join('') || '<li>Sin alertas de inventario.</li>';
    renderIndicadores(alertasStock);
    renderGrafico();
    renderPedidos();
  });

  document.addEventListener('input', (evento) => { if (evento.target.id === 'seller-search') renderPedidos(); });
  document.addEventListener('change', (evento) => {
    if (evento.target.id === 'seller-status-filter') renderPedidos();
    if (!evento.target.matches('[data-order-status]')) return;
    const pedido = estado.pedidos.find((item) => item.id === evento.target.dataset.orderStatus);
    if (!pedido) return;
    pedido.estado = evento.target.value;
    sincronizar();
    renderIndicadores(alertasStock);
    renderGrafico();
    renderPedidos();
    mostrarMensaje(buscar('#seller-feedback'), `${pedido.id} ahora está ${pedido.estado.toLowerCase()}.`);
  });
})();
