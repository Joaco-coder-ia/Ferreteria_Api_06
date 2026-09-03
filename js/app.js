// En este archivo dejamos las funciones que se usan en todas las paginas.
// Asi evitamos repetir la navegacion, el estado y el guardado en cada JS.


// Estos son los usuarios de prueba que podemos ocupar sin una base de datos real.
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


// Esta funcion lee datos del navegador y evita que la aplicacion se caiga
// si algun dato guardado anteriormente no tiene un formato correcto.
function leerDatoGuardado(clave, valorInicial) {
  try {
    return JSON.parse(
      localStorage.getItem(clave) || JSON.stringify(valorInicial)
    );
  } catch (error) {
    return valorInicial;
  }
}


// Aca guardamos la informacion que puede cambiar mientras usamos la pagina.
// El carrito, los pedidos y el usuario se recuperan desde localStorage.
const estadoAplicacion = {
  products: [],
  cart: leerDatoGuardado('ep1-cart', []),
  orders: leerDatoGuardado('ep1-orders', []),
  user: leerDatoGuardado('ep1-user', null),
  selected: null
};


// Esta abreviacion sirve para buscar un elemento HTML sin repetir
// document.querySelector en cada parte del codigo.
const buscarElemento = (selector) =>
  document.querySelector(selector);


// Con esta funcion dejamos todos los precios con formato de pesos chilenos.
const formatearDinero = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor);


// Guardamos la informacion importante para que no se pierda
// cuando la persona actualiza o vuelve a abrir la pagina.
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
    'ep1-user',
    JSON.stringify(estadoAplicacion.user)
  );

  // Si en algun momento agregamos el contador al HTML, se actualizara aca.
  const contadorCarrito = buscarElemento('#cart-count');

  if (contadorCarrito) {
    contadorCarrito.textContent = estadoAplicacion.cart.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );
  }
}


// Cada grupo de vistas vive ahora en una pagina distinta.
// Este objeto indica a que archivo debemos ir cuando la vista no esta abierta.
const paginasDeLasVistas = {
  inicio: 'index.html',
  acceso: 'index.html#acceso',
  registro: 'index.html#registro',
  cuenta: 'index.html#cuenta',
  catalogo: 'productos.html',
  detalle: 'productos.html#detalle',
  carrito: 'productos.html#carrito',
  contacto: 'contacto.html'
};


// Esta funcion muestra una vista y oculta las otras que estan en la misma pagina.
// Si la seccion esta en otro HTML, nos envia al archivo que corresponde.
function mostrarVista(nombre, actualizarDireccion = true) {
  const vistaSeleccionada = buscarElemento(`#view-${nombre}`);

  if (!vistaSeleccionada) {
    const destino = paginasDeLasVistas[nombre];

    if (destino) {
      window.location.href = destino;
    }

    return;
  }

  document.querySelectorAll('.view').forEach((vista) => {
    vista.hidden = vista !== vistaSeleccionada;
  });

  // Estas tarjetas pertenecen solamente al inicio y se esconden en las otras vistas.
  document.querySelectorAll('[data-home-only]').forEach((seccion) => {
    seccion.hidden = nombre !== 'inicio';
  });

  // Cerramos el menu movil despues de seleccionar cualquier opcion.
  buscarElemento('.main-nav')?.classList.remove('is-open');

  buscarElemento('.menu-button')?.setAttribute(
    'aria-expanded',
    'false'
  );

  // Pedimos a cada archivo que actualize su contenido solo cuando corresponde.
  if (nombre === 'catalogo') {
    window.funcionesCatalogo?.mostrarCatalogo();
  }

  if (nombre === 'carrito') {
    window.funcionesCatalogo?.mostrarCarrito();
  }

  if (nombre === 'cuenta') {
    mostrarCuenta();
  }

  // Guardamos la vista en la direccion para poder volver directamente a ella.
  if (actualizarDireccion) {
    const vistaPrincipal = buscarElemento('#view-inicio')
      ? 'inicio'
      : 'catalogo';

    const nuevaDireccion = nombre === vistaPrincipal
      ? window.location.pathname
      : `${window.location.pathname}#${nombre}`;

    window.history.replaceState(null, '', nuevaDireccion);
  }

  buscarElemento('#app')?.focus({
    preventScroll: true
  });
}


