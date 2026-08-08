/* ============================================================
   Estudiantes autorizados y calendario del curso
   ------------------------------------------------------------
   Este archivo lo edita el docente a mano, localmente, antes de
   publicar el sitio (o cada vez que cambie de grupo).

   1) ESTUDIANTES: un correo por línea, entre comillas y con coma
      al final de cada uno menos el último.
   2) ENDPOINT_UNIDADES: la URL que te da Google Apps Script al
      publicar tu Sheet de control como aplicación web (termina
      en /exec). Ahí es donde marcas, con checkbox, qué unidades
      están activas para todos.
   ============================================================ */

var ESTUDIANTES = [
  'joselo@app.com',
  'achly.mejia@cun.edu.co',
  'andrea.pinzon@cun.edu.co',
  'andres.erazov@cun.edu.co',
  'andres.valbuenaa@cun.edu.co',
  'angelica.poloche@cun.edu.co',
  'angelica.guina@cun.edu.co',
  'angie.martinezqui@cun.edu.co',
  'brandon.ortizl@cun.edu.co',
  'brayan.vasquezgar@cun.edu.co',
  'brayan.gomeza@cun.edu.co',
  'briyith.chantre@cun.edu.co',
  'carlos.garciaala@cun.edu.co',
  'carlos.ortizv@cun.edu.co',
  'carlos.meza01@cun.edu.co',
  'cesar.arias@cun.edu.co',
  'cristhian.plazasb@cun.edu.co',
  'cristian.gonzalezfon@cun.edu.co',
  'danna.villotag@cun.edu.co',
  'eliana.pava@cun.edu.co',
  'esteban.navarrov@cun.edu.co',
  'fabio.perezo@cun.edu.co',
  'ingrid.ruiz@cun.edu.co',
  'ingrid.molanos@cun.edu.co',
  'ingrid.zarate@cun.edu.co',
  'izyzharick.rosero@cun.edu.co',
  'jeison.vasquez@cun.edu.co',
  'jenifer.torresc@cun.edu.co',
  'jessica.camargol@cun.edu.co',
  'jesus.funez@cun.edu.co',
  'jesus.vizcaya@cun.edu.co',
  'jhoiner.toncel@cun.edu.co',
  'johana.rodriguez@cun.edu.co',
  'johana.pinilla@cun.edu.co',
  'juan.duque@cun.edu.co',
  'juan.garciafon@cun.edu.co',
  'karen.burgosv@cun.edu.co',
  'karen.bernalmar@cun.edu.co',
  'karol.santamaria@cun.edu.co',
  'karoll.contento@cun.edu.co',
  'laura.belloc@cun.edu.co',
  'laura.rodriguezver@cun.edu.co',
  'leydi.sancheza@cun.edu.co',
  'lineth.valdes@cun.edu.co',
  'luis.colina@cun.edu.co',
  'luis.reyes@cun.edu.co',
  'maikol.paez@cun.edu.co',
  'maria.dazap@cun.edu.co',
  'maria.roldanc@cun.edu.co',
  'maria.castillal@cun.edu.co',
  'maryori.espinosa@cun.edu.co',
  'miguel.lozadac@cun.edu.co',
  'nicol.pachon@cun.edu.co',
  'nicolas.rojasaal@cun.edu.co',
  'noreida.medina@cun.edu.co',
  'omaira.ascanio@cun.edu.co',
  'oscar.rodriguezviv@cun.edu.co',
  'paula.cardenasv@cun.edu.co',
  'paula.guerrero@cun.edu.co',
  'samuel.salazar@cun.edu.co',
  'samuel.avila@cun.edu.co',
  'sara.sanchezl@cun.edu.co',
  'sebastian.ninov@cun.edu.co',
  'sergio.alvarezr@cun.edu.co',
  'sharon.salas@cun.edu.co',
  'sofia.garcial@cun.edu.co',
  'valeria.hernandezv@cun.edu.co',
  'valerie.garcia@cun.edu.co',
  'yinna.martinez@cun.edu.co',
  'yohan.pinzon@cun.edu.co',
  'yuliane.mena@cun.edu.co',
  'yusseli.pernia@cun.edu.co',
  'mateo.diazm@cun.edu.co',
  'christopher.martinez@cun.edu.co'
  // agrega aquí el resto de tu lista, uno por línea
];

var ENDPOINT_UNIDADES = 'https://script.google.com/macros/s/AKfycbz0cSk5hp2mqT6-SzWKdpUaFTLXYe6URpHXZakqBFRRZMeqIB__Nfmj_epeX7BVFI_x/exec';
