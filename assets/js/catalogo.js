// Este archivo controla productos, filtros, detalle, carrito y pedidos.


// Funciones compartidas desde app.js.
const catalogoSistema = window.ferreteria;
const catalogoEstado = catalogoSistema.estadoAplicacion;
const catalogoBuscar = catalogoSistema.buscarElemento;
const catalogoDinero = catalogoSistema.formatearDinero;
const catalogoGuardar = catalogoSistema.guardarEstado;


// Cada categoría utiliza una imagen local de assets/img.
const imagenesPorCategoria = {
  'Mat. Construcción': 'construccion.svg',
  Pinturas: 'pinturas.svg',
  Herramientas: 'herramientas.svg',
  Gasfitería: 'gasfiteria.svg',
  Electricidad: 'electricidad.svg',
  Madera: 'madera.svg',
  Jardín: 'jardin.svg',
  Seguridad: 'seguridad.svg',
  Tornillería: 'tornilleria.svg'
};


// Devuelve la imagen que corresponde al producto.
function obtenerImagenProducto(producto) {
  const archivo = imagenesPorCategoria[producto.categoria]
    || 'herramientas.svg';

  return `assets/img/${archivo}`;
}


// Arma una tarjeta HTML para cada producto.
function crearTarjetaProducto(producto) {
  return `
    <article class="product-card">
      <figure class="product-image-frame">
        <img
          class="product-image"
          src="${obtenerImagenProducto(producto)}"
          alt="Imagen referencial de ${producto.nombre}"
          loading="lazy"
        />
      </figure>

      <span class="category">${producto.categoria}</span>

      <h2>${producto.nombre}</h2>

      <p>${producto.marca} · ${producto.unidad}</p>

      <strong class="price">
        ${catalogoDinero(producto.precioVenta)}
      </strong>

      <p class="stock">
        ${producto.stock > 0
    ? `Stock disponible: ${producto.stock}`
    : 'Sin stock disponible'
  }
      </p>

      <div class="button-row">
        <button
          class="small-button"
          type="button"
          data-detail="${producto.codigo}"
        >
          Ver detalle
        </button>

        <button
          class="small-button"
          type="button"
          data-add="${producto.codigo}"
          ${producto.stock < 1 ? 'disabled' : ''}
        >
          Agregar
        </button>
      </div>
    </article>
  `;
}


// Aplica la búsqueda y los filtros del catálogo.
function mostrarCatalogo() {
  const buscador = catalogoBuscar('#search');
  const selectorCategoria = catalogoBuscar('#category');
  const soloStock = catalogoBuscar('#stock-only');
  const grillaProductos = catalogoBuscar('#product-grid');
  const estadoCatalogo = catalogoBuscar('#catalog-status');

  // Evita errores cuando este archivo se carga en el inicio.
  if (!buscador || !selectorCategoria || !soloStock || !grillaProductos) {
    return;
  }

  const textoBuscado = buscador.value
    .trim()
    .toLowerCase();

  const categoriaElegida = selectorCategoria.value;
  const mostrarSoloStock = soloStock.checked;

  // Filtra los productos según los controles seleccionados.
  const productosFiltrados = catalogoEstado.products.filter((producto) => {
    const informacionProducto = `
      ${producto.codigo}
      ${producto.nombre}
      ${producto.marca}
    `.toLowerCase();

    const coincideTexto =
      !textoBuscado || informacionProducto.includes(textoBuscado);

    const coincideCategoria =
      categoriaElegida === 'Todas' ||
      producto.categoria === categoriaElegida;

    const coincideStock =
      !mostrarSoloStock || producto.stock > 0;

    return coincideTexto && coincideCategoria && coincideStock;
  });

  // Muestra la cantidad de resultados.
  if (estadoCatalogo) {
    estadoCatalogo.textContent =
      `${productosFiltrados.length} productos · datos locales de demostración`;
  }

  // Muestra tarjetas o un mensaje sin resultados.
  grillaProductos.innerHTML = productosFiltrados.length
    ? productosFiltrados.map(crearTarjetaProducto).join('')
    : `
      <div class="empty">
        <h2>Sin resultados</h2>
        <p>Prueba otra búsqueda o categoría.</p>
      </div>
    `;
}


