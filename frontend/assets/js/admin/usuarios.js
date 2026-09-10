// Lista, filtra, crea y actualiza usuarios de la demostración.
(function iniciarGestionUsuarios() {
  const sistema = window.Ferreteria;
  const { estado, sincronizar } = sistema.almacenamiento;
  const { buscar, escapar, mostrarMensaje } = sistema.utilidades;
  if (!estado.usuario || estado.usuario.rol !== 'Administrador') return;

  const vista = document.body.dataset.adminView;
  const id = new URLSearchParams(window.location.search).get('id');
  const usuarioActual = estado.usuarios.find((usuario) => usuario.id === id);

  function usuariosFiltrados() {
    const texto = (buscar('#users-search')?.value || '').trim().toLowerCase();
    const rol = buscar('#users-role-filter')?.value || 'todos';
    const estadoElegido = buscar('#users-status-filter')?.value || 'todos';
    return estado.usuarios.filter((usuario) => {
      const coincideTexto = `${usuario.nombre} ${usuario.correo} ${usuario.id}`.toLowerCase().includes(texto);
      return coincideTexto && (rol === 'todos' || usuario.rol === rol) && (estadoElegido === 'todos' || usuario.estado === estadoElegido);
    });
  }

  function renderIndicadores() {
    const metricas = buscar('#user-metrics');
    if (!metricas) return;
    const cantidad = (rol) => estado.usuarios.filter((usuario) => usuario.rol === rol).length;
    metricas.innerHTML = `<article class="admin-metric"><span>Total de usuarios</span><strong>${estado.usuarios.length}</strong><small>${estado.usuarios.filter((usuario) => usuario.estado === 'Activo').length} activos</small></article><article class="admin-metric"><span>Administradores</span><strong>${cantidad('Administrador')}</strong><small>Control completo</small></article><article class="admin-metric"><span>Vendedores</span><strong>${cantidad('Vendedor')}</strong><small>Operación comercial</small></article><article class="admin-metric"><span>Clientes y contratistas</span><strong>${cantidad('Cliente') + cantidad('Contratista')}</strong><small>Compras personales</small></article>`;
  }

  function filas() {
    const cuerpo = buscar('#users-table-body');
    if (!cuerpo) return;
    const usuarios = usuariosFiltrados();
    cuerpo.innerHTML = usuarios.length ? usuarios.map((usuario) => `
      <tr>
        <td><div class="table-person"><span>${escapar(usuario.nombre.charAt(0))}</span><div><strong>${escapar(usuario.nombre)}</strong><small>${escapar(usuario.correo)}</small></div></div></td>
        <td><span class="role-badge role-${usuario.rol.toLowerCase()}">${escapar(usuario.rol)}</span></td>
        <td>${escapar(usuario.comuna || 'Sin comuna')}</td>
        <td><span class="status-badge status-${usuario.estado.toLowerCase()}">${escapar(usuario.estado)}</span></td>
        <td class="table-actions"><a href="detalle.html?id=${usuario.id}">Ver</a><a href="editar.html?id=${usuario.id}">Editar</a><button type="button" data-toggle-user="${usuario.id}" ${usuario.id === estado.usuario.id ? 'disabled title="No puedes desactivar tu propia sesión"' : ''}>${usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}</button></td>
      </tr>`).join('') : '<tr><td colspan="5" class="table-empty">No encontramos usuarios con esos filtros.</td></tr>';
    if (buscar('#users-count')) buscar('#users-count').textContent = `${usuarios.length} de ${estado.usuarios.length} usuarios`;
  }

  function completarFormulario(usuario) {
    if (!usuario) {
      buscar('#user-form')?.replaceWith(Object.assign(document.createElement('div'), { className: 'empty', innerHTML: '<h2>Usuario no encontrado</h2><a class="button button-primary" href="listado.html">Volver al listado</a>' }));
      return;
    }
    const valores = { '#user-name': usuario.nombre, '#user-email': usuario.correo, '#user-run': usuario.run, '#user-phone': usuario.telefono, '#user-role': usuario.rol, '#user-status': usuario.estado, '#user-region': usuario.region || 'Coquimbo', '#user-address': usuario.direccion, '#user-password': usuario.clave };
    Object.entries(valores).forEach(([selector, valor]) => { if (buscar(selector)) buscar(selector).value = valor || ''; });
    if (buscar('#user-comuna')) buscar('#user-comuna').value = usuario.comuna || '';
  }

  function nuevoId() {
    const mayor = estado.usuarios.reduce((maximo, usuario) => Math.max(maximo, Number(String(usuario.id).replace(/\D/g, '')) || 0), 0);
    return `USR-${String(mayor + 1).padStart(3, '0')}`;
  }

  function guardarFormulario(evento) {
    evento.preventDefault();
    const formulario = new FormData(evento.target);
    const datos = {
      nombre: String(formulario.get('nombre')).trim(),
      correo: String(formulario.get('correo')).trim().toLowerCase(),
      run: String(formulario.get('run') || '').trim(),
      telefono: String(formulario.get('telefono') || '').trim(),
      region: String(formulario.get('region') || 'Coquimbo'),
      comuna: String(formulario.get('comuna') || ''),
      direccion: String(formulario.get('direccion') || '').trim(),
      rol: formulario.get('rol'),
      estado: formulario.get('estado'),
      clave: formulario.get('clave') || usuarioActual?.clave || 'demo123'
    };
    const errores = sistema.validacionesUsuario.validarUsuario(datos);
    if (estado.usuarios.some((usuario) => usuario.correo === datos.correo && usuario.id !== usuarioActual?.id)) errores.push('El correo ya pertenece a otro usuario.');
    if (datos.clave.length < 6) errores.push('La contraseña debe tener al menos 6 caracteres.');
    if (datos.run && !/^[0-9.]{7,12}-[0-9kK]$/.test(datos.run)) errores.push('El RUN debe tener un formato válido.');
    const mensaje = buscar('#user-form-message');
    if (errores.length) { mostrarMensaje(mensaje, errores.join(' '), 'error'); return; }

    if (vista === 'editar' && usuarioActual) Object.assign(usuarioActual, datos);
    else estado.usuarios.push({ id: nuevoId(), ...datos });
    sincronizar();
    mostrarMensaje(mensaje, vista === 'editar' ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
    if (vista !== 'editar') evento.target.reset();
  }

  if (vista === 'listado') {
    renderIndicadores();
    filas();
    document.addEventListener('input', (evento) => { if (evento.target.id === 'users-search') filas(); });
    document.addEventListener('change', (evento) => { if (evento.target.matches('#users-role-filter, #users-status-filter')) filas(); });
    document.addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-toggle-user]');
      if (!boton) return;
      const usuario = estado.usuarios.find((item) => item.id === boton.dataset.toggleUser);
      if (!usuario || usuario.id === estado.usuario.id) return;
      usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
      sincronizar();
      renderIndicadores();
      filas();
      mostrarMensaje(buscar('#users-feedback'), `${usuario.nombre} quedó ${usuario.estado.toLowerCase()}.`);
    });
  }

  if (vista === 'editar') completarFormulario(usuarioActual);
  buscar('#user-form')?.addEventListener('submit', guardarFormulario);

  if (vista === 'detalle') {
    const detalle = buscar('#user-detail');
    detalle.innerHTML = usuarioActual ? `<div class="detail-avatar">${escapar(usuarioActual.nombre.charAt(0))}</div><div><p class="eyebrow">${escapar(usuarioActual.id)}</p><h1>${escapar(usuarioActual.nombre)}</h1><p>${escapar(usuarioActual.correo)}</p><dl class="admin-detail-list"><div><dt>Rol</dt><dd>${escapar(usuarioActual.rol)}</dd></div><div><dt>Estado</dt><dd>${escapar(usuarioActual.estado)}</dd></div><div><dt>RUN</dt><dd>${escapar(usuarioActual.run || 'Sin información')}</dd></div><div><dt>Teléfono</dt><dd>${escapar(usuarioActual.telefono || 'Sin información')}</dd></div><div><dt>Ubicación</dt><dd>${escapar([usuarioActual.comuna, usuarioActual.region].filter(Boolean).join(', ') || 'Sin información')}</dd></div><div><dt>Dirección</dt><dd>${escapar(usuarioActual.direccion || 'Sin información')}</dd></div></dl><a class="button button-primary" href="editar.html?id=${usuarioActual.id}">Editar usuario</a></div>` : '<div class="empty"><h1>Usuario no encontrado</h1><a class="button button-primary" href="listado.html">Volver</a></div>';
  }
})();
