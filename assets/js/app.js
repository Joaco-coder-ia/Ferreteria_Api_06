// PR 4 en adelante: incorporamos la logica en funciones pequeñas.
// Este archivo controla el estado, la navegacion y las vistas de usuario.

const usuariosDemo = {
  admin: {
    name: 'Administrador',
    email: 'admin@losmaestros.cl',
    role: 'Administrador'
  },

  vendedor: {
    name: 'Vendedor',
    email: 'vendedor@losmaestros.cl',
    role: 'Vendedor'
  },

  cliente: {
    name: 'Contratista demo',
    email: 'contratista@demo.cl',
    role: 'Contratista'
  }
};


// Lee datos guardados sin detener la aplicacion si estan dañados.
function leerDatoGuardado(clave, valorInicial) {
  try {
    return JSON.parse(
      localStorage.getItem(clave) || JSON.stringify(valorInicial)
    );
  } catch (error) {
    return valorInicial;
  }
}


// Guarda los datos que cambian mientras usamos el sitio.
const estadoAplicacion = {
  products: [],
  cart: leerDatoGuardado('ep1-cart', []),
  orders: leerDatoGuardado('ep1-orders', []),
  messages: leerDatoGuardado('ep1-messages', []),
  user: leerDatoGuardado('ep1-user', null),
  selected: null
};


// Abreviacion para buscar elementos HTML.
const buscarElemento = (selector) =>
  document.querySelector(selector);


// Convierte un numero al formato de pesos chilenos.
const formatearDinero = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor);


// Evita que un texto escrito en un formulario se transforme en HTML.
function escaparHTML(texto = '') {
  const elemento = document.createElement('span');
  elemento.textContent = String(texto);
  return elemento.innerHTML;
}


// Conserva carrito, pedidos, consultas y usuario en el navegador.
function guardarEstado() {
  localStorage.setItem(
    'ep1-cart',
    JSON.stringify(estadoAplicacion.cart)
  );

  localStorage.setItem(
    'ep1-orders',
    JSON.stringify(estadoAplicacion.orders)
  );

  localStorage.setItem(
    'ep1-messages',
    JSON.stringify(estadoAplicacion.messages)
  );

  localStorage.setItem(
    'ep1-user',
    JSON.stringify(estadoAplicacion.user)
  );

  const contadorCarrito = buscarElemento('#cart-count');

  if (contadorCarrito) {
    contadorCarrito.textContent = estadoAplicacion.cart.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );
  }
}


// Relaciona cada vista con su archivo HTML.
const paginasDeLasVistas = {
  inicio: 'index.html',
  acceso: 'ingreso.html',
  registro: 'registro.html',
  cuenta: 'cuenta.html',
  catalogo: 'productos.html',
  detalle: 'producto.html',
  carrito: 'carrito.html',
  contacto: 'contacto.html'
};


// Marca en amarillo el enlace de la vista que esta abierta.
function actualizarEnlaceActivo(nombre) {
  const navegacion = buscarElemento('.main-nav');

  if (!navegacion) {
    return;
  }

  navegacion.querySelectorAll('a').forEach((enlace) => {
    enlace.removeAttribute('aria-current');
  });

  const selectores = {
    inicio: 'a[href="index.html"]',
    acceso: 'a[href="ingreso.html"]',
    registro: 'a[href="ingreso.html"]',
    cuenta: 'a[href="cuenta.html"]',
    catalogo: 'a[href="productos.html"]',
    detalle: 'a[href="productos.html"]',
    carrito: 'a[href="carrito.html"]',
    contacto: 'a[href="contacto.html"]'
  };

  navegacion
    .querySelector(selectores[nombre])
    ?.setAttribute('aria-current', 'page');
}


// Abre el archivo HTML que corresponde a cada sección.
function mostrarVista(nombre) {
  const vistaSeleccionada = buscarElemento(`#view-${nombre}`);
  const paginaActual = document.body.dataset.page;

  if (vistaSeleccionada && paginaActual === nombre) {
    actualizarEnlaceActivo(nombre);
    return;
  }

  const destino = paginasDeLasVistas[nombre];

  if (destino) {
    window.location.href = destino;
  }
}


