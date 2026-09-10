// Construye la cuenta del cliente o contratista y su historial personal.
(function iniciarCuenta() {
  const sistema = window.Ferreteria;
  const { estado } = sistema.almacenamiento;
  const { buscar, dinero, escapar, ruta } = sistema.utilidades;
  const contenido = buscar('#account-content');
  if (!contenido) return;

  if (!estado.usuario) {
    contenido.innerHTML = '<div class="empty pro-empty"><span>Acceso privado</span><h2>Inicia sesión para revisar tu cuenta.</h2><a class="button button-primary" href="inicio-sesion.html">Iniciar sesión</a></div>';
    return;
  }
  if (estado.usuario.rol === 'Administrador') { window.location.href = ruta('admin/index.html'); return; }
  if (estado.usuario.rol === 'Vendedor') { window.location.href = ruta('vendedor/index.html'); return; }

  const pedidos = estado.pedidos.filter((pedido) => pedido.correo === estado.usuario.correo);
  const totalComprado = pedidos.reduce((total, pedido) => total + Number(pedido.total), 0);
  const activos = pedidos.filter((pedido) => pedido.estado !== 'Listo').length;
  const nombreEspacio = estado.usuario.rol === 'Cliente' ? 'Cuenta de cliente' : 'Cuenta contratista';

  contenido.innerHTML = `
    <section class="account-welcome">
      <div><p class="eyebrow">${nombreEspacio}</p><h1>Hola, ${escapar(estado.usuario.nombre)}.</h1><p>${escapar(estado.usuario.correo)} · ${escapar(estado.usuario.comuna || 'Región de Coquimbo')}</p></div>
      <button class="button button-secondary" type="button" data-logout>Cerrar sesión</button>
    </section>
    <section class="metric-grid metric-grid-customer">
      <article class="metric-card"><span>Pedidos</span><strong>${pedidos.length}</strong><small>Solicitudes realizadas</small></article>
      <article class="metric-card"><span>Total histórico</span><strong>${dinero(totalComprado)}</strong><small>Valor acumulado</small></article>
      <article class="metric-card"><span>En preparación</span><strong>${activos}</strong><small>Pedidos en proceso</small></article>
      <article class="metric-card"><span>Carrito actual</span><strong>${estado.carrito.length}</strong><small>Productos diferentes</small></article>
    </section>
    <section class="customer-analytics">
      <article class="dashboard-card dashboard-wide"><p class="eyebrow">Actividad personal</p><h2>Valor de mis compras</h2><div id="customer-purchases-chart" class="sales-chart customer-chart"></div></article>
      <article class="dashboard-card budget-calculator"><p class="eyebrow">Planificación</p><h2>Calculadora rápida de proyecto</h2><p>Estima material, IVA y total antes de cotizar.</p><label>Precio unitario<input id="budget-unit-price" type="number" min="0" step="1" value="10000" /></label><label>Cantidad<input id="budget-quantity" type="number" min="1" step="1" value="1" /></label><dl><div><dt>Neto</dt><dd data-budget-net>$10.000</dd></div><div><dt>IVA (19%)</dt><dd data-budget-tax>$1.900</dd></div><div><dt>Total estimado</dt><dd data-budget-total>$11.900</dd></div></dl></article>
    </section>
    <section class="dashboard-grid">
      <article class="dashboard-card dashboard-wide"><p class="eyebrow">Seguimiento</p><h2>Mis pedidos</h2><div class="order-list professional-orders">${pedidos.length ? pedidos.slice().reverse().map((pedido) => `<div><span class="order-state-marker state-${pedido.estado.toLowerCase()}"></span><strong>${escapar(pedido.id)}</strong><span>${escapar(pedido.fecha)} · ${escapar(pedido.estado)}</span><b>${dinero(pedido.total)}</b></div>`).join('') : '<p class="empty-small">Todavía no tienes pedidos confirmados.</p>'}</div></article>
      <article class="dashboard-card"><p class="eyebrow">Accesos rápidos</p><h2>Continúa tu compra</h2><div class="action-list"><a class="button button-primary" href="catalogo.html">Ver catálogo</a><a class="button button-secondary" href="carrito.html">Revisar carrito</a><a class="button button-light" href="contacto.html">Pedir ayuda</a></div></article>
    </section>`;

  function renderCompras() {
    const contenedor = buscar('#customer-purchases-chart');
    const ultimos = pedidos.slice(-6);
    const maximo = Math.max(...ultimos.map((pedido) => Number(pedido.total)), 1);
    contenedor.innerHTML = ultimos.length
      ? ultimos.map((pedido) => `<div class="sales-chart-column"><span class="sales-chart-value">${dinero(pedido.total)}</span><div class="sales-chart-track"><i style="height:${Math.max(12, Math.round((Number(pedido.total) / maximo) * 100))}%"></i></div><small>${escapar(pedido.id.replace('PED-', '#'))}</small></div>`).join('')
      : '<div class="chart-empty"><strong>Aún no hay compras</strong><span>Tu historial aparecerá en este gráfico.</span></div>';
  }

  function calcularPresupuesto() {
    const precio = Math.max(0, Number(buscar('#budget-unit-price').value) || 0);
    const cantidad = Math.max(1, Number(buscar('#budget-quantity').value) || 1);
    const neto = precio * cantidad;
    const iva = Math.round(neto * 0.19);
    buscar('[data-budget-net]').textContent = dinero(neto);
    buscar('[data-budget-tax]').textContent = dinero(iva);
    buscar('[data-budget-total]').textContent = dinero(neto + iva);
  }

  renderCompras();
  buscar('#budget-unit-price').addEventListener('input', calcularPresupuesto);
  buscar('#budget-quantity').addEventListener('input', calcularPresupuesto);
  calcularPresupuesto();
})();
