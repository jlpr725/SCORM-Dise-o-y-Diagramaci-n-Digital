/* ============================================================
   Formulario de retroalimentación
   ============================================================ */
(function () {
  'use strict';

  var form      = document.getElementById('form');
  var estado    = document.getElementById('estado');
  var btnEnviar = document.getElementById('btn-enviar');
  var gracias   = document.getElementById('gracias');

  /* ---------- Dimensiones de la escala ---------- */
  var DIMENSIONES = [
    { id: 'claridad',      t: 'Claridad de las explicaciones', d: '¿Se entiende sin releer?' },
    { id: 'profundidad',   t: 'Profundidad del contenido',     d: '¿Llega al fondo o se queda en la superficie?' },
    { id: 'rigor',         t: 'Rigor técnico',                 d: '¿Los datos y procedimientos son correctos?' },
    { id: 'progresion',    t: 'Progresión entre unidades',     d: '¿Cada semana se apoya en la anterior?' },
    { id: 'ilustraciones', t: 'Utilidad de las ilustraciones', d: '¿Aportan o son decorativas?' },
    { id: 'diseno',        t: 'Diseño y legibilidad',          d: '¿Es cómodo de leer y de recorrer?' },
    { id: 'practica',      t: 'Aplicabilidad práctica',        d: '¿El estudiante puede ejecutar lo que lee?' },
    { id: 'evaluacion',    t: 'Claridad de las entregas',      d: '¿Queda claro qué hay que hacer y cómo se evalúa?' }
  ];

  var cajaEsc = document.getElementById('escalas');
  DIMENSIONES.forEach(function (dim) {
    var fila = document.createElement('div');
    fila.className = 'esc';

    var etq = document.createElement('div');
    etq.className = 'dim';
    etq.innerHTML = dim.t + '<small>' + dim.d + '</small>';

    var notas = document.createElement('div');
    notas.className = 'notas';
    notas.setAttribute('role', 'radiogroup');
    notas.setAttribute('aria-label', dim.t);

    for (var v = 1; v <= 5; v++) {
      var lab = document.createElement('label');
      lab.innerHTML = '<input type="radio" name="esc_' + dim.id + '" value="' + v + '">' +
                      '<span aria-hidden="true">' + v + '</span>' +
                      '<span class="saltar">' + v + ' de 5 en ' + dim.t + '</span>';
      notas.appendChild(lab);
    }

    fila.appendChild(etq);
    fila.appendChild(notas);
    cajaEsc.appendChild(fila);
  });

  /* ---------- Desplegables de unidades ---------- */
  ['mas-fuerte', 'mas-debil'].forEach(function (id) {
    var sel = document.getElementById(id);
    sel.innerHTML = '<option value="">Sin especificar</option>';
    CURSO.unidades.forEach(function (u) {
      var o = document.createElement('option');
      o.value = 'Unidad ' + u.n + ' · ' + u.tema;
      o.textContent = 'Unidad ' + u.n + ' · ' + u.tema;
      sel.appendChild(o);
    });
  });

  /* ---------- Recoger ---------- */
  function recoger() {
    var d = {
      enviado: new Date().toISOString(),
      clave: (window.CONFIG && CONFIG.clave) || '',
      nombre: form.nombre.value.trim(),
      area: form.area.value.trim(),
      anios: form.anios.value,
      alcance: valorRadio('alcance'),
      mejor: form.mejor.value.trim(),
      falta: form.falta.value.trim(),
      sobra: form.sobra.value.trim(),
      mas_fuerte: form['mas_fuerte'].value,
      mas_debil: form['mas_debil'].value,
      porque_debil: form['porque_debil'].value.trim(),
      carga: valorRadio('carga'),
      tono: valorRadio('tono'),
      secuencia: form.secuencia.value.trim(),
      error_detectado: form.error.value.trim(),
      usaria: valorRadio('usaria'),
      prioridad: form.prioridad.value.trim(),
      libre: form.libre.value.trim()
    };
    DIMENSIONES.forEach(function (dim) {
      d['esc_' + dim.id] = valorRadio('esc_' + dim.id);
    });
    return d;
  }

  function valorRadio(nombre) {
    var m = form.querySelector('input[name="' + nombre + '"]:checked');
    return m ? m.value : '';
  }

  /* ---------- Validar ---------- */
  function validar() {
    var fallos = [];
    form.querySelectorAll('.campo.falla').forEach(function (c) { c.classList.remove('falla'); });

    ['nombre', 'area', 'mejor', 'falta', 'prioridad'].forEach(function (n) {
      var campo = form[n];
      if (!campo.value.trim()) {
        campo.closest('.campo').classList.add('falla');
        fallos.push(campo);
      }
    });

    ['alcance', 'carga', 'tono', 'usaria'].forEach(function (n) {
      if (!valorRadio(n)) {
        var grupo = form.querySelector('input[name="' + n + '"]').closest('.campo');
        grupo.classList.add('falla');
        fallos.push(grupo);
      }
    });

    return fallos;
  }

  /* ---------- Descargar respaldo ---------- */
  function descargar() {
    var d = recoger();
    var lineas = ['RETROALIMENTACIÓN · Diseño y Diagramación Digital', ''];

    function bloque(titulo, pares) {
      lineas.push('── ' + titulo.toUpperCase() + ' ──');
      pares.forEach(function (p) {
        if (p[1]) lineas.push(p[0] + ': ' + p[1]);
      });
      lineas.push('');
    }

    bloque('Quién responde', [
      ['Nombre', d.nombre], ['Área', d.area],
      ['Años enseñando', d.anios], ['Alcance revisado', d.alcance]
    ]);

    bloque('Valoración', DIMENSIONES.map(function (dim) {
      return [dim.t, d['esc_' + dim.id] ? d['esc_' + dim.id] + ' de 5' : ''];
    }));

    bloque('Lo concreto', [
      ['Lo mejor', d.mejor], ['Lo que falta', d.falta], ['Lo que sobra', d.sobra],
      ['Unidad más sólida', d.mas_fuerte], ['Unidad más floja', d.mas_debil],
      ['Por qué', d.porque_debil]
    ]);

    bloque('Lo pedagógico', [
      ['Carga de trabajo', d.carga], ['Tono', d.tono],
      ['Secuencia', d.secuencia], ['Errores detectados', d.error_detectado]
    ]);

    bloque('Cierre', [
      ['¿Lo usaría?', d.usaria], ['Prioridad de cambio', d.prioridad],
      ['Comentario libre', d.libre]
    ]);

    lineas.push('Enviado: ' + new Date().toLocaleString('es-CO'));

    var blob = new Blob([lineas.join('\n')], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'retroalimentacion_' + (d.nombre.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase() || 'anonimo') + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  document.getElementById('btn-descargar').addEventListener('click', descargar);
  var btn2 = document.getElementById('btn-descargar-2');
  if (btn2) btn2.addEventListener('click', descargar);

  /* ---------- Enviar ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fallos = validar();
    if (fallos.length) {
      estado.className = 'estado error';
      estado.textContent = 'Faltan ' + fallos.length + (fallos.length === 1 ? ' respuesta obligatoria.' : ' respuestas obligatorias.');
      var primero = fallos[0];
      var foco = primero.querySelector ? (primero.querySelector('input,textarea,select') || primero) : primero;
      foco.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (foco.focus) foco.focus({ preventScroll: true });
      return;
    }

    var datos = recoger();
    var url = (window.CONFIG && CONFIG.endpoint) || '';

    if (!url) {
      estado.className = 'estado error';
      estado.textContent = 'El envío en línea todavía no está configurado. Descarga tus respuestas y hazlas llegar por otro medio.';
      descargar();
      return;
    }

    btnEnviar.disabled = true;
    estado.className = 'estado';
    estado.textContent = 'Enviando…';

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos)
    }).then(function () {
      form.hidden = true;
      gracias.hidden = false;
      gracias.scrollIntoView({ block: 'center', behavior: 'smooth' });
      var h = gracias.querySelector('.frase-gracias');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }).catch(function () {
      btnEnviar.disabled = false;
      estado.className = 'estado error';
      estado.textContent = 'No se pudo enviar. Descarga tus respuestas para no perderlas.';
      descargar();
    });
  });
})();
