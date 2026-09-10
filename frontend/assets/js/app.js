// Controla elementos compartidos: menú, sesión y contador del carrito.
(function iniciarAplicacion() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, buscarTodos, ruta } = sistema.utilidades;

  function actualizarCabecera() {
    const cantidad = estado.carrito.reduce(
      (total, producto) => total + Number(producto.cantidad || 0),
      0
    );

    buscarTodos('[data-cart-count], #cart-count').forEach((contador) => {
      contador.textContent = cantidad;
    });

    buscarTodos('[data-session-link]').forEach((enlace) => {
      enlace.textContent = estado.usuario ? estado.usuario.nombre.split(' ')[0] : 'Mi cuenta';
      enlace.href = estado.usuario
        ? ruta('tienda/cuenta.html')
        : ruta('tienda/inicio-sesion.html');
    });
  }

  document.addEventListener('click', (evento) => {
    const botonMenu = evento.target.closest('.menu-button');

    if (botonMenu) {
      const navegacion = buscar('#main-nav');
      const abierto = navegacion?.classList.toggle('is-open');
      botonMenu.setAttribute('aria-expanded', String(Boolean(abierto)));
    }

    if (evento.target.closest('[data-logout]')) {
      estado.usuario = null;
      sincronizar();
      window.location.href = ruta('tienda/inicio-sesion.html');
    }
  });

  sincronizar();
  actualizarCabecera();

  sistema.app = { actualizarCabecera };
})();
