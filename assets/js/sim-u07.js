/* ============================================================
   Simulaciones interactivas · Unidad 7
   Todas degradan sin errores si falta su marcado en la página.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1 · Explorador de archivos ---------- */
  var explorador = (function () {
    var caja = document.getElementById('sim-explorador');
    if (!caja) return;

    var lista  = caja.querySelector('.expl-lista');
    var aviso  = caja.querySelector('.expl-aviso');
    var boton  = caja.querySelector('.expl-btn');
    var ordenado = false;

    var desordenado = [
      { n: 'Portafolio FINAL.indd',              m: 'mal' },
      { n: 'portafolio v2.indd',                 m: 'mal' },
      { n: 'Diseño final (copia).indd',          m: 'mal' },
      { n: 'portafolio v10.indd',                m: 'mal' },
      { n: 'portafolio v7 REVISADO.indd',        m: 'mal' },
      { n: 'PORTAFOLIO_definitivo_bueno.indd',   m: 'mal' }
    ];

    var limpio = [
      { n: 'portafolio_perez-juan_v02.indd', m: 'bien' },
      { n: 'portafolio_perez-juan_v07.indd', m: 'bien' },
      { n: 'portafolio_perez-juan_v08.indd', m: 'bien' },
      { n: 'portafolio_perez-juan_v09.indd', m: 'bien' },
      { n: 'portafolio_perez-juan_v10.indd', m: 'bien' },
      { n: 'portafolio_perez-juan_v11.indd', m: 'bien' }
    ];

    function pintar(datos) {
      lista.innerHTML = '';
      datos.forEach(function (f) {
        var fila = document.createElement('div');
        fila.className = 'fila';
        var ico = document.createElement('span');
        ico.className = 'ico';
        ico.setAttribute('aria-hidden', 'true');
        var nom = document.createElement('span');
        nom.className = 'nom';
        nom.textContent = f.n;
        fila.appendChild(ico);
        fila.appendChild(nom);
        lista.appendChild(fila);
      });
    }

    function refrescar() {
      if (ordenado) {
        pintar(limpio);
        aviso.className = 'aviso bien expl-aviso';
        aviso.textContent = 'Ordenados por nombre, quedan en orden cronológico real. La v10 va después de la v09 porque los números tienen dos dígitos. Y sabes de quién es cada archivo sin abrirlo.';
        boton.textContent = 'Ver los nombres descuidados';
      } else {
        pintar(desordenado);
        aviso.className = 'aviso mal expl-aviso';
        aviso.textContent = 'Ordenados por nombre, el sistema pone la v10 antes que la v2 y la v7. Hay tres archivos que dicen ser el último y ninguno dice de quién es. Para saber cuál sirve hay que abrirlos todos.';
        boton.textContent = 'Aplicar la convención de nombres';
      }
    }

    boton.addEventListener('click', function () {
      ordenado = !ordenado;
      refrescar();
    });

    refrescar();
  })();

  /* ---------- 2 · Panel de comprobación preliminar ---------- */
  var preflight = (function () {
    var caja = document.getElementById('sim-preflight');
    if (!caja) return;

    var estado  = caja.querySelector('.pref-est');
    var items   = [].slice.call(caja.querySelectorAll('.pref-item'));
    var reinic  = caja.querySelector('.pref-reset');

    function contar() {
      var quedan = items.filter(function (b) {
        return !b.classList.contains('resuelto');
      }).length;

      if (quedan === 0) {
        estado.className = 'pref-est ok';
        estado.querySelector('.pref-txt').textContent =
          'Sin errores. El archivo está listo para empaquetar.';
      } else {
        estado.className = 'pref-est hay';
        estado.querySelector('.pref-txt').textContent =
          quedan + (quedan === 1 ? ' error encontrado' : ' errores encontrados');
      }
    }

    items.forEach(function (btn) {
      var det = document.getElementById(btn.getAttribute('aria-controls'));

      btn.addEventListener('click', function () {
        var abierto = btn.getAttribute('aria-expanded') === 'true';
        items.forEach(function (o) {
          o.setAttribute('aria-expanded', 'false');
          var d = document.getElementById(o.getAttribute('aria-controls'));
          if (d) d.hidden = true;
        });
        if (!abierto) {
          btn.setAttribute('aria-expanded', 'true');
          if (det) det.hidden = false;
        }
      });

      if (det) {
        var arreglar = det.querySelector('.pref-fix');
        if (arreglar) {
          arreglar.addEventListener('click', function () {
            btn.classList.add('resuelto');
            btn.querySelector('.sig').textContent = '\u2713';
            arreglar.disabled = true;
            arreglar.textContent = 'Corregido';
            contar();
          });
        }
      }
    });

    if (reinic) {
      reinic.addEventListener('click', function () {
        items.forEach(function (btn) {
          btn.classList.remove('resuelto');
          btn.querySelector('.sig').textContent = '!';
          btn.setAttribute('aria-expanded', 'false');
          var det = document.getElementById(btn.getAttribute('aria-controls'));
          if (det) {
            det.hidden = true;
            var f = det.querySelector('.pref-fix');
            if (f) { f.disabled = false; f.textContent = 'Corregir'; }
          }
        });
        contar();
      });
    }

    contar();
  })();

  /* ---------- 3 · Comentarios tipo Figma ---------- */
  var comentarios = (function () {
    var caja = document.getElementById('sim-figma');
    if (!caja) return;

    var pines = [].slice.call(caja.querySelectorAll('.fig-pin'));

    pines.forEach(function (pin) {
      var det = document.getElementById(pin.getAttribute('aria-controls'));

      pin.addEventListener('click', function () {
        var abierto = pin.getAttribute('aria-expanded') === 'true';
        pines.forEach(function (o) {
          o.setAttribute('aria-expanded', 'false');
          var d = document.getElementById(o.getAttribute('aria-controls'));
          if (d) d.hidden = true;
        });
        if (!abierto) {
          pin.setAttribute('aria-expanded', 'true');
          if (det) det.hidden = false;
        }
      });
    });
  })();

})();
