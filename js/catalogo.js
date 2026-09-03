// En este archivo dejamos todo lo relacionado con productos y carrito.
// Lo separamos de app.js para encontrar cada parte mas rapido.


// Recuperamos las herramientas generales que preparamos en app.js.
const catalogoSistema = window.ferreteria;
const catalogoEstado = catalogoSistema.estadoAplicacion;
const catalogoBuscar = catalogoSistema.buscarElemento;
const catalogoDinero = catalogoSistema.formatearDinero;
const catalogoGuardar = catalogoSistema.guardarEstado;
const catalogoMostrarVista = catalogoSistema.mostrarVista;


// Esta funcion arma una tarjeta HTML para cada producto del catalogo.
function crearTarjetaProducto(producto) {
  return `
    <article class="product-card">
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


// Aca aplicamos la busqueda, la categoria y el filtro de stock.
// Despues dibujamos solamente los productos que cumplen esas condiciones.
function mostrarCatalogo() {
  const buscador = catalogoBuscar('#search');
  const selectorCategoria = catalogoBuscar('#category');
  const soloStock = catalogoBuscar('#stock-only');
  const grillaProductos = catalogoBuscar('#product-grid');
  const estadoCatalogo = catalogoBuscar('#catalog-status');

  // En la pagina de inicio no existen los filtros, por eso salimos sin error.
  if (!buscador || !selectorCategoria || !soloStock || !grillaProductos) {
    return;
  }

  const textoBuscado = buscador.value
    .trim()
    .toLowerCase();

  const categoriaElegida = selectorCategoria.value;
  const mostrarSoloStock = soloStock.checked;

  // Revisamos todos los productos para saber cuales debemos enseñar.
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

  // Este mensaje ayuda a saber cuantos resultados dejaron los filtros.
  if (estadoCatalogo) {
    estadoCatalogo.textContent =
      `${productosFiltrados.length} productos · datos locales de demostración`;
  }

  // Cuando no coincide ningun producto dejamos un mensaje en vez de la grilla vacia.
  grillaProductos.innerHTML = productosFiltrados.length
    ? productosFiltrados.map(crearTarjetaProducto).join('')
    : `
      <div class="empty">
        <h2>Sin resultados</h2>
        <p>Prueba otra búsqueda o categoría.</p>
      </div>
    `;
}


// Cuando apretamos Ver detalle buscamos el codigo y mostramos su informacion.
function mostrarDetalle(codigo) {
  const producto = catalogoEstado.products.find(
    (elemento) => elemento.codigo === codigo
  );

  const detalleProducto = catalogoBuscar('#product-detail');

  if (!producto || !detalleProducto) {
    return;
  }

  catalogoEstado.selected = producto;

  detalleProducto.innerHTML = `
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

  catalogoMostrarVista('detalle');
}


// Esta funcion agrega una unidad al carrito sin superar el stock disponible.
function agregarAlCarrito(codigo) {
  const producto = catalogoEstado.products.find(
    (elemento) => elemento.codigo === codigo
  );

  // Si el producto no existe o no tiene stock no cambiamos nada.
  if (!producto || producto.stock < 1) {
    return;
  }

  const productoActual = catalogoEstado.cart.find(
    (elemento) => elemento.codigo === codigo
  );

  if (productoActual) {
    // Math.min evita que la cantidad pueda superar el stock real.
    productoActual.cantidad = Math.min(
      productoActual.cantidad + 1,
      producto.stock
    );
  } else {
    // Si todavia no estaba guardado lo agregamos comenzando en una unidad.
    catalogoEstado.cart.push({
      ...producto,
      cantidad: 1
    });
  }

  catalogoGuardar();

  // Si estamos mirando el carrito lo redibujamos para ver el cambio altiro.
  if (!catalogoBuscar('#view-carrito')?.hidden) {
    mostrarCarrito();
  }
}


// Esta funcion construye el carrito, sus cantidades y el total del pedido.
function mostrarCarrito() {
  const contenidoCarrito = catalogoBuscar('#cart-content');

  if (!contenidoCarrito) {
    return;
  }

  // Si no guardamos productos mostramos una ayuda para volver al catalogo.
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

  // Sumamos precio por cantidad para calcular el total del pedido.
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


// Los botones de las tarjetas se reconocen por sus atributos data.
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


// Cada vez que escribimos o cambiamos un filtro actualizamos los productos.
const formularioFiltros = catalogoBuscar('#filter-form');

formularioFiltros?.addEventListener('input', mostrarCatalogo);
formularioFiltros?.addEventListener('change', mostrarCatalogo);


// Este evento detecta los cambios de cantidad dentro del carrito.
document.addEventListener('change', (evento) => {
  const codigoProducto = evento.target.dataset.quantity;

  if (!codigoProducto) {
    return;
  }

  const producto = catalogoEstado.cart.find(
    (elemento) => elemento.codigo === codigoProducto
  );

  if (producto) {
    // Limitamos el numero entre cero y el stock que tiene ese producto.
    producto.cantidad = Math.max(
      0,
      Math.min(
        Number(evento.target.value),
        producto.stock
      )
    );
  }

  // Una cantidad igual a cero sirve para sacar el producto del carrito.
  catalogoEstado.cart = catalogoEstado.cart.filter(
    (elemento) => elemento.cantidad > 0
  );

  catalogoGuardar();
  mostrarCarrito();
});


// Como el formulario del pedido se crea con JavaScript usamos un evento general.
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

  // Creamos un numero sencillo para reconocer el pedido en Mi cuenta.
  catalogoEstado.orders.unshift({
    id: `PED-${String(catalogoEstado.orders.length + 1).padStart(4, '0')}`,
    total: totalPedido,
    delivery: tipoEntrega
  });

  // Al confirmar guardamos el pedido y dejamos el carrito vacio.
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


// Estas funciones quedan disponibles para que app.js pueda llamarlas.
window.funcionesCatalogo = {
  mostrarCatalogo,
  mostrarDetalle,
  agregarAlCarrito,
  mostrarCarrito
};


// Aqui leemos los 85 productos desde el archivo JSON del proyecto.
fetch('data/productos.json')
  .then((respuesta) => {
    if (!respuesta.ok) {
      throw new Error('No fue posible leer productos.json');
    }

    return respuesta.json();
  })
  .then((productos) => {
    catalogoEstado.products = productos;

    // Set nos ayuda a obtener las categorias sin repetir sus nombres.
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

    // En el inicio ocupamos estos datos para completar el resumen de la tienda.
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

    // Dependiendo de la direccion mostramos el catalogo o el carrito guardado.
    if (catalogoBuscar('#view-catalogo')) {
      if (window.location.hash === '#carrito') {
        mostrarCarrito();
      } else {
        mostrarCatalogo();
      }
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
