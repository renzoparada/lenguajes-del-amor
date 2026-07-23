# Assets de marca para el PDF de "Los 5 Lenguajes del Amor"

El generador de PDF (`src/lib/love-language-pdf.ts`) busca automáticamente estos
archivos en esta carpeta. Si no existen, el PDF se genera igual mostrando solo
texto (nombre y "Emprendedores Makeover" en el pie de página).

Subí acá:

- `logo.png` (o `.jpg`) — logo de Emprendedores Makeover. Se muestra centrado
  en el encabezado, con una altura fija de 56pt, así que funciona mejor con
  fondo transparente y proporción no demasiado ancha (ideal: cuadrado o
  ligeramente horizontal, mínimo ~300px de alto).
- `firma.png` (o `.jpg` / `signature.png`) — tu firma, idealmente con fondo
  transparente (PNG). Se muestra en el pie de página con 40pt de alto.

No hace falta ningún cambio de código: apenas subas los archivos con estos
nombres exactos y hagas commit, el próximo PDF generado ya los va a incluir.
