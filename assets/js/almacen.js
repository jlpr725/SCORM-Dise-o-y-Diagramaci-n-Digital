/* ============================================================
   Almacén local · versión web del material
   ------------------------------------------------------------
   Expone el mismo objeto SCORM que usan las unidades, pero
   respaldado por el navegador en vez de por un LMS. Así el
   motor de navegación funciona sin cambiar una sola línea.

   Novedades sobre la versión anterior:
   - El progreso se guarda por correo del estudiante (sesión),
     no de forma anónima para todo el que use el equipo.
   - Las unidades se activan o no según el Sheet de control
     (ENDPOINT_UNIDADES, definido en estudiantes.js). El docente
     marca los checkbox ahí y el cambio llega a todos.
   ============================================================ */
var CURSO = {
  claveSesion: 'ddd_sesion',
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

/* ---------- Unidades activas (controladas por el docente en el Sheet) ---------- */

CURSO.claveActivas = 'ddd_activas_cache';

/* Devuelve una promesa con un objeto { u01: true, u02: false, ... }.
   Si el Sheet no responde (sin internet, endpoint caído), usa la
   última copia guardada en este navegador; si nunca hubo una,
   deja solo la unidad 1 disponible. */
CURSO.obtenerActivas = function () {
  var respaldo = function () {
    try {
      var guardado = localStorage.getItem(CURSO.claveActivas);
      if (guardado) return JSON.parse(guardado);
    } catch (e) { /* nada */ }
    var soloUno = {};
    CURSO.unidades.forEach(function (u, i) { soloUno[u.id] = i === 0; });
    return soloUno;
  };

  if (!window.ENDPOINT_UNIDADES) return Promise.resolve(respaldo());

  return fetch(window.ENDPOINT_UNIDADES, { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (datos) {
      try { localStorage.setItem(CURSO.claveActivas, JSON.stringify(datos)); } catch (e) { /* nada */ }
      return datos;
    })
    .catch(respaldo);
};

/* ---------- Sesión del estudiante ---------- */

CURSO.normalizar = function (correo) {
  return (correo || '').trim().toLowerCase();
};

CURSO.correoValido = function (correo) {
  var c = CURSO.normalizar(correo);
  if (!c) return false;
  return (window.ESTUDIANTES || []).some(function (e) {
    return CURSO.normalizar(e) === c;
  });
};

CURSO.sesion = function () {
  try { return localStorage.getItem(CURSO.claveSesion) || ''; } catch (e) { return ''; }
};

CURSO.iniciarSesion = function (correo) {
  var c = CURSO.normalizar(correo);
  if (!CURSO.correoValido(c)) return false;
  try { localStorage.setItem(CURSO.claveSesion, c); } catch (e) { /* modo privado */ }
  return true;
};

CURSO.cerrarSesion = function () {
  try { localStorage.removeItem(CURSO.claveSesion); } catch (e) { /* nada */ }
};

/* ---------- Progreso (por estudiante) ---------- */

CURSO.claveProgreso = function () {
  return 'ddd_progreso_' + (CURSO.sesion() || 'anonimo');
};

CURSO.leer = function () {
  try {
    return JSON.parse(localStorage.getItem(CURSO.claveProgreso())) || {};
  } catch (e) { return {}; }
};

CURSO.guardar = function (datos) {
  try { localStorage.setItem(CURSO.claveProgreso(), JSON.stringify(datos)); } catch (e) { /* modo privado */ }
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

CURSO.reiniciar = function () {
  try { localStorage.removeItem(CURSO.claveProgreso()); } catch (e) { /* nada */ }
};

/* Modo docente: ?docente=1 desbloquea todas las unidades para probar,
   sin necesidad de iniciar sesión ni de cambiar la fecha */
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

  function clave(k) {
    return 'ddd_' + (CURSO.sesion() || 'anonimo') + '_' + unidadActual + '_' + k;
  }

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
