// =============================================================
// 1. DATOS DE DEMOSTRACIÓN Y ESTADO GENERAL DE LA APLICACIÓN
// =============================================================

// Estos perfiles permiten probar el inicio de sesión sin un backend.
const demoUsers = {
  admin: {
    name: 'Administrador',
    email: 'admin@losmaestros.cl',
    role: 'Administrador',
  },
  vendedor: {
    name: 'Vendedor',
    email: 'vendedor@losmaestros.cl',
    role: 'Vendedor',
  },
  cliente: {
    name: 'Contratista demo',
    email: 'contratista@demo.cl',
    role: 'Contratista',
  },
};

// Recupera un dato de localStorage y usa un valor alternativo si no existe.
function loadLocalData(key, fallbackValue) {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.warn(`No fue posible leer la clave local: ${key}`, error);
    return fallbackValue;
  }
}

// El estado reúne la información que puede cambiar mientras se usa la página.
const state = {
  products: [],
  cart: loadLocalData('ep1-cart', []),
  orders: loadLocalData('ep1-orders', []),
  user: loadLocalData('ep1-user', null),
};

// =============================================================
// 2. FUNCIONES AUXILIARES
// =============================================================

// Atajo para seleccionar el primer elemento que coincida con un selector CSS.
const $ = (selector) => document.querySelector(selector);

// Convierte un número al formato de moneda chilena, por ejemplo: $5.990.
const formatMoney = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);

// Guarda carrito, pedidos y usuario en el navegador.
function saveState() {
  localStorage.setItem('ep1-cart', JSON.stringify(state.cart));
  localStorage.setItem('ep1-orders', JSON.stringify(state.orders));
  localStorage.setItem('ep1-user', JSON.stringify(state.user));

  const totalUnits = state.cart.reduce(
    (sum, item) => sum + item.cantidad,
    0,
  );

  $('#cart-count').textContent = totalUnits;
}

// =============================================================
// 3. NAVEGACIÓN ENTRE VISTAS
// =============================================================

