// Carga productos, aplica filtros y arma las tarjetas del catálogo.
(function iniciarCatalogo() {
  const sistema = window.Ferreteria;
  const { estado, cargarProductos, sincronizar } = sistema.almacenamiento;
  const { buscar, dinero, escapar, ruta, imagenProducto } = sistema.utilidades;
  const grilla = buscar('#product-grid');

  if (!grilla && !buscar('#hero-total')) {
    return;
  }

  function tarjeta(producto) {
    const disponible = Number(producto.stock) > 0;
    return `
      <article class="product-card pro-product-card">
        <a class="product-media" href="producto-detalle.html?codigo=${encodeURIComponent(producto.codigo)}">
          <img src="${imagenProducto(producto)}" alt="${escapar(producto.nombre)}" loading="lazy" />
          <span class="stock-pill ${disponible ? 'is-available' : 'is-empty'}">
            ${disponible ? `${producto.stock} disponibles` : 'Sin stock'}
          </span>
        </a>
        <div class="product-card__body">
          <p class="product-code">${escapar(producto.codigo)} · ${escapar(producto.marca)}</p>
          <h2><a href="producto-detalle.html?codigo=${encodeURIComponent(producto.codigo)}">${escapar(producto.nombre)}</a></h2>
          <p class="product-unit">Venta por ${escapar(producto.unidad.toLowerCase())}</p>
          <div class="product-card__footer">
            <strong>${dinero(producto.precioVenta)}</strong>
            <button type="button" data-add-product="${escapar(producto.codigo)}" ${disponible ? '' : 'disabled'}>
              Agregar
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function aplicarFiltros() {
    if (!grilla) return;
    const texto = (buscar('#search')?.value || '').trim().toLowerCase();
    const categoria = buscar('#category')?.value || 'Todas';
    const soloStock = Boolean(buscar('#stock-only')?.checked);

    const filtrados = estado.productos.filter((producto) => {
      const contenido = `${producto.codigo} ${producto.nombre} ${producto.marca}`.toLowerCase();
      return (!texto || contenido.includes(texto))
        && (categoria === 'Todas' || producto.categoria === categoria)
        && (!soloStock || Number(producto.stock) > 0);
    });

    buscar('#catalog-status').textContent = `${filtrados.length} productos encontrados`;
    grilla.innerHTML = filtrados.length
      ? filtrados.map(tarjeta).join('')
      : '<div class="empty"><h2>No encontramos resultados</h2><p>Prueba con otra palabra o categoría.</p></div>';
  }

  function agregar(codigo) {
    const producto = estado.productos.find((item) => item.codigo === codigo);
    if (!producto || Number(producto.stock) < 1) return;

    const existente = estado.carrito.find((item) => item.codigo === codigo);
    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + 1, Number(producto.stock));
    } else {
      estado.carrito.push({ ...producto, cantidad: 1 });
    }

    sincronizar();
    sistema.app.actualizarCabecera();

    const aviso = buscar('#catalog-toast');
    if (aviso) {
      aviso.textContent = `${producto.nombre} fue agregado al carrito.`;
      aviso.hidden = false;
      window.setTimeout(() => { aviso.hidden = true; }, 2200);
    }
  }

  cargarProductos(document.body.dataset.products || ruta('data/catalogo/productos.json'))
    .then((productos) => {
      const categorias = [...new Set(productos.map((producto) => producto.categoria))].sort();
      const selector = buscar('#category');

      if (selector) {
        selector.innerHTML = '<option value="Todas">Todas las categorías</option>'
          + categorias.map((categoria) => `<option value="${escapar(categoria)}">${escapar(categoria)}</option>`).join('');
        const solicitada = new URLSearchParams(window.location.search).get('categoria');
        if (solicitada && categorias.includes(solicitada)) selector.value = solicitada;
      }

      const total = buscar('#hero-total');
      const categoriasTotal = buscar('#hero-categorias');
      const conStock = buscar('#hero-stock');
      if (total) total.textContent = productos.length;
      if (categoriasTotal) categoriasTotal.textContent = categorias.length;
      if (conStock) conStock.textContent = productos.filter((producto) => producto.stock > 0).length;

      aplicarFiltros();
    })
    .catch(() => {
      if (buscar('#catalog-status')) buscar('#catalog-status').textContent = 'No fue posible cargar el catálogo.';
    });

  buscar('#filter-form')?.addEventListener('input', aplicarFiltros);
  buscar('#filter-form')?.addEventListener('change', aplicarFiltros);
  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-add-product]');
    if (boton) agregar(boton.dataset.addProduct);
  });
})();