// Muestra la información completa del producto elegido.
function mostrarDetalle(codigo) {
  const producto = catalogoEstado.products.find(
    (elemento) => elemento.codigo === codigo
  );

  const detalleProducto = catalogoBuscar('#product-detail');

  // Desde el catálogo abre el HTML independiente del producto.
  if (producto && !detalleProducto) {
    window.location.href = `producto.html?codigo=${encodeURIComponent(codigo)}`;
    return;
  }

  if (!detalleProducto) {
    return;
  }

  if (!producto) {
    detalleProducto.innerHTML = `
      <div class="empty">
        <h1>Producto no encontrado</h1>
        <p>El código solicitado no existe en el catálogo.</p>
        <a class="button button-primary" href="productos.html">
          Volver al catálogo
        </a>
      </div>
    `;
    return;
  }

  catalogoEstado.selected = producto;

  detalleProducto.innerHTML = `
    <figure class="product-image-frame detail-image-frame">
      <img
        class="product-image"
        src="${obtenerImagenProducto(producto)}"
        alt="Imagen referencial de ${producto.nombre}"
      />
    </figure>

    <span class="category">
      ${producto.categoria} · ${producto.subcategoria}
    </span>

    <h1>${producto.nombre}</h1>

    <p>
      ${producto.marca} · Venta por ${producto.unidad.toLowerCase()}
    </p>

    <strong class="detail-price">
      ${catalogoDinero(producto.precioVenta)}
    </strong>

    <p>
      ${producto.stock > 0
    ? `Hay ${producto.stock} unidades disponibles.`
    : 'Este producto está temporalmente sin stock.'
  }
    </p>

    <button
      class="button button-primary"
      type="button"
      data-add="${producto.codigo}"
      ${producto.stock < 1 ? 'disabled' : ''}
    >
      Agregar al carrito
    </button>
  `;

}


// Agrega una unidad al carrito sin superar el stock.
function agregarAlCarrito(codigo) {
  const producto = catalogoEstado.products.find(
    (elemento) => elemento.codigo === codigo
  );

  // No agrega productos agotados.
  if (!producto || producto.stock < 1) {
    return;
  }

  const productoActual = catalogoEstado.cart.find(
    (elemento) => elemento.codigo === codigo
  );

  if (productoActual) {
    // Limita la cantidad al stock disponible.
    productoActual.cantidad = Math.min(
      productoActual.cantidad + 1,
      producto.stock
    );
  } else {
    // Un producto nuevo comienza con una unidad.
    catalogoEstado.cart.push({
      ...producto,
      cantidad: 1
    });
  }

  catalogoGuardar();

  // Actualiza el carrito si está visible.
  if (!catalogoBuscar('#view-carrito')?.hidden) {
    mostrarCarrito();
  }
}


// Construye el carrito y calcula su total.
function mostrarCarrito() {
  const contenidoCarrito = catalogoBuscar('#cart-content');

  if (!contenidoCarrito) {
    return;
  }

  // Muestra una ayuda cuando el carrito está vacío.
  if (!catalogoEstado.cart.length) {
    contenidoCarrito.innerHTML = `
      <div class="empty">
        <h2>El carrito está vacío</h2>

        <p>
          Agrega productos disponibles y vuelve para confirmar.
        </p>

        <button
          class="button button-primary"
          type="button"
          data-view="catalogo"
        >
          Ir al catálogo
        </button>
      </div>
    `;

    return;
  }

  // Suma precio por cantidad.
  const totalCarrito = catalogoEstado.cart.reduce(
    (total, producto) =>
      total + producto.precioVenta * producto.cantidad,
    0
  );

  const filasCarrito = catalogoEstado.cart.map((producto) => `
    <article class="cart-item">
      <div>
        <span>${producto.codigo}</span>
        <h2>${producto.nombre}</h2>

        <p>
          ${catalogoDinero(producto.precioVenta)}
          por ${producto.unidad.toLowerCase()}
        </p>
      </div>

      <div class="cart-item-actions">
        <input
          class="quantity-input"
          aria-label="Cantidad de ${producto.nombre}"
          type="number"
          min="0"
          max="${producto.stock}"
          value="${producto.cantidad}"
          data-quantity="${producto.codigo}"
        />

        <strong>
          ${catalogoDinero(producto.precioVenta * producto.cantidad)}
        </strong>
      </div>
    </article>
  `).join('');

  contenidoCarrito.innerHTML = `
    <div class="cart-layout">
      <div>${filasCarrito}</div>

      <form id="order-form" class="summary-card">
        <h2>Resumen</h2>

        <div class="summary-total">
          <span>Total</span>
          <strong>${catalogoDinero(totalCarrito)}</strong>
        </div>

        <fieldset>
          <legend>Tipo de entrega</legend>

          <label>
            <input
              type="radio"
              name="delivery"
              value="Retiro en tienda"
              checked
            />
            Retiro en tienda
          </label>

          <label>
            <input
              type="radio"
              name="delivery"
              value="Despacho a obra"
            />
            Despacho a obra
          </label>
        </fieldset>

        <button class="button button-primary full" type="submit">
          Confirmar pedido
        </button>
      </form>
    </div>
  `;
}


// Controla los botones de detalle y agregar.
document.addEventListener('click', (evento) => {
  const codigoDetalle = evento.target
    .closest('[data-detail]')
    ?.dataset.detail;

  if (codigoDetalle) {
    mostrarDetalle(codigoDetalle);
  }

  const codigoAgregar = evento.target
    .closest('[data-add]')
    ?.dataset.add;

  if (codigoAgregar) {
    agregarAlCarrito(codigoAgregar);
  }
});


