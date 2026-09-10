// Lista, crea y actualiza productos usando el catalogo local.
(function iniciarGestionProductos() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar, cargarProductos } = sistema.almacenamiento;
  const { buscar, dinero, escapar, mostrarMensaje, ruta, imagenProducto } = sistema.utilidades;
  const { ponerError } = sistema.validaciones;
  if (!estado.usuario || estado.usuario.rol !== 'Administrador') return;

  const vista = document.body.dataset.adminView;
  const codigo = new URLSearchParams(window.location.search).get('codigo');

  cargarProductos(document.body.dataset.products || ruta('data/catalogo/productos.json')).then(() => {
    const productoActual = estado.productos.find((producto) => producto.codigo === codigo);

    if (vista === 'listado') {
      const categorias = [...new Set(estado.productos.map((producto) => producto.categoria))].sort();
      buscar('#product-category-filter').insertAdjacentHTML('beforeend', categorias.map((categoria) => `<option>${escapar(categoria)}</option>`).join(''));

      function renderProductos() {
        const texto = buscar('#product-search-admin').value.trim().toLowerCase();
        const categoria = buscar('#product-category-filter').value;
        const disponibilidad = buscar('#product-stock-filter').value;
        const productos = estado.productos.filter((producto) => {
          const coincideTexto = `${producto.nombre} ${producto.codigo} ${producto.marca}`.toLowerCase().includes(texto);
          const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
          const stockBajo = Number(producto.stock) <= Number(producto.stockMinimo || 0);
          const coincideStock = disponibilidad === 'todos' || (disponibilidad === 'bajo' && stockBajo) || (disponibilidad === 'disponible' && !stockBajo);
          return coincideTexto && coincideCategoria && coincideStock;
        });
        buscar('#products-table-body').innerHTML = productos.length ? productos.map((producto) => `<tr><td><div class="admin-product-cell"><img src="${imagenProducto(producto)}" alt="" loading="lazy"><div><strong>${escapar(producto.nombre)}</strong><span>${escapar(producto.codigo)} · ${escapar(producto.marca || 'Sin marca')}</span></div></div></td><td>${escapar(producto.categoria)}</td><td>${dinero(producto.precioVenta)}</td><td><span class="stock-value ${Number(producto.stock) <= Number(producto.stockMinimo || 0) ? 'is-low' : ''}">${producto.stock}</span></td><td class="table-actions"><a href="detalle.html?codigo=${producto.codigo}">Ver</a><a href="editar.html?codigo=${producto.codigo}">Editar</a></td></tr>`).join('') : '<tr><td colspan="5" class="table-empty">No encontramos productos con esos filtros.</td></tr>';
        buscar('#products-count').textContent = `${productos.length} de ${estado.productos.length} productos`;
      }

      buscar('#product-search-admin').addEventListener('input', renderProductos);
      buscar('#product-category-filter').addEventListener('change', renderProductos);
      buscar('#product-stock-filter').addEventListener('change', renderProductos);
      renderProductos();
    }

    if (vista === 'editar' && productoActual) {
      ['codigo', 'nombre', 'descripcion', 'imagen', 'marca', 'categoria', 'subcategoria', 'unidad', 'precioVenta', 'precioCompra', 'stock', 'stockMinimo'].forEach((campo) => {
        if (buscar(`[name="${campo}"]`)) buscar(`[name="${campo}"]`).value = productoActual[campo] ?? '';
      });
      buscar('[name="codigo"]').readOnly = true;
    }

    if (vista === 'detalle') {
      buscar('#product-admin-detail').innerHTML = productoActual ? `<div class="admin-product-photo"><img src="${imagenProducto(productoActual)}" alt="${escapar(productoActual.nombre)}"></div><div><p class="eyebrow">${escapar(productoActual.codigo)}</p><h1>${escapar(productoActual.nombre)}</h1><p>${escapar(productoActual.descripcion || 'Sin descripción adicional.')}</p><p>${escapar(productoActual.marca || 'Sin marca')} · ${escapar(productoActual.categoria)}</p><dl class="admin-detail-list"><div><dt>Precio venta</dt><dd>${dinero(productoActual.precioVenta)}</dd></div><div><dt>Stock actual</dt><dd>${productoActual.stock} ${escapar(productoActual.unidad || 'unidad')}</dd></div><div><dt>Stock crítico</dt><dd>${productoActual.stockMinimo ?? 'No definido'}</dd></div><div><dt>Subcategoría</dt><dd>${escapar(productoActual.subcategoria || 'Sin subcategoría')}</dd></div></dl><a class="button button-primary" href="editar.html?codigo=${productoActual.codigo}">Editar producto</a></div>` : '<div class="empty"><h1>Producto no encontrado</h1></div>';
    }

    const formularioProducto = buscar('#product-form');
    function leerFormulario() {
      const formulario = new FormData(formularioProducto);
      const datos = Object.fromEntries(formulario.entries());
      ['precioVenta', 'precioCompra', 'stock'].forEach((campo) => { datos[campo] = datos[campo] === '' ? '' : Number(datos[campo]); });
      datos.stockMinimo = datos.stockMinimo === '' ? '' : Number(datos.stockMinimo);
      return datos;
    }

    function validarFormulario(mostrar = true) {
      const datos = leerFormulario();
      const errores = sistema.validacionesProducto.erroresProducto(datos);
      if (mostrar) {
        ['codigo','nombre','descripcion','precioVenta','stock','stockMinimo','categoria'].forEach((campo) => ponerError(formularioProducto.elements[campo], errores[campo] || ''));
      }
      return { datos, errores };
    }

    formularioProducto?.addEventListener('input', () => validarFormulario(true));
    formularioProducto?.addEventListener('change', () => validarFormulario(true));
    formularioProducto?.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const { datos, errores } = validarFormulario(true);
      const mensaje = buscar('#product-form-message');
      if (Object.keys(errores).length) {
        mostrarMensaje(mensaje, 'Revisa los campos marcados antes de guardar el producto.', 'error');
        return;
      }
      if (vista !== 'editar' && estado.productos.some((producto) => producto.codigo.toLowerCase() === String(datos.codigo).toLowerCase())) {
        ponerError(formularioProducto.elements.codigo, 'El código ya existe en el catálogo.');
        mostrarMensaje(mensaje, 'El código indicado ya pertenece a otro producto.', 'error');
        return;
      }

      if (vista === 'editar' && productoActual) Object.assign(productoActual, datos);
      else estado.productos.push(datos);
      sincronizar();
      mostrarMensaje(mensaje, vista === 'editar' ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
      if (vista !== 'editar') formularioProducto.reset();
    });
  });
})();
