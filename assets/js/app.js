/* ============================================================
   Motor de navegación · compartido por las 8 unidades
   ============================================================ */
(function () {
  'use strict';

  var secciones = [].slice.call(document.querySelectorAll('.seccion'));
  var botones   = [].slice.call(document.querySelectorAll('.indice button'));
  var selector  = document.getElementById('selector-movil');
  var barras    = [].slice.call(document.querySelectorAll('.barra i'));
  var textos    = [].slice.call(document.querySelectorAll('.avance-texto'));
  var btnPrev   = document.getElementById('anterior');
  var btnNext   = document.getElementById('siguiente');
  var regionViva = document.getElementById('aviso');

  var actual = 0;
  var vistas = {};
  var completado = false;

  /* ---------- Persistencia ---------- */

  function serializar() {
    var lista = [];
    for (var k in vistas) if (vistas[k]) lista.push(k);
    var marcados = [];
    [].forEach.call(document.querySelectorAll('.checklist input'), function (c, i) {
      if (c.checked) marcados.push(i);
    });
    return JSON.stringify({ s: actual, v: lista, c: marcados });
  }

  function restaurar() {
    var crudo = SCORM.leer('cmi.suspend_data');
    if (!crudo) return;
    try {
      var d = JSON.parse(crudo);
      if (d.v) d.v.forEach(function (i) { vistas[i] = true; });
      if (d.c) {
        var cajas = document.querySelectorAll('.checklist input');
        d.c.forEach(function (i) { if (cajas[i]) cajas[i].checked = true; });
      }
      if (typeof d.s === 'number' && d.s >= 0 && d.s < secciones.length) actual = d.s;
    } catch (e) { /* dato ilegible, se empieza de cero */ }
  }

  var pendiente = null;
  function persistir() {
    clearTimeout(pendiente);
    pendiente = setTimeout(function () {
      SCORM.guardar('cmi.suspend_data', serializar());
    }, 600);
  }

  /* ---------- Progreso ---------- */

  function contarVistas() {
    var n = 0;
    for (var k in vistas) if (vistas[k]) n++;
    return n;
  }

  function refrescarProgreso() {
    var n = contarVistas();
    var pct = Math.round((n / secciones.length) * 100);
    barras.forEach(function (b) { b.style.width = pct + '%'; });
    textos.forEach(function (t) { t.textContent = n + ' de ' + secciones.length + ' secciones'; });

    botones.forEach(function (b, i) {
      b.classList.toggle('visto', !!vistas[i] && i !== actual);
    });

    if (n === secciones.length && !completado) {
      completado = true;
      SCORM.completar();
      var caja = document.getElementById('fin');
      if (caja) caja.hidden = false;
    }
  }

  /* ---------- Navegación ---------- */

  function ir(indice, mover) {
    if (indice < 0 || indice >= secciones.length) return;
    actual = indice;
    vistas[indice] = true;

    secciones.forEach(function (s, i) { s.classList.toggle('activa', i === indice); });
    botones.forEach(function (b, i) { b.setAttribute('aria-current', i === indice ? 'true' : 'false'); });
    if (selector) selector.selectedIndex = indice;

    btnPrev.disabled = indice === 0;
    var esUnidad8 = document.body.dataset.unidad === 'u08';
    var esUltimaSeccion = indice === secciones.length - 1;

    // Si es la última sección de la Unidad 8, mantenemos el botón activo
    if (esUnidad8 && esUltimaSeccion) {
      btnNext.disabled = false;
      btnNext.textContent = 'Ir al Proyecto →'; // Puedes personalizar este texto
    } else {
      btnNext.disabled = esUltimaSeccion;
      btnNext.textContent = indice === secciones.length - 2 ? 'Última sección →' : 'Siguiente →';
    }

    if (mover !== false) {
      var caja = document.querySelector('.principal');
      if (caja) caja.scrollTop = 0; else window.scrollTo(0, 0);
      var h = secciones[indice].querySelector('h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }

    if (regionViva) {
      regionViva.textContent = 'Sección ' + (indice + 1) + ' de ' + secciones.length +
        ': ' + (botones[indice] ? botones[indice].dataset.titulo : '');
    }

    refrescarProgreso();
    persistir();
  }

  /* ---------- Escuchas ---------- */

  botones.forEach(function (b, i) { b.addEventListener('click', function () { ir(i); }); });
  if (selector) selector.addEventListener('change', function () { ir(selector.selectedIndex); });
  btnPrev.addEventListener('click', function () { ir(actual - 1); });
 btnNext.addEventListener('click', function () {
    var esUnidad8 = document.body.dataset.unidad === 'u08';
    var esUltimaSeccion = actual === secciones.length - 1;

    if (esUnidad8 && esUltimaSeccion) {
      window.location.href = 'proyectos.html'; // Usa '../proyecto.html' si el HTML actual está en una subcarpeta
    } else {
      ir(actual + 1);
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.matches('.checklist input')) persistir();
  });

  document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
    if (e.altKey && e.key === 'ArrowLeft')  { e.preventDefault(); ir(actual - 1); }
  });

  window.addEventListener('beforeunload', function () {
    SCORM.guardar('cmi.suspend_data', serializar());
    SCORM.cerrar();
  });

  /* ---------- Arranque ---------- */

  SCORM.iniciar();
  restaurar();
  ir(actual, false);
})();