// Actualiza el catálogo al cambiar los filtros.
const formularioFiltros = catalogoBuscar('#filter-form');

formularioFiltros?.addEventListener('input', mostrarCatalogo);
formularioFiltros?.addEventListener('change', mostrarCatalogo);


// Cambia cantidades dentro del carrito.
document.addEventListener('change', (evento) => {
  const codigoProducto = evento.target.dataset.quantity;

  if (!codigoProducto) {
    return;
  }

  const producto = catalogoEstado.cart.find(
    (elemento) => elemento.codigo === codigoProducto
  );

  if (producto) {
    // Limita la cantidad entre cero y el stock.
    producto.cantidad = Math.max(
      0,
      Math.min(
        Number(evento.target.value),
        producto.stock
      )
    );
  }

  // Cero elimina el producto del carrito.
  catalogoEstado.cart = catalogoEstado.cart.filter(
    (elemento) => elemento.cantidad > 0
  );

  catalogoGuardar();
  mostrarCarrito();
});


// Este formulario confirma un pedido simulado.
document.addEventListener('submit', (evento) => {
  if (evento.target.id !== 'order-form') {
    return;
  }

  evento.preventDefault();

  const totalPedido = catalogoEstado.cart.reduce(
    (total, producto) =>
      total + producto.precioVenta * producto.cantidad,
    0
  );

  const tipoEntrega = new FormData(evento.target)
    .get('delivery');

  // Guarda los datos necesarios para los paneles de usuario.
  catalogoEstado.orders.unshift({
    id: `PED-${String(catalogoEstado.orders.length + 1).padStart(4, '0')}`,
    total: totalPedido,
    delivery: tipoEntrega,
    customer: catalogoEstado.user?.name || 'Cliente sin sesión',
    customerEmail: catalogoEstado.user?.email || '',
    date: new Date().toLocaleDateString('es-CL')
  });

  // Guarda el pedido y vacía el carrito.
  catalogoEstado.cart = [];
  catalogoGuardar();

  catalogoBuscar('#cart-content').innerHTML = `
    <div class="empty">
      <h2>Pedido recibido</h2>

      <p>
        Tu solicitud quedó guardada localmente con entrega:
        ${tipoEntrega}.
      </p>

      <button
        class="button button-primary"
        type="button"
        data-view="cuenta"
      >
        Ver mi cuenta
      </button>
    </div>
  `;
});


// Comparte las funciones que necesita app.js.
window.funcionesCatalogo = {
  mostrarCatalogo,
  mostrarDetalle,
  agregarAlCarrito,
  mostrarCarrito
};


// Lee los 85 productos desde el JSON.
fetch('data/productos.json')
  .then((respuesta) => {
    if (!respuesta.ok) {
      throw new Error('No fue posible leer productos.json');
    }

    return respuesta.json();
  })
  .then((productos) => {
    catalogoEstado.products = productos;

    // Obtiene las categorías sin repetirlas.
    const categorias = [
      ...new Set(
        productos.map((producto) => producto.categoria)
      )
    ].sort();

    const selectorCategoria = catalogoBuscar('#category');

    if (selectorCategoria) {
      selectorCategoria.innerHTML = '<option>Todas</option>';

      selectorCategoria.insertAdjacentHTML(
        'beforeend',
        categorias
          .map((categoria) => `<option>${categoria}</option>`)
          .join('')
      );
    }

    // Completa las estadísticas del inicio.
    const totalProductos = catalogoBuscar('#hero-total');
    const totalCategorias = catalogoBuscar('#hero-categorias');
    const productosConStock = catalogoBuscar('#hero-stock');

    if (totalProductos) {
      totalProductos.textContent = productos.length;
    }

    if (totalCategorias) {
      totalCategorias.textContent = categorias.length;
    }

    if (productosConStock) {
      productosConStock.textContent = productos.filter(
        (producto) => producto.stock > 0
      ).length;
    }

    // Completa solamente el contenido que pertenece al HTML abierto.
    if (catalogoBuscar('#view-catalogo')) {
      mostrarCatalogo();
    }

    if (catalogoBuscar('#view-carrito')) {
      mostrarCarrito();
    }

    if (catalogoBuscar('#view-detalle')) {
      const codigoProducto = new URLSearchParams(window.location.search)
        .get('codigo');

      mostrarDetalle(codigoProducto);
    }

    if (catalogoBuscar('#view-cuenta')) {
      catalogoSistema.mostrarCuenta();
    }

    catalogoGuardar();
  })
  .catch(() => {
    const estadoCatalogo = catalogoBuscar('#catalog-status');

    if (estadoCatalogo) {
      estadoCatalogo.textContent =
        'No fue posible cargar el catálogo local.';
    }
  });