// Crea una tarjeta pequeña para los datos del panel.
function crearMetrica(titulo, valor, detalle) {
  return `
    <article class="metric-card">
      <span>${titulo}</span>
      <strong>${valor}</strong>
      <small>${detalle}</small>
    </article>
  `;
}


// Crea las filas de pedidos para administrador y vendedor.
function crearFilasPedidos(pedidos) {
  if (!pedidos.length) {
    return '<tr><td colspan="5">Todavía no existen pedidos registrados.</td></tr>';
  }

  return pedidos.slice(0, 6).map((pedido) => `
    <tr>
      <td>${escaparHTML(pedido.id)}</td>
      <td>${escaparHTML(pedido.customer || 'Cliente')}</td>
      <td>${formatearDinero(pedido.total)}</td>
      <td>${escaparHTML(pedido.delivery)}</td>
      <td>${escaparHTML(pedido.date || 'Sin fecha')}</td>
    </tr>
  `).join('');
}


// Crea el panel con acceso general del administrador.
function crearPanelAdministrador() {
  const productosBajos = estadoAplicacion.products.filter(
    (producto) => producto.stock <= producto.stockMinimo
  );

  const totalVentas = estadoAplicacion.orders.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  );

  const listaStock = productosBajos.length
    ? productosBajos.slice(0, 6).map((producto) => `
      <li>
        <strong>${producto.nombre}</strong>
        <span>${producto.stock} unidades</span>
      </li>
    `).join('')
    : '<li>No hay alertas de stock.</li>';

  const listaConsultas = estadoAplicacion.messages.length
    ? estadoAplicacion.messages.slice(0, 6).map((consulta) => `
      <article class="message-item">
        <div>
          <strong>${escaparHTML(consulta.name)}</strong>
          <small>${escaparHTML(consulta.email)} · ${escaparHTML(consulta.date)}</small>
        </div>
        <p>${escaparHTML(consulta.comment)}</p>
      </article>
    `).join('')
    : '<p class="empty-small">Todavía no existen consultas guardadas.</p>';

  const listaUsuarios = Object.values(usuariosDemo).map((usuario) => `
    <li>
      <strong>${usuario.name}</strong>
      <span>${usuario.role}</span>
    </li>
  `).join('');

  return `
    <section class="role-dashboard" aria-labelledby="admin-title">
      <div class="dashboard-heading">
        <div>
          <p class="eyebrow">Panel de administración</p>
          <h2 id="admin-title">Control general de la ferretería</h2>
        </div>

        <span class="role-chip role-admin">Acceso completo</span>
      </div>

      <div class="metric-grid">
        ${crearMetrica(
          'Ventas registradas',
          formatearDinero(totalVentas),
          'Total de pedidos simulados'
        )}
        ${crearMetrica(
          'Pedidos',
          estadoAplicacion.orders.length,
          'Solicitudes recibidas'
        )}
        ${crearMetrica(
          'Productos',
          estadoAplicacion.products.length,
          'Productos del catálogo'
        )}
        ${crearMetrica(
          'Consultas',
          estadoAplicacion.messages.length,
          'Mensajes de contacto'
        )}
      </div>

      <div class="dashboard-grid">
        <article class="dashboard-card dashboard-wide">
          <div class="card-heading">
            <div>
              <p class="eyebrow">Ventas</p>
              <h3>Últimos pedidos</h3>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Entrega</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${crearFilasPedidos(estadoAplicacion.orders)}
              </tbody>
            </table>
          </div>
        </article>

        <article class="dashboard-card">
          <p class="eyebrow">Inventario</p>
          <h3>Alertas de stock</h3>
          <ul class="data-list">${listaStock}</ul>

          <button class="button button-primary" type="button" data-view="catalogo">
            Administrar catálogo
          </button>
        </article>

        <article class="dashboard-card">
          <p class="eyebrow">Usuarios</p>
          <h3>Perfiles del sistema</h3>
          <ul class="data-list">${listaUsuarios}</ul>
        </article>

        <article class="dashboard-card dashboard-wide">
          <p class="eyebrow">Contacto</p>
          <h3>Consultas recibidas</h3>
          <div class="message-list">${listaConsultas}</div>
        </article>

        <article class="dashboard-card dashboard-wide">
          <p class="eyebrow">Permisos</p>
          <h3>Funciones disponibles</h3>
          <ul class="permission-list">
            <li>Revisar ventas y pedidos.</li>
            <li>Consultar catálogo e inventario.</li>
            <li>Revisar usuarios de demostración.</li>
            <li>Leer consultas enviadas desde contacto.</li>
          </ul>
        </article>
      </div>
    </section>
  `;
}


