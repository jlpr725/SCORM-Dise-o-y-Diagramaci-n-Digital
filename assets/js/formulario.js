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

  /* ---------- Acceso a campos ---------- */
  function campo(nombre) {
    return form.elements[nombre] || document.getElementById(nombre) || null;
  }
  function valor(nombre) {
    var c = campo(nombre);
    return c && typeof c.value === 'string' ? c.value.trim() : '';
  }

  /* ---------- Recoger ---------- */
  function recoger() {
    var d = {
      enviado: new Date().toISOString(),
      clave: (window.CONFIG && CONFIG.clave) || '',
      nombre: valor('nombre'),
      alcance: valorRadio('alcance'),
      mejor: valor('mejor'),
      falta: valor('falta'),
      sobra: valor('sobra'),
      mas_fuerte: valor('mas_fuerte'),
      mas_debil: valor('mas_debil'),
      porque_debil: valor('porque_debil'),
      carga: valorRadio('carga'),
      tono: valorRadio('tono'),
      secuencia: valor('secuencia'),
      error_detectado: valor('error'),
      usaria: valorRadio('usaria'),
      prioridad: valor('prioridad'),
      libre: valor('libre')
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

    ['nombre', 'mejor', 'falta', 'prioridad'].forEach(function (n) {
      var c = campo(n);
      if (c && !c.value.trim()) {
        var cont = c.closest('.campo');
        if (cont) cont.classList.add('falla');
        fallos.push(c);
      }
    });

    ['alcance', 'carga', 'tono', 'usaria'].forEach(function (n) {
      if (!valorRadio(n)) {
        var primerRadio = form.querySelector('input[name="' + n + '"]');
        var grupo = primerRadio && primerRadio.closest('.campo');
        if (grupo) {
          grupo.classList.add('falla');
          fallos.push(grupo);
        }
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
      ['Nombre', d.nombre], ['Alcance revisado', d.alcance]
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

  /* ---------- Panel de resultado ---------- */
  function mostrarPanel(tipo, rotulo, frase, coda, conDescarga) {
    form.hidden = true;
    gracias.hidden = false;
    gracias.className = 'gracias ' + tipo;
    gracias.querySelector('.rot-gracias').textContent = rotulo;
    gracias.querySelector('.frase-gracias').textContent = frase;
    gracias.querySelector('.coda-gracias').innerHTML = coda;

    var btnD = document.getElementById('btn-descargar-2');
    if (btnD) btnD.hidden = !conDescarga;

    gracias.scrollIntoView({ block: 'center', behavior: 'smooth' });
    var h = gracias.querySelector('.frase-gracias');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  /* ---------- Enviar ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fallos = validar();
    if (fallos.length) {
      estado.className = 'estado error';
      estado.textContent = 'Faltan ' + fallos.length +
        (fallos.length === 1 ? ' respuesta obligatoria.' : ' respuestas obligatorias.') +
        ' Están marcadas en rojo.';
      var primero = fallos[0];
      var foco = primero.querySelector ? (primero.querySelector('input,textarea,select') || primero) : primero;
      foco.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (foco.focus) foco.focus({ preventScroll: true });
      return;
    }

    var datos = recoger();
    var url = (window.CONFIG && CONFIG.endpoint) || '';

    /* Caso 1 · Todavía no hay endpoint configurado */
    if (!url) {
      guardarCopia(datos);
      mostrarPanel(
        'aviso',
        'Respuestas registradas en este equipo',
        'El envío automático todavía no está conectado.',
        'Tus respuestas quedaron guardadas y no se han perdido. Descárgalas con el botón de abajo y hazlas llegar por el medio que prefieras. <br><span class="tec">Para activar el envío directo a la hoja de cálculo, sigue las instrucciones del archivo LEEME.</span>',
        true
      );
      return;
    }

    /* Caso 2 · Envío real */
    btnEnviar.disabled = true;
    estado.className = 'estado';
    estado.textContent = 'Enviando…';

    var terminado = false;
    var reloj = setTimeout(function () {
      if (!terminado) { terminado = true; falloEnvio(datos); }
    }, 12000);

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos)
    }).then(function () {
      if (terminado) return;
      terminado = true;
      clearTimeout(reloj);
      mostrarPanel(
        'ok',
        'Retroalimentación recibida',
        'Gracias. Esto es exactamente lo que hace que el material mejore.',
        'Tus respuestas quedaron registradas. Si quieres conservar una copia, puedes descargarla.',
        true
      );
    }).catch(function () {
      if (terminado) return;
      terminado = true;
      clearTimeout(reloj);
      falloEnvio(datos);
    });
  });

  function falloEnvio(datos) {
    guardarCopia(datos);
    btnEnviar.disabled = false;
    mostrarPanel(
      'error',
      'No se pudo enviar',
      'Hubo un problema de conexión con el servidor.',
      'Tus respuestas <strong>no se perdieron</strong>: quedaron guardadas en este equipo. Descárgalas con el botón de abajo y hazlas llegar por otro medio.',
      true
    );
  }

  /* Copia de seguridad en el propio navegador */
  function guardarCopia(datos) {
    try { localStorage.setItem('ddd_retro_borrador', JSON.stringify(datos)); } catch (e) { /* nada */ }
  }

  /* Si hay un borrador previo, avisar al cargar */
  (function () {
    try {
      var b = localStorage.getItem('ddd_retro_borrador');
      if (b) {
        var d = JSON.parse(b);
        estado.className = 'estado';
        estado.textContent = 'Hay una respuesta guardada en este equipo a nombre de ' + (d.nombre || 'alguien') + '.';
      }
    } catch (e) { /* nada */ }
  })();

})();
