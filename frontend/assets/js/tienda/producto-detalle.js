// Presenta el detalle del producto indicado en la dirección.
(function iniciarDetalleProducto() {
  const sistema = window.Ferreteria;
  const { estado, cargarProductos, sincronizar } = sistema.almacenamiento;
  const { buscar, dinero, escapar, ruta, imagenProducto } = sistema.utilidades;
  const contenedor = buscar('#product-detail');
  if (!contenedor) return;

  const codigo = new URLSearchParams(window.location.search).get('codigo');
  cargarProductos(document.body.dataset.products || ruta('data/catalogo/productos.json')).then(() => {
    const producto = estado.productos.find((item) => item.codigo === codigo);

    if (!producto) {
      contenedor.innerHTML = '<div class="empty"><h1>Producto no encontrado</h1><a class="button button-primary" href="catalogo.html">Volver al catálogo</a></div>';
      return;
    }

    document.title = `${producto.nombre} | Los Maestros`;
    contenedor.innerHTML = `
      <div class="detail-media-panel">
        <img src="${imagenProducto(producto)}" alt="${escapar(producto.nombre)}" />
        <span>Imagen referencial</span>
      </div>
      <div class="detail-information">
        <p class="product-code">${escapar(producto.codigo)} · ${escapar(producto.categoria)}</p>
        <h1>${escapar(producto.nombre)}</h1>
        <p class="detail-brand">Marca ${escapar(producto.marca)} · Venta por ${escapar(producto.unidad.toLowerCase())}</p>
        <strong class="detail-price">${dinero(producto.precioVenta)}</strong>
        <div class="detail-stock"><span></span>${producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Producto sin stock'}</div>
        <dl class="product-specs">
          <div><dt>Subcategoría</dt><dd>${escapar(producto.subcategoria)}</dd></div>
          <div><dt>Unidad de venta</dt><dd>${escapar(producto.unidad)}</dd></div>
          <div><dt>Retiro</dt><dd>Disponible en tienda</dd></div>
        </dl>
        <div class="detail-actions">
          <button class="button button-primary button-large" type="button" id="detail-add" ${producto.stock > 0 ? '' : 'disabled'}>Agregar al carrito</button>
          <a class="button button-secondary button-large" href="contacto.html">Consultar producto</a>
        </div>
      </div>`;

    buscar('#detail-add')?.addEventListener('click', () => {
      const existente = estado.carrito.find((item) => item.codigo === producto.codigo);
      if (existente) existente.cantidad = Math.min(existente.cantidad + 1, producto.stock);
      else estado.carrito.push({ ...producto, cantidad: 1 });
      sincronizar();
      sistema.app.actualizarCabecera();
      buscar('#detail-add').textContent = 'Agregado al carrito ✓';
    });
  });
})();
