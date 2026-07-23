# Lenguajes del Amor

Test público (sin login) para descubrir el lenguaje del amor predominante,
inspirado en el marco de *Los 5 Lenguajes del Amor* de Gary Chapman. Parte de
Emprendedores Makeover.

- 25 preguntas originales (5 por lenguaje, escala 1-5).
- Al finalizar, calcula el porcentaje de cada lenguaje y muestra la
  interpretación del resultado (lenguaje principal + secundario).
- Guarda el resultado (nombre, email, puntajes) en la base de datos.
- Genera un PDF con diseño profesional (logo y firma de marca incluidos si
  están subidos a `public/brand/`) y lo envía automáticamente por email; el
  usuario también puede descargarlo directamente.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** vía **Prisma ORM** (driver adapter `@prisma/adapter-pg`)
- **pdf-lib** para generar el PDF del resultado
- **Resend** para el envío de emails (con fallback a consola sin API key)
- **Recharts** para el gráfico de resultados

## Desarrollo local

### 1. Requisitos

- Node.js 20+
- Una base de datos PostgreSQL (local, Docker, o un servicio como Neon/Supabase/Railway)

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editá `.env` con tu cadena de conexión (`DATABASE_URL`). `RESEND_API_KEY` y
`LOVE_LANGUAGES_FROM_EMAIL` son opcionales: sin `RESEND_API_KEY` los emails se
imprimen por consola en vez de enviarse.

### 3. Instalar dependencias y migrar la base de datos

```bash
npm install
npx prisma migrate dev
```

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Logo y firma en el PDF

Subí `logo.png` y `firma.png` (o `.jpg`) a `public/brand/` — instrucciones
detalladas en `public/brand/README.md`. Sin esos archivos, el PDF se genera
igual, solo que sin las imágenes de marca.

## Levantar todo con Docker (app + Postgres)

```bash
cp .env.example .env
docker compose up --build
```

## Desplegar en producción

### Vercel + base de datos administrada

1. Creá una base Postgres administrada (por ejemplo [Neon](https://neon.tech) o
   [Supabase](https://supabase.com)).
2. Importá el repositorio en [Vercel](https://vercel.com/new).
3. Configurá las variables de entorno `DATABASE_URL`, `RESEND_API_KEY` y
   `LOVE_LANGUAGES_FROM_EMAIL` en el proyecto.
4. Corré `npx prisma migrate deploy` apuntando a esa `DATABASE_URL` antes del
   primer deploy.

### Docker en cualquier VPS

Usá el `Dockerfile` y `docker-compose.yml` incluidos. El contenedor de la app
corre `prisma migrate deploy` automáticamente antes de arrancar.

## Estructura del proyecto

```
prisma/schema.prisma          Modelo de datos (LoveLanguageResult)
src/lib/love-languages.ts     Preguntas, scoring e interpretaciones
src/lib/love-language-pdf.ts  Generación del PDF
src/app/api/love-languages/   Endpoints (guardar resultado + descargar PDF)
src/components/               Quiz y componentes de UI reutilizables
public/brand/                 Logo y firma para el PDF (no incluidos por defecto)
```
