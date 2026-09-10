// Carga comunas segun la region elegida en los formularios.
(function cargarRegiones() {
  const regionesComunas = {
    'Arica y Parinacota': ['Arica', 'Camarones'],
    'Tarapacá': ['Iquique', 'Alto Hospicio'],
    'Antofagasta': ['Antofagasta', 'Calama'],
    'Atacama': ['Copiapó', 'Vallenar'],
    'Coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'Vicuña', 'Paihuano', 'Ovalle'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'San Antonio'],
    'Metropolitana de Santiago': ['Santiago', 'Providencia', 'Ñuñoa', 'Recoleta', 'Maipú'],
    'O’Higgins': ['Rancagua', 'San Fernando'],
    'Maule': ['Talca', 'Curicó'],
    'Ñuble': ['Chillán', 'San Carlos'],
    'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles'],
    'La Araucanía': ['Temuco', 'Villarrica'],
    'Los Ríos': ['Valdivia', 'La Unión'],
    'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro'],
    'Aysén': ['Coyhaique', 'Aysén'],
    'Magallanes': ['Punta Arenas', 'Puerto Natales']
  };

  function opcionesRegiones(selector) {
    const actual = selector.value;
    selector.innerHTML = '<option value="">Selecciona una región</option>'
      + Object.keys(regionesComunas).map((region) => `<option value="${region}">${region}</option>`).join('');
    if (actual && regionesComunas[actual]) selector.value = actual;
  }

  function actualizarComunas(regionSelect, comunaSelect, comunaSeleccionada = '') {
    const comunas = regionesComunas[regionSelect?.value] || [];
    comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>'
      + comunas.map((comuna) => `<option value="${comuna}">${comuna}</option>`).join('');
    if (comunaSeleccionada && comunas.includes(comunaSeleccionada)) comunaSelect.value = comunaSeleccionada;
  }

  document.querySelectorAll('[data-region-select]').forEach((regionSelect) => {
    opcionesRegiones(regionSelect);
    const formulario = regionSelect.closest('form') || document;
    const comunaSelect = formulario.querySelector('[data-comuna-select]');
    if (!comunaSelect) return;
    actualizarComunas(regionSelect, comunaSelect, comunaSelect.dataset.selected || '');
    regionSelect.addEventListener('change', () => actualizarComunas(regionSelect, comunaSelect));
  });

  // Compatibilidad para formularios antiguos que solo tengan comuna.
  document.querySelectorAll('[data-comuna-select]').forEach((comunaSelect) => {
    if (comunaSelect.closest('form')?.querySelector('[data-region-select]')) return;
    comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>'
      + regionesComunas.Coquimbo.map((comuna) => `<option value="${comuna}">${comuna}</option>`).join('');
  });

  window.Ferreteria = window.Ferreteria || {};
  window.Ferreteria.regiones = { regionesComunas, actualizarComunas };
})();