// Muestra la sección solicitada y oculta las demás secciones principales.
function showView(viewName) {
  // Si ya existe una sesión, el enlace Ingresar lleva directamente a Mi cuenta.
  if (viewName === 'acceso' && state.user) {
    showView('cuenta');
    return;
  }

  document.querySelectorAll('.view').forEach((view) => {
    view.hidden = view.id !== `view-${viewName}`;
  });

  document.querySelectorAll('[data-home-only]').forEach((section) => {
    section.hidden = viewName !== 'inicio';
  });

  // Cierra el menú móvil después de seleccionar una opción.
  $('.main-nav')?.classList.remove('is-open');
  $('.menu-button')?.setAttribute('aria-expanded', 'false');

  // Actualiza el contenido dinámico antes de mostrar determinadas vistas.
  if (viewName === 'catalogo') {
    renderCatalog();
  }

  if (viewName === 'carrito') {
    renderCart();
  }

  if (viewName === 'cuenta') {
    renderAccount();
  }

  // Lleva el foco al contenido principal para facilitar la navegación por teclado.
  $('#app').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================================
// 4. CATÁLOGO Y DETALLE DE PRODUCTOS
// =============================================================

// Crea el HTML de una tarjeta del catálogo.
function createProductCard(product) {
  const stockText =
    product.stock > 0
      ? `Stock disponible: ${product.stock}`
      : 'Sin stock disponible';

  const disabledAttribute = product.stock < 1 ? 'disabled' : '';

  return `
    <article class="product-card">
      <span class="category">${product.categoria}</span>
      <h2>${product.nombre}</h2>
      <p>${product.marca} · ${product.unidad}</p>
      <strong class="price">${formatMoney(product.precioVenta)}</strong>
      <p class="stock">${stockText}</p>
      <div class="button-row">
        <button class="small-button" type="button" data-detail="${product.codigo}">
          Ver detalle
        </button>
        <button
          class="small-button"
          type="button"
          data-add="${product.codigo}"
          ${disabledAttribute}
        >
          Agregar
        </button>
      </div>
    </article>
  `;
}

// Filtra los productos y dibuja las tarjetas que cumplen las condiciones.
function renderCatalog() {
  const searchTerm = $('#search').value.trim().toLowerCase();
  const selectedCategory = $('#category').value;
  const onlyWithStock = $('#stock-only').checked;

  const filteredProducts = state.products.filter((product) => {
    const searchableText =
      `${product.codigo} ${product.nombre} ${product.marca}`.toLowerCase();

    const matchesText =
      searchTerm === '' || searchableText.includes(searchTerm);
    const matchesCategory =
      selectedCategory === 'Todas' ||
      product.categoria === selectedCategory;
    const matchesStock = !onlyWithStock || product.stock > 0;

    return matchesText && matchesCategory && matchesStock;
  });

  $('#catalog-status').textContent =
    `${filteredProducts.length} productos · datos locales de demostración`;

  if (filteredProducts.length === 0) {
    $('#product-grid').innerHTML = `
      <div class="empty">
        <h2>Sin resultados</h2>
        <p>Prueba otra búsqueda o categoría.</p>
      </div>
    `;
    return;
  }

  $('#product-grid').innerHTML = filteredProducts
    .map(createProductCard)
    .join('');
}

// Busca un producto por código y muestra su información completa.
function renderProductDetail(productCode) {
  const product = state.products.find(
    (item) => item.codigo === productCode,
  );

  if (!product) {
    return;
  }

  const availabilityText =
    product.stock > 0
      ? `Hay ${product.stock} unidades disponibles.`
      : 'Este producto está temporalmente sin stock.';

  const disabledAttribute = product.stock < 1 ? 'disabled' : '';

  $('#product-detail').innerHTML = `
    <span class="category">
      ${product.categoria} · ${product.subcategoria}
    </span>
    <h1>${product.nombre}</h1>
    <p>${product.marca} · Venta por ${product.unidad.toLowerCase()}</p>
    <strong class="detail-price">${formatMoney(product.precioVenta)}</strong>
    <p>${availabilityText}</p>
    <button
      class="button button-primary"
      type="button"
      data-add="${product.codigo}"
      ${disabledAttribute}
    >
      Agregar al carrito
    </button>
  `;

  showView('detalle');
}

// =============================================================
// 5. CARRITO Y PEDIDOS
// =============================================================

// Agrega una unidad al carrito sin superar el stock disponible.
function addToCart(productCode) {
  const product = state.products.find(
    (item) => item.codigo === productCode,
  );

  if (!product || product.stock < 1) {
    return;
  }

  const cartItem = state.cart.find(
    (item) => item.codigo === productCode,
  );

  if (cartItem) {
    cartItem.cantidad = Math.min(cartItem.cantidad + 1, product.stock);
  } else {
    state.cart.push({ ...product, cantidad: 1 });
  }

  saveState();
}

// Dibuja el carrito vacío o el listado de productos y su resumen.
function renderCart() {
  if (state.cart.length === 0) {
    $('#cart-content').innerHTML = `
      <div class="empty">
        <h2>El carrito está vacío</h2>
        <p>Agrega productos disponibles y vuelve para confirmar.</p>
        <button class="button button-primary" type="button" data-view="catalogo">
          Ir al catálogo
        </button>
      </div>
    `;
    return;
  }

  const total = state.cart.reduce(
    (sum, item) => sum + item.precioVenta * item.cantidad,
    0,
  );

  const cartItemsHtml = state.cart
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <span>${item.codigo}</span>
            <h2>${item.nombre}</h2>
            <p>${formatMoney(item.precioVenta)} por ${item.unidad.toLowerCase()}</p>
          </div>
          <div>
            <input
              class="quantity-input"
              aria-label="Cantidad de ${item.nombre}"
              type="number"
              min="0"
              max="${item.stock}"
              value="${item.cantidad}"
              data-quantity="${item.codigo}"
            />
            <strong>${formatMoney(item.precioVenta * item.cantidad)}</strong>
          </div>
        </article>
      `,
    )
    .join('');

  $('#cart-content').innerHTML = `
    <div class="cart-layout">
      <div>${cartItemsHtml}</div>

      <form id="order-form" class="summary-card">
        <h2>Resumen</h2>
        <div class="summary-total">
          <span>Total</span>
          <strong>${formatMoney(total)}</strong>
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

// Actualiza o elimina un producto cuando cambia su cantidad en el carrito.
function updateCartQuantity(quantityInput) {
  const productCode = quantityInput.dataset.quantity;

  if (!productCode) {
    return;
  }

  const cartItem = state.cart.find(
    (item) => item.codigo === productCode,
  );

  if (cartItem) {
    const newQuantity = Number(quantityInput.value);
    cartItem.cantidad = Math.max(0, Math.min(newQuantity, cartItem.stock));
  }

  // Una cantidad igual a cero significa quitar el producto.
  state.cart = state.cart.filter((item) => item.cantidad > 0);
  saveState();
  renderCart();
}

// Guarda un pedido simulado y vacía el carrito.
function confirmOrder(orderForm) {
  const total = state.cart.reduce(
    (sum, item) => sum + item.precioVenta * item.cantidad,
    0,
  );
  const delivery = new FormData(orderForm).get('delivery');
  const nextOrderNumber = String(state.orders.length + 1).padStart(4, '0');

  state.orders.unshift({
    id: `PED-${nextOrderNumber}`,
    total,
    delivery,
  });
  state.cart = [];
  saveState();

  $('#cart-content').innerHTML = `
    <div class="empty">
      <h2>Pedido recibido</h2>
      <p>Tu solicitud quedó guardada localmente.</p>
      <p>Tipo de entrega: <strong>${delivery}</strong>.</p>
      <button class="button button-primary" type="button" data-view="cuenta">
        Ver mi cuenta
      </button>
    </div>
  `;
}

// =============================================================
// 6. ACCESO, REGISTRO Y CUENTA
// =============================================================

// Dibuja los datos del usuario y el historial local de pedidos.
function renderAccount() {
  if (!state.user) {
    $('#account-content').innerHTML = `
      <div class="empty">
        <h2>Inicia sesión para continuar</h2>
        <p>El historial y la cuenta son privados para cada cliente.</p>
        <button class="button button-primary" type="button" data-view="acceso">
          Ingresar
        </button>
      </div>
    `;
    return;
  }

  const ordersHtml = state.orders.length
    ? state.orders
        .map(
          (order) =>
            `${order.id} · ${formatMoney(order.total)} · ${order.delivery}`,
        )
        .join('<br />')
    : 'Todavía no tienes pedidos confirmados.';

  $('#account-content').innerHTML = `
    <article class="account-card">
      <p class="eyebrow">Sesión activa</p>
      <h2>${state.user.name}</h2>
      <p>
        ${state.user.email}<br />
        Rol: ${state.user.role}
      </p>
      <button class="button button-secondary" type="button" data-logout>
        Cerrar sesión
      </button>
    </article>

    <article class="account-card">
      <p class="eyebrow">Historial local</p>
      <h2>${state.orders.length} pedidos</h2>
      <p>${ordersHtml}</p>
    </article>
  `;
}

// Completa el formulario con uno de los usuarios de demostración.
function fillLoginForm(userKey) {
  const user = demoUsers[userKey];

  $('#login-email').value = user.email;
  $('#login-password').value = 'demo123';

  document.querySelectorAll('[data-demo]').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.demo === userKey);
  });
}

