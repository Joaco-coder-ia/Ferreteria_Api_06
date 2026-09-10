// Opciones simples para formularios de despacho y contacto.
(function cargarRegiones() {
  const comunasCoquimbo = [
    'La Serena',
    'Coquimbo',
    'Andacollo',
    'Vicuña',
    'Paihuano',
    'Ovalle'
  ];

  document.querySelectorAll('[data-comuna-select]').forEach((selector) => {
    selector.insertAdjacentHTML(
      'beforeend',
      comunasCoquimbo.map((comuna) => `<option value="${comuna}">${comuna}</option>`).join('')
    );
  });

  window.Ferreteria = window.Ferreteria || {};
  window.Ferreteria.regiones = { comunasCoquimbo };
})();
