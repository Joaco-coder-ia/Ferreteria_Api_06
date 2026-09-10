// Calcula cantidades, entrega y confirmación del pedido.
(function iniciarCarrito() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, dinero, escapar, fechaActual, imagenProducto } = sistema.utilidades;
  const contenedor = buscar('#cart-content');
  if (!contenedor) return;

  function total() {
    return estado.carrito.reduce((suma, item) => suma + item.precioVenta * item.cantidad, 0);
  }

  function render() {
    if (!estado.carrito.length) {
      contenedor.innerHTML = `
        <div class="empty pro-empty"><span>0 productos</span><h2>Tu carrito está esperando.</h2>
        <p>Explora el catálogo y agrega los materiales de tu próximo proyecto.</p>
        <a class="button button-primary button-large" href="catalogo.html">Ir al catálogo</a></div>`;
      return;
    }

    contenedor.innerHTML = `
      <div class="pro-cart-layout">
        <div class="cart-products">
          ${estado.carrito.map((item) => `
            <article class="pro-cart-item">
              <a class="cart-product-thumb" href="producto-detalle.html?codigo=${encodeURIComponent(item.codigo)}">
                <img src="${imagenProducto(item)}" alt="" loading="lazy" />
              </a>
              <div><p class="product-code">${escapar(item.codigo)}</p><h2>${escapar(item.nombre)}</h2><p>${dinero(item.precioVenta)} por ${escapar(item.unidad.toLowerCase())}</p></div>
              <div class="quantity-control">
                <button type="button" data-quantity-action="restar" data-code="${item.codigo}" aria-label="Restar una unidad">−</button>
                <span>${item.cantidad}</span>
                <button type="button" data-quantity-action="sumar" data-code="${item.codigo}" aria-label="Agregar una unidad">+</button>
              </div>
              <strong>${dinero(item.precioVenta * item.cantidad)}</strong>
              <button class="remove-button" type="button" data-remove="${item.codigo}">Eliminar</button>
            </article>`).join('')}
        </div>
        <form id="checkout-form" class="checkout-card">
          <p class="eyebrow">Resumen del pedido</p><h2>Tu compra</h2>
          <div class="checkout-line"><span>Subtotal</span><strong>${dinero(total())}</strong></div>
          <div class="checkout-line"><span>Despacho</span><strong>A coordinar</strong></div>
          <div class="checkout-total"><span>Total estimado</span><strong>${dinero(total())}</strong></div>
          <fieldset><legend>Tipo de entrega</legend>
            <label><input type="radio" name="entrega" value="Retiro en tienda" checked /> Retiro en tienda</label>
            <label><input type="radio" name="entrega" value="Despacho a obra" /> Despacho a obra</label>
          </fieldset>
          <button class="button button-primary button-large full" type="submit">Confirmar pedido</button>
          <small>Este pedido es una simulación académica y no genera cobros.</small>
        </form>
      </div>`;
  }

  document.addEventListener('click', (evento) => {
    const accion = evento.target.closest('[data-quantity-action]');
    const eliminar = evento.target.closest('[data-remove]');

    if (accion) {
      const item = estado.carrito.find((producto) => producto.codigo === accion.dataset.code);
      if (item) item.cantidad += accion.dataset.quantityAction === 'sumar' ? 1 : -1;
      estado.carrito = estado.carrito.filter((producto) => producto.cantidad > 0);
    }

    if (eliminar) estado.carrito = estado.carrito.filter((item) => item.codigo !== eliminar.dataset.remove);

    if (accion || eliminar) {
      sincronizar(); sistema.app.actualizarCabecera(); render();
    }
  });

  document.addEventListener('submit', (evento) => {
    if (evento.target.id !== 'checkout-form') return;
    evento.preventDefault();
    const entrega = new FormData(evento.target).get('entrega');
    estado.pedidos.unshift({
      id: `PED-${String(estado.pedidos.length + 1).padStart(4, '0')}`,
      cliente: estado.usuario?.nombre || 'Cliente invitado',
      correo: estado.usuario?.correo || '',
      total: total(), entrega, fecha: fechaActual(), fechaISO: new Date().toISOString().slice(0, 10), estado: 'Pendiente'
    });
    estado.carrito = [];
    sincronizar(); sistema.app.actualizarCabecera();
    contenedor.innerHTML = '<div class="empty pro-empty"><span>Pedido confirmado</span><h2>Recibimos tu solicitud.</h2><p>La compra quedó disponible en el historial de tu cuenta.</p><a class="button button-primary" href="cuenta.html">Ver mi cuenta</a></div>';
  });

  render();
})();