// Crea el panel de trabajo del vendedor.
function crearPanelVendedor() {
  const productosBajos = estadoAplicacion.products.filter(
    (producto) => producto.stock <= producto.stockMinimo
  );

  const totalVentas = estadoAplicacion.orders.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  );

  const listaStock = productosBajos.length
    ? productosBajos.slice(0, 8).map((producto) => `
      <li>
        <strong>${producto.nombre}</strong>
        <span>${producto.stock} disponibles</span>
      </li>
    `).join('')
    : '<li>El inventario no tiene alertas.</li>';

  return `
    <section class="role-dashboard" aria-labelledby="seller-title">
      <div class="dashboard-heading">
        <div>
          <p class="eyebrow">Panel de ventas</p>
          <h2 id="seller-title">Pedidos e inventario</h2>
        </div>

        <span class="role-chip role-seller">Acceso vendedor</span>
      </div>

      <div class="metric-grid">
        ${crearMetrica(
          'Ventas registradas',
          formatearDinero(totalVentas),
          'Total simulado'
        )}
        ${crearMetrica(
          'Pedidos',
          estadoAplicacion.orders.length,
          'Pedidos para revisar'
        )}
        ${crearMetrica(
          'Productos',
          estadoAplicacion.products.length,
          'Referencias disponibles'
        )}
        ${crearMetrica(
          'Stock bajo',
          productosBajos.length,
          'Productos para reponer'
        )}
      </div>

      <div class="dashboard-grid">
        <article class="dashboard-card dashboard-wide">
          <p class="eyebrow">Ventas</p>
          <h3>Pedidos recientes</h3>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Entrega</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${crearFilasPedidos(estadoAplicacion.orders)}
              </tbody>
            </table>
          </div>
        </article>

        <article class="dashboard-card">
          <p class="eyebrow">Inventario</p>
          <h3>Productos por revisar</h3>
          <ul class="data-list">${listaStock}</ul>
        </article>

        <article class="dashboard-card">
          <p class="eyebrow">Acciones</p>
          <h3>Trabajo de vendedor</h3>
          <div class="action-list">
            <button class="button button-primary" type="button" data-view="catalogo">
              Consultar productos
            </button>
            <button class="button button-secondary" type="button" data-view="carrito">
              Preparar pedido
            </button>
          </div>
        </article>
      </div>
    </section>
  `;
}


