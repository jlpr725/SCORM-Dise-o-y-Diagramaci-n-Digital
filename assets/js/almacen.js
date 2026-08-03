/* ============================================================
   Almacén local · versión web del material
   ------------------------------------------------------------
   Expone el mismo objeto SCORM que usan las unidades, pero
   respaldado por el navegador en vez de por un LMS. Así el
   motor de navegación funciona sin cambiar una sola línea.
   ============================================================ */
var CURSO = {
  clave: 'ddd_progreso',
  unidades: [
    { id: 'u01', n: 1, titulo: '¿Con qué herramientas se diagrama hoy y cómo funciona su lógica?', tema: 'El documento base' },
    { id: 'u02', n: 2, titulo: '¿Cómo se construye una estructura que sostenga cualquier página?', tema: 'La retícula' },
    { id: 'u03', n: 3, titulo: '¿Cómo guío la mirada del lector por la página?', tema: 'Jerarquía visual' },
    { id: 'u04', n: 4, titulo: '¿Cómo influye la tipografía en la usabilidad y la estética?', tema: 'Tipografía y estilos' },
    { id: 'u05', n: 5, titulo: '¿Cómo usar el color y el contraste para reforzar el mensaje?', tema: 'Color y accesibilidad' },
    { id: 'u06', n: 6, titulo: '¿Cómo integro imagen y multimedia, y adapto el diseño?', tema: 'Imagen y pantalla' },
    { id: 'u07', n: 7, titulo: '¿Cómo se trabaja sobre un archivo que otra persona va a tocar?', tema: 'Entrega y revisión' },
    { id: 'u08', n: 8, titulo: '¿Cómo cierro un producto editorial y lo defiendo?', tema: 'Cierre del proyecto' }
  ]
};

CURSO.leer = function () {
  try {
    return JSON.parse(localStorage.getItem(CURSO.clave)) || {};
  } catch (e) { return {}; }
};

CURSO.guardar = function (datos) {
  try { localStorage.setItem(CURSO.clave, JSON.stringify(datos)); } catch (e) { /* modo privado */ }
};

CURSO.completar = function (id) {
  var d = CURSO.leer();
  d[id] = d[id] || {};
  d[id].completa = true;
  d[id].fecha = new Date().toISOString();
  CURSO.guardar(d);
};

CURSO.estaCompleta = function (id) {
  var d = CURSO.leer();
  return !!(d[id] && d[id].completa);
};

CURSO.desbloqueada = function (indice) {
  if (indice === 0) return true;
  return CURSO.estaCompleta(CURSO.unidades[indice - 1].id);
};

CURSO.reiniciar = function () {
  try { localStorage.removeItem(CURSO.clave); } catch (e) { /* nada */ }
};

/* Modo docente: ?docente=1 desbloquea todas las unidades */
CURSO.modoLibre = (function () {
  try {
    if (/[?&]docente=1/.test(window.location.search)) {
      sessionStorage.setItem('ddd_libre', '1');
      return true;
    }
    return sessionStorage.getItem('ddd_libre') === '1';
  } catch (e) { return false; }
})();

/* ---------- Objeto SCORM simulado ---------- */
var SCORM = (function () {
  var unidadActual = (document.body && document.body.getAttribute('data-unidad')) || '';

  function clave(k) { return 'ddd_' + unidadActual + '_' + k; }

  return {
    iniciar: function () { return true; },
    activo: function () { return true; },
    leer: function (k) {
      try { return localStorage.getItem(clave(k)) || ''; } catch (e) { return ''; }
    },
    guardar: function (k, v) {
      try { localStorage.setItem(clave(k), v); return true; } catch (e) { return false; }
    },
    completar: function () {
      if (unidadActual) {
        CURSO.completar(unidadActual);
        var av = document.getElementById('siguiente-unidad');
        if (av) av.hidden = false;
      }
      return true;
    },
    cerrar: function () { /* no aplica fuera de un LMS */ }
  };
})();