// Valida los datos de un perfil de demostración e inicia la sesión.
function login(loginForm) {
  const email = $('#login-email').value.trim();
  const password = $('#login-password').value;
  const user = Object.values(demoUsers).find(
    (item) => item.email === email && password === 'demo123',
  );

  if (!user) {
    $('#login-error').hidden = false;
    $('#login-error').textContent =
      'Correo o contraseña incorrectos para la demostración.';
    return;
  }

  $('#login-error').hidden = true;
  state.user = user;
  saveState();
  loginForm.reset();
  showView('cuenta');
}

// Simula el registro y deja iniciada la sesión del cliente nuevo.
function register(registerForm) {
  const message = $('#register-message');

  if (!registerForm.checkValidity()) {
    message.hidden = false;
    message.classList.add('is-error');
    message.textContent =
      'Completa los campos requeridos (contraseña mínima de 6 caracteres).';
    return;
  }

  state.user = {
    name: $('#register-name').value.trim(),
    email: $('#register-email').value.trim(),
    role: 'Cliente',
  };

  message.hidden = true;
  message.classList.remove('is-error');
  saveState();
  registerForm.reset();
  showView('cuenta');
}

// =============================================================
// 7. MANEJO DE EVENTOS
// =============================================================

// Un solo evento administra botones generados en el HTML y por JavaScript.
document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  const detailButton = event.target.closest('[data-detail]');
  const addButton = event.target.closest('[data-add]');
  const logoutButton = event.target.closest('[data-logout]');
  const demoButton = event.target.closest('[data-demo]');
  const menuButton = event.target.closest('.menu-button');

  if (viewButton) {
    event.preventDefault();
    showView(viewButton.dataset.view);
  }

  if (detailButton) {
    renderProductDetail(detailButton.dataset.detail);
  }

  if (addButton) {
    addToCart(addButton.dataset.add);
  }

  if (logoutButton) {
    state.user = null;
    saveState();
    showView('inicio');
  }

  if (demoButton) {
    fillLoginForm(demoButton.dataset.demo);
  }

  if (menuButton) {
    const navigation = $('.main-nav');
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  }
});