// Esta parte crea la informacion que vemos dentro de Mi cuenta.
function mostrarCuenta() {
  const contenidoCuenta = buscarElemento('#account-content');

  if (!contenidoCuenta) {
    return;
  }

  // Si todavia no hay una sesion, mostramos el acceso como siguiente paso.
  if (!estadoAplicacion.user) {
    contenidoCuenta.innerHTML = `
      <div class="empty">
        <h2>Inicia sesión para continuar</h2>

        <p>
          El historial y la cuenta corriente son privados para cada cliente.
        </p>

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

  // Cuando existe una sesion mostramos sus datos y los pedidos guardados.
  const listaPedidos = estadoAplicacion.orders.length
    ? estadoAplicacion.orders
      .map((pedido) =>
        `${pedido.id} · ${formatearDinero(pedido.total)} · ${pedido.delivery}`
      )
      .join('<br>')
    : 'Todavía no tienes pedidos confirmados.';

  contenidoCuenta.innerHTML = `
    <article class="account-card">
      <p class="eyebrow">Sesión activa</p>

      <h2>${estadoAplicacion.user.name}</h2>

      <p>
        ${estadoAplicacion.user.email}<br>
        Rol: ${estadoAplicacion.user.role}
      </p>

      <button
        class="button button-outline account-button"
        type="button"
        data-logout
      >
        Cerrar sesión
      </button>
    </article>

    <article class="account-card">
      <p class="eyebrow">Historial local</p>

      <h2>${estadoAplicacion.orders.length} pedidos</h2>

      <p>${listaPedidos}</p>
    </article>
  `;
}


// Escuchamos los botones que sirven para movernos entre las distintas vistas.
document.addEventListener('click', (evento) => {
  const botonVista = evento.target.closest('[data-view]');

  if (botonVista) {
    evento.preventDefault();
    mostrarVista(botonVista.dataset.view);
  }

  // Este boton elimina solamente la sesion, pero conserva carrito y pedidos.
  if (evento.target.closest('[data-logout]')) {
    estadoAplicacion.user = null;
    guardarEstado();
    mostrarVista('inicio');
  }

  // En pantallas chicas este boton abre o cierra el menu principal.
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


// Al usar los botones anterior y siguiente del navegador volvemos a mostrar
// la seccion que aparece escrita despues del signo #.
window.addEventListener('hashchange', () => {
  const nombreVista = window.location.hash.replace('#', '');

  if (nombreVista && buscarElemento(`#view-${nombreVista}`)) {
    mostrarVista(nombreVista, false);
  }
});


// Dejamos estas funciones disponibles para los otros archivos JavaScript.
// De esta forma cada archivo tiene su tarea pero pueden compartir los datos.
window.ferreteria = {
  usuariosDemo,
  estadoAplicacion,
  buscarElemento,
  formatearDinero,
  guardarEstado,
  mostrarVista,
  mostrarCuenta
};


// Elegimos la primera vista segun la pagina y su direccion actual.
const vistaDeLaDireccion = window.location.hash.replace('#', '');

if (vistaDeLaDireccion && buscarElemento(`#view-${vistaDeLaDireccion}`)) {
  mostrarVista(vistaDeLaDireccion, false);
} else if (buscarElemento('#view-inicio')) {
  mostrarVista('inicio', false);
} else if (buscarElemento('#view-catalogo')) {
  mostrarVista('catalogo', false);
}


// Finalmente guardamos el estado inicial de la aplicacion.
guardarEstado();
