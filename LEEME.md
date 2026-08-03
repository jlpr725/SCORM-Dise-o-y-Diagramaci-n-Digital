# Diseño y Diagramación Digital · Sitio de revisión

Versión web del material de estudio, pensada para que el equipo docente lo revise y deje retroalimentación.

**No es la versión para estudiantes.** Ellos reciben cada unidad como paquete SCORM en Moodle, semana a semana.

---

## Qué contiene

```
index.html              Portada y las ocho tarjetas
u01.html … u08.html     Las unidades
retroalimentacion.html  Formulario final
assets/                 Estilos, guiones y tipografías compartidas
vercel.json             Configuración de despliegue
```

Peso total: unos 720 KB. Todo funciona sin conexión una vez cargado; no llama a ningún servicio externo salvo el envío del formulario.

---

## Cómo funciona el avance

Al abrir el sitio solo está disponible la unidad 1. Una unidad se marca como revisada cuando se recorren sus siete secciones, y eso abre la siguiente.

El progreso se guarda **en el navegador de cada persona**. Si alguien cambia de equipo o borra los datos de navegación, vuelve a empezar.

### Enlace para el equipo docente

Si quieres que tus colegas puedan entrar directo a cualquier unidad sin recorrerlas en orden, compárteles esta variante:

```
https://tu-sitio.vercel.app/?docente=1
```

Ese parámetro desbloquea las ocho durante la sesión. Es útil porque quien revisa necesita saltar, no avanzar.

---

## Publicar el sitio

### Vercel (recomendado)

1. Sube la carpeta a un repositorio de GitHub.
2. En vercel.com, **Add New → Project** e importa el repositorio.
3. En Framework Preset elige **Other**. No hay nada que compilar.
4. Deploy.

### GitHub Pages

1. Sube la carpeta a un repositorio.
2. Settings → Pages → Source: la rama principal, carpeta raíz.
3. El archivo `.nojekyll` ya está incluido y evita que se ignoren carpetas.

### Netlify

Arrastra la carpeta a app.netlify.com/drop. Queda publicada en segundos.

---

## Conectar el formulario con Google Sheets

Mientras no configures esto, el formulario funciona igual pero en vez de enviar ofrece **descargar las respuestas** en un archivo de texto. Nadie pierde su trabajo.

### 1. Crea la hoja

Crea una hoja de cálculo nueva en Google Sheets. Llámala como quieras. **Déjala privada**: nadie más necesita acceso.

### 2. Abre el editor de secuencias de comandos

En la hoja: **Extensiones → Apps Script**.

### 3. Pega este código

Borra lo que haya y pega esto:

```javascript
const CLAVE = 'ddd-2026';

function doPost(e) {
  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(20000);

  try {
    const datos = JSON.parse(e.postData.contents);

    if (datos.clave !== CLAVE) {
      return ContentService.createTextOutput('rechazado');
    }

    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    const columnas = [
      'enviado', 'nombre', 'area', 'anios', 'alcance',
      'esc_claridad', 'esc_profundidad', 'esc_rigor', 'esc_progresion',
      'esc_ilustraciones', 'esc_diseno', 'esc_practica', 'esc_evaluacion',
      'mejor', 'falta', 'sobra',
      'mas_fuerte', 'mas_debil', 'porque_debil',
      'carga', 'tono', 'secuencia', 'error_detectado',
      'usaria', 'prioridad', 'libre'
    ];

    // Encabezados la primera vez
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(columnas);
      hoja.getRange(1, 1, 1, columnas.length)
          .setFontWeight('bold')
          .setBackground('#EDEDFB');
      hoja.setFrozenRows(1);
    }

    const fila = columnas.map(function (c) {
      const v = datos[c];
      return v === undefined ? '' : String(v).slice(0, 2000);
    });

    hoja.appendRow(fila);
    return ContentService.createTextOutput('ok');

  } catch (error) {
    return ContentService.createTextOutput('error');
  } finally {
    bloqueo.releaseLock();
  }
}
```

### 4. Publica el script

1. Botón **Implementar → Nueva implementación**.
2. En el engranaje, elige **Aplicación web**.
3. Configura así:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
4. **Implementar**. Autoriza cuando lo pida (va a advertir que la app no está verificada; es tuya, continúa).
5. Copia la **URL de la aplicación web**.

### 5. Pega la URL en el sitio

Abre `assets/js/config.js` y pega la URL:

```javascript
var CONFIG = {
  endpoint: 'https://script.google.com/macros/s/AKfy.../exec',
  clave: 'ddd-2026'
};
```

Vuelve a publicar el sitio y listo.

---

## Sobre la seguridad

Alguien podría ver la URL del script en el código y mandar datos falsos. **No puede leer tu hoja**: el script solo escribe.

La constante `CLAVE` filtra envíos que no vengan de tu formulario. Si quieres endurecerlo, cámbiala por algo menos evidente en los dos archivos —`config.js` y el script— y vuelve a implementar.

Para un curso, con esto sobra.

---

## Aviso de tratamiento de datos

El formulario recoge nombre, área de enseñanza y respuestas. Eso son datos personales, así que el propio formulario incluye un aviso visible que explica qué se guarda, para qué y quién lo ve.

Si vas a conservar las respuestas más allá de la revisión, lo correcto es avisarlo también.

---

## Mantenimiento

**Actualizar una unidad.** Reemplaza el `.html` correspondiente. No toques `assets/`: es compartido.

**Cambiar las preguntas del formulario.** Están en `retroalimentacion.html`. Si agregas un campo, añádelo también a la lista `columnas` del Apps Script, en el mismo orden.

**Cambiar las dimensiones de valoración.** Están en el arreglo `DIMENSIONES` de `assets/js/formulario.js`.

---

D&Dd SCORM v1.0 · Designed by @joselopantoja