// Al escribir o cambiar un filtro, el catálogo se actualiza de inmediato.
$('#filter-form').addEventListener('input', renderCatalog);
$('#filter-form').addEventListener('change', renderCatalog);

// Escucha los cambios de las cantidades creadas dinámicamente en el carrito.
document.addEventListener('change', (event) => {
  if (event.target.matches('[data-quantity]')) {
    updateCartQuantity(event.target);
  }
});

// Identifica qué formulario fue enviado y ejecuta la función correspondiente.
document.addEventListener('submit', (event) => {
  event.preventDefault();

  if (event.target.id === 'login-form') {
    login(event.target);
  }

  if (event.target.id === 'register-form') {
    register(event.target);
  }

  if (event.target.id === 'order-form') {
    confirmOrder(event.target);
  }
});

// =============================================================
// 8. CARGA INICIAL DEL CATÁLOGO
// =============================================================

// Lee el archivo JSON local, prepara las categorías y actualiza el resumen.
fetch('data/productos.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('El archivo de productos no respondió correctamente.');
    }

    return response.json();
  })
  .then((products) => {
    state.products = products;

    const categories = [
      ...new Set(products.map((product) => product.categoria)),
    ].sort();

    const categoryOptions = categories
      .map((category) => `<option>${category}</option>`)
      .join('');

    $('#category').insertAdjacentHTML('beforeend', categoryOptions);
    $('#hero-total').textContent = products.length;
    $('#hero-categories').textContent = categories.length;
    $('#hero-stock').textContent = products.filter(
      (product) => product.stock > 0,
    ).length;

    renderCatalog();
  })
  .catch((error) => {
    console.error(error);
    $('#catalog-status').textContent =
      'No fue posible cargar el catálogo local.';
  });

// Actualiza el contador del carrito apenas se abre la página.
saveState();
