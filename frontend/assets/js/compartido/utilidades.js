// Funciones pequeñas que pueden ocupar todas las páginas.
(function iniciarUtilidades() {
  const buscar = (selector, base = document) => base.querySelector(selector);
  const buscarTodos = (selector, base = document) => [...base.querySelectorAll(selector)];

  // Relaciona cada código con su fotografía liviana y evita repetir rutas.
  const archivosProducto = {
    MC001: 'cemento-polpaico.webp', MC002: 'melon_blanco_25.jpg', MC003: 'mortero-weber.webp',
    MC004: 'volcan-25.webp', MC005: 'arena-fina.webp', MC006: 'ripio-25.webp',
    MC007: 'ladrillo-n5.webp', MC008: 'ladrillo-prensado.webp', MC009: 'bloque-hormigon.webp',
    MC010: 'bloque-liviano.webp', PT001: 'latex-sipa-blanco.webp', PT002: 'latex-40L.jpg',
    PT003: 'latex-komex.webp', PT004: 'esmalte-1L.jpg', PT005: 'esmalte-sipa.webp',
    PT006: 'antihumedad.webp', PT007: 'rodillo-23.webp', PT008: 'brocha-3.webp',
    PT009: 'cinta-3m.webp', HM001: 'martillo-500.webp', HM002: 'alicate.jpg',
    HM003: 'destornillador.jpg', HM004: 'destonillador-cruz.webp', HM005: 'llave-francesa.webp',
    HM006: 'llaves-allen.webp', HM007: 'serrucho.webp', HM008: 'nivel.webp',
    HM009: 'cinta-metrica.webp', HM010: 'cinta-metrica-8m.jpg', HE001: 'taladro-percutor-makita.png',
    HE002: 'atornillador-inalambrico-kit.avif', HE003: 'galleta-makita.webp', HE004: 'sierra-circular.jpg',
    HE005: 'lijadora-orbital.jpg', HE006: 'caladora.webp', GS001: 'cañeria-pvc.jpg',
    GS002: 'pvc-3.4.webp', GS003: 'cañeria-cobre.webp', GS004: 'codo-90.jpg',
    GS005: 'tee-1.2.jpg', GS006: 'union-doble.jpg', GS007: 'llave-paso.webp',
    GS008: 'llave-paso-3.4.webp', GS009: 'grifo-mono.webp', GS010: 'grifo-alto-mono.webp',
    GS011: 'teflon.jpg', GS012: 'silicona.jpg', EL001: 'cable-1.5.webp',
    EL002: 'cable-2.5.jpg', EL003: 'cable-paralelo.jpg', EL004: 'enchufe-chuko.jpg',
    EL005: 'enchufe-16a.jpg', EL006: 'interruptor-simple.jpg', EL007: 'interruptor-doble.jpg',
    EL008: 'tablero-4.jpg', EL009: 'automatico-16a.jpg', EL010: 'automatico-25a.webp',
    EL011: 'ampolleta-9w.jpg', EL012: 'ampolleta-12w.avif', EL013: 'plafon-led.webp',
    TR001: 'tornillo-autoperforante.webp', TR002: 'tornillo-madera.webp', TR003: 'tornillo-volcanita.webp',
    TR004: 'tarugo.webp', TR005: 'tarugo-s8.jpg', TR006: 'perno-golilla.webp',
    TR007: 'perno-anclaje.webp', TR008: 'anclaje-quimico.webp', MD001: 'pino-cepillado.jpg',
    MD002: 'pino-cepillado-2x4.webp', MD003: 'placa-terciado.jpg', MD004: 'placa-mdf.jpg',
    MD005: 'placa-osb.jpg', MD006: 'volcanita-10mm.webp', MD007: 'volcanita-antihumedad.jpg',
    SE001: 'casco-blanco.webp', SE002: 'guantes-3m.webp', SE003: 'antiparra-clear.webp',
    SE004: 'mascarilla.webp', SE005: 'arnes-seguridad.webp', JA001: 'manguera-3.4.webp',
    JA002: 'manguera-expandible.webp', JA003: 'pistola-riego-8m.webp', JA004: 'pala-redonda.jpg',
    JA005: 'rastrillo.jpg'
  };

  const imagenesCategoria = {
    'Mat. Construcción': 'construccion.svg', Pinturas: 'pinturas.svg', Herramientas: 'herramientas.svg',
    Gasfitería: 'gasfiteria.svg', Electricidad: 'electricidad.svg', Madera: 'madera.svg',
    Jardín: 'jardin.svg', Seguridad: 'seguridad.svg', Tornillería: 'tornilleria.svg'
  };

  function dinero(valor) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(Number(valor || 0));
  }

  function escapar(texto = '') {
    const elemento = document.createElement('span');
    elemento.textContent = String(texto);
    return elemento.innerHTML;
  }

  function fechaActual() {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date());
  }

  function raiz() {
    return document.body.dataset.root || '';
  }

  function ruta(destino) {
    return `${raiz()}${destino}`;
  }

  function imagenProducto(producto = {}) {
    if (String(producto.imagen || '').startsWith('data:image/')) return producto.imagen;
    if (String(producto.imagen || '').startsWith('assets/')) return ruta(producto.imagen);

    const fotografia = archivosProducto[String(producto.codigo || '').toUpperCase()];
    if (fotografia) return ruta(`assets/img/productos/originales/${fotografia}`);

    const respaldo = imagenesCategoria[producto.categoria] || 'herramientas.svg';
    return ruta(`assets/img/productos/originales/${respaldo}`);
  }

  function mostrarMensaje(elemento, mensaje, tipo = 'exito') {
    if (!elemento) return;
    elemento.hidden = false;
    elemento.textContent = mensaje;
    elemento.classList.toggle('is-error', tipo === 'error');
  }

  window.Ferreteria = window.Ferreteria || {};
  window.Ferreteria.utilidades = {
    buscar,
    buscarTodos,
    dinero,
    escapar,
    fechaActual,
    raiz,
    ruta,
    imagenProducto,
    mostrarMensaje
  };
})();
