# ReciclaBGA

Aplicación web 3D interactiva sobre el reciclaje, construida con **React**, **Vite**, **Three.js** y **Gemini AI**.

## Requisitos previos

- Node.js 20+
- Una API Key de [Google Gemini](https://aistudio.google.com/app/apikey)

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
# Editar .env y colocar tu GEMINI_API_KEY

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🚀 Despliegue gratuito

### Opción 1 — Vercel (recomendado, más rápido)

1. Crea una cuenta gratuita en [vercel.com](https://vercel.com)
2. Haz clic en **"Add New Project"** e importa este repositorio desde GitHub
3. En la sección **"Environment Variables"**, agrega:
   - `GEMINI_API_KEY` → tu API Key de Gemini
4. Haz clic en **"Deploy"** — ¡listo! Vercel detecta automáticamente que es un proyecto Vite.

> El archivo `vercel.json` ya está configurado en el repositorio.

---

### Opción 2 — Netlify

1. Crea una cuenta gratuita en [netlify.com](https://netlify.com)
2. Haz clic en **"Add new site"** → **"Import an existing project"** e importa desde GitHub
3. En **"Environment variables"**, agrega:
   - `GEMINI_API_KEY` → tu API Key de Gemini
4. Haz clic en **"Deploy site"** — Netlify detecta automáticamente la configuración de Vite.

> El archivo `netlify.toml` ya está configurado en el repositorio.

---

### Opción 3 — GitHub Pages

1. Ve a tu repositorio en GitHub → **Settings** → **Pages**
2. En **"Build and deployment"**, selecciona **"GitHub Actions"**
3. Ve a **Settings** → **Secrets and variables** → **Actions** y agrega:
   - `GEMINI_API_KEY` → tu API Key de Gemini
4. El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente en cada push a `main`
5. Tu app estará disponible en `https://<tu-usuario>.github.io/ReciclaBGA/`

---

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `GEMINI_API_KEY` | API Key de Google Gemini AI | ✅ Sí |

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Verificar tipos con TypeScript
```