// Crea la vista personal del contratista.
function crearPanelContratista() {
  const pedidosPropios = estadoAplicacion.orders.filter(
    (pedido) => pedido.customerEmail === estadoAplicacion.user.email
  );

  const totalCarrito = estadoAplicacion.cart.reduce(
    (total, producto) => total + producto.precioVenta * producto.cantidad,
    0
  );

  const productosCarrito = estadoAplicacion.cart.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  const historial = pedidosPropios.length
    ? pedidosPropios.map((pedido) => `
      <li>
        <strong>${escaparHTML(pedido.id)}</strong>
        <span>${formatearDinero(pedido.total)} · ${escaparHTML(pedido.delivery)}</span>
      </li>
    `).join('')
    : '<li>Todavía no tienes pedidos confirmados.</li>';

  return `
    <section class="role-dashboard" aria-labelledby="customer-title">
      <div class="dashboard-heading">
        <div>
          <p class="eyebrow">Área de cliente</p>
          <h2 id="customer-title">Mis compras y solicitudes</h2>
        </div>

        <span class="role-chip role-customer">Contratista</span>
      </div>

      <div class="metric-grid metric-grid-customer">
        ${crearMetrica(
          'Mi carrito',
          productosCarrito,
          'Unidades seleccionadas'
        )}
        ${crearMetrica(
          'Total estimado',
          formatearDinero(totalCarrito),
          'Valor antes de confirmar'
        )}
        ${crearMetrica(
          'Mis pedidos',
          pedidosPropios.length,
          'Pedidos confirmados'
        )}
      </div>

      <div class="dashboard-grid">
        <article class="dashboard-card">
          <p class="eyebrow">Historial</p>
          <h3>Mis pedidos</h3>
          <ul class="data-list">${historial}</ul>
        </article>

        <article class="dashboard-card">
          <p class="eyebrow">Acciones</p>
          <h3>¿Qué necesitas hacer?</h3>

          <div class="action-list">
            <button class="button button-primary" type="button" data-view="catalogo">
              Ver catálogo
            </button>
            <button class="button button-secondary" type="button" data-view="carrito">
              Revisar carrito
            </button>
            <a class="button button-light" href="contacto.html">
              Contactar a la tienda
            </a>
          </div>
        </article>
      </div>
    </section>
  `;
}


// Muestra el panel que corresponde al usuario conectado.
function mostrarCuenta() {
  const contenidoCuenta = buscarElemento('#account-content');

  if (!contenidoCuenta) {
    return;
  }

  if (!estadoAplicacion.user) {
    contenidoCuenta.innerHTML = `
      <div class="empty">
        <h2>Inicia sesión para continuar</h2>
        <p>El contenido de cada cuenta es privado para su perfil.</p>

        <button
          class="button button-primary"
          type="button"
          data-view="acceso"
        >
          Ingresar
        </button>
      </div>
    `;

    return;
  }

  let panelRol = crearPanelContratista();

  if (estadoAplicacion.user.role === 'Administrador') {
    panelRol = crearPanelAdministrador();
  }

  if (estadoAplicacion.user.role === 'Vendedor') {
    panelRol = crearPanelVendedor();
  }

  contenidoCuenta.innerHTML = `
    <article class="account-profile">
      <div>
        <p class="eyebrow">Sesión activa</p>
        <h2>${estadoAplicacion.user.name}</h2>
        <p>${estadoAplicacion.user.email} · ${estadoAplicacion.user.role}</p>
      </div>

      <button
        class="button button-outline account-button"
        type="button"
        data-logout
      >
        Cerrar sesión
      </button>
    </article>

    ${panelRol}
  `;
}


// Controla la navegación, el cierre de sesión y el menú móvil.
document.addEventListener('click', (evento) => {
  const botonVista = evento.target.closest('[data-view]');

  if (botonVista) {
    evento.preventDefault();
    mostrarVista(botonVista.dataset.view);
  }

  if (evento.target.closest('[data-logout]')) {
    estadoAplicacion.user = null;
    guardarEstado();
    mostrarVista('inicio');
  }

  const botonMenu = evento.target.closest('.menu-button');

  if (botonMenu) {
    const navegacion = buscarElemento('.main-nav');
    const estaAbierto = navegacion.classList.toggle('is-open');

    botonMenu.setAttribute(
      'aria-expanded',
      String(estaAbierto)
    );
  }
});


// Comparte las herramientas que necesitan los otros archivos.
window.ferreteria = {
  usuariosDemo,
  estadoAplicacion,
  buscarElemento,
  formatearDinero,
  escaparHTML,
  guardarEstado,
  mostrarVista,
  mostrarCuenta,
  actualizarEnlaceActivo
};


// Marca la página actual y prepara el contenido de la cuenta.
const paginaActual = document.body.dataset.page;

if (paginaActual) {
  actualizarEnlaceActivo(paginaActual);
}

if (paginaActual === 'cuenta') {
  mostrarCuenta();
}

guardarEstado();
