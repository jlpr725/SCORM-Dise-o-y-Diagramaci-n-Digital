/* ============================================================
   Comprobador final · Unidad 8
   Degrada sin errores si el marcado no está presente.
   ============================================================ */
(function () {
  'use strict';

  var caja = document.getElementById('comprobador');
  if (!caja) return;

  var casillas = [].slice.call(caja.querySelectorAll('input[type="checkbox"]'));
  var barra    = caja.querySelector('.comp-barra i');
  var msg      = caja.querySelector('.comp-msg');
  var total    = casillas.length;

  var mensajes = [
    { hasta: 0,   txt: 'Marca lo que ya tengas resuelto.' },
    { hasta: 0.34, txt: 'Vas empezando. Ninguna entrega se cierra en una tarde.' },
    { hasta: 0.67, txt: 'A mitad de camino. Sigue por lo que se arregla editando un estilo.' },
    { hasta: 0.99, txt: 'Ya casi. Lo que falta es lo que más se nota si se queda sin hacer.' }
  ];

  function refrescar() {
    var n = casillas.filter(function (c) { return c.checked; }).length;
    var p = n / total;

    barra.style.width = Math.round(p * 100) + '%';

    if (n === total) {
      msg.className = 'comp-msg listo';
      msg.textContent = 'Entrega completa. El proyecto está cerrado.';
    } else {
      msg.className = 'comp-msg';
      var m = mensajes[0].txt;
      for (var i = 0; i < mensajes.length; i++) {
        if (p <= mensajes[i].hasta) { m = mensajes[i].txt; break; }
      }
      if (n === 0) m = mensajes[0].txt;
      msg.textContent = n + ' de ' + total + '. ' + m;
    }
  }

  casillas.forEach(function (c) { c.addEventListener('change', refrescar); });
  refrescar();
})();
