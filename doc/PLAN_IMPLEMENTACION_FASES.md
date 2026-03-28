# 🚀 Plan de Implementación por Fases
## Fullstack TypeScript · Next.js 14 · GitHub · Vercel · JSON-DB

> **Documento:** Plan de Implementación  
> **Referencia:** Plan de Infraestructura v1.0  
> **Stack:** Next.js 14 · TypeScript 5 · Tailwind CSS · Vercel  
> **Metodología:** Entrega incremental — cada fase produce un artefacto funcional y desplegable  

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Mapa de Fases](#2-mapa-de-fases)
3. [Fase 0 — Prerequisitos y Entorno](#3-fase-0--prerequisitos-y-entorno)
4. [Fase 1 — Inicialización del Proyecto](#4-fase-1--inicialización-del-proyecto)
5. [Fase 2 — Capa de Datos JSON-DB](#5-fase-2--capa-de-datos-json-db)
6. [Fase 3 — Implementación del Home](#6-fase-3--implementación-del-home)
7. [Fase 4 — Integración CI/CD con Vercel](#7-fase-4--integración-cicd-con-vercel)
8. [Fase 5 — Validación y Pruebas](#8-fase-5--validación-y-pruebas)
9. [Criterios de Éxito Globales](#9-criterios-de-éxito-globales)
10. [Control de Riesgos](#10-control-de-riesgos)
11. [Glosario](#11-glosario)

---

## 1. Resumen Ejecutivo

Este documento traduce el **Plan de Infraestructura** en pasos de acción concretos, ordenados por fases de entrega. Cada fase tiene un objetivo claro, entregables verificables y criterios de aceptación que deben cumplirse antes de avanzar a la siguiente.

**Principio guía:** ninguna fase se considera completa hasta que su entregable esté funcionando tanto en entorno local como en producción (Vercel).

**Duración estimada total:** 3–5 horas para un desarrollador familiarizado con el stack.

| Fase | Nombre | Duración estimada | Entregable |
|------|--------|-------------------|------------|
| 0 | Prerequisitos y Entorno | 20 min | Entorno listo para desarrollo |
| 1 | Inicialización del Proyecto | 30 min | Repositorio base en GitHub |
| 2 | Capa de Datos JSON-DB | 40 min | Módulo `db.ts` + esquemas JSON |
| 3 | Implementación del Home | 60 min | "Hola Mundo" animado en local |
| 4 | Integración CI/CD con Vercel | 30 min | URL de producción activa |
| 5 | Validación y Pruebas | 30 min | Sistema certificado y documentado |

---

## 2. Mapa de Fases

```
FASE 0              FASE 1              FASE 2
Prerequisitos  ───► Inicialización ───► JSON-DB
(entorno)           (repo + config)     (capa de datos)
                                              │
                                              ▼
FASE 5              FASE 4              FASE 3
Validación    ◄─── CI/CD Vercel  ◄─── Home UI
(certificación)     (deploy auto)       (Hola Mundo)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Flujo de datos en producción:

/data/*.json ──► lib/db.ts ──► app/page.tsx ──► components/HolaMundo.tsx
     (JSON-DB)    (tipado)     (Server Comp.)     (Client Comp. animado)
```

---

## 3. Fase 0 — Prerequisitos y Entorno

### Objetivo
Verificar que el entorno de desarrollo local cuenta con todas las herramientas necesarias antes de tocar código.

### 3.1 Software requerido

| Herramienta | Versión mínima | Cómo verificar | Cómo instalar |
|-------------|---------------|----------------|---------------|
| Node.js | 20.x LTS | `node --version` | [nodejs.org](https://nodejs.org) |
| pnpm | 9.x | `pnpm --version` | `npm install -g pnpm` |
| Git | 2.x | `git --version` | [git-scm.com](https://git-scm.com) |
| VS Code (recomendado) | Cualquiera | — | [code.visualstudio.com](https://code.visualstudio.com) |

### 3.2 Extensiones VS Code recomendadas

```
Prettier - Code formatter     (esbenp.prettier-vscode)
ESLint                        (dbaeumer.vscode-eslint)
Tailwind CSS IntelliSense     (bradlc.vscode-tailwindcss)
TypeScript Vue Plugin         (vue.vscode-typescript-vue-plugin)
Error Lens                    (usernamehakobyan.error-lens)
```

### 3.3 Cuentas requeridas

- **GitHub** — con repositorio creado (público o privado).
- **Vercel** — cuenta activa vinculada a la cuenta de GitHub.

### 3.4 Verificación del entorno

Ejecutar el siguiente bloque completo. Si todos los comandos responden sin error, el entorno está listo:

```bash
node --version    # debe mostrar v20.x.x
pnpm --version    # debe mostrar 9.x.x
git --version     # debe mostrar git version 2.x.x
git config user.name    # debe mostrar tu nombre
git config user.email   # debe mostrar tu correo de GitHub
```

### Criterio de aceptación — Fase 0
> ✅ Todos los comandos de verificación responden correctamente y las cuentas de GitHub y Vercel están activas y vinculadas entre sí.

---

## 4. Fase 1 — Inicialización del Proyecto

### Objetivo
Crear el repositorio en GitHub, inicializar el proyecto Next.js con TypeScript y establecer toda la configuración base del sistema.

### 4.1 Crear el repositorio en GitHub

1. Ir a [github.com/new](https://github.com/new)
2. Nombre sugerido: `mi-proyecto-ts` (sin espacios ni caracteres especiales)
3. Descripción: `Fullstack TypeScript · Next.js · Vercel · JSON-DB`
4. Visibilidad: privado o público (indistinto para Vercel)
5. **No** inicializar con README, `.gitignore` ni licencia (se generan con el scaffolding)
6. Copiar la URL del repositorio vacío: `https://github.com/usuario/mi-proyecto-ts.git`

### 4.2 Inicializar el proyecto Next.js

```bash
# 1. Crear el proyecto con scaffolding oficial
pnpm create next-app@latest mi-proyecto-ts \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint

# 2. Entrar al directorio
cd mi-proyecto-ts

# 3. Instalar dependencias adicionales del stack
pnpm add framer-motion
pnpm add -D prettier eslint eslint-config-next @typescript-eslint/eslint-plugin
```

### 4.3 Configurar TypeScript estricto

Reemplazar el contenido de `tsconfig.json` con la configuración estricta del plan:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4.4 Configurar ESLint y Prettier

Crear `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error"
  }
}
```

Crear `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 4.5 Configurar `.gitignore`

Reemplazar el `.gitignore` generado con:

```gitignore
# Dependencias
node_modules/
.pnpm-store/

# Build
.next/
out/

# Variables de entorno
.env
.env.local
.env.*.local

# Sistema operativo
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/settings.json

# Vercel
.vercel
```

### 4.6 Configurar `vercel.json`

Crear en la raíz del proyecto:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### 4.7 Configurar `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 4.8 Crear `.env.example` y `.env.local`

`.env.example` (incluir en Git):

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0
```

`.env.local` (NO incluir en Git — copiar de `.env.example` y ajustar):

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 4.9 Vincular con GitHub

```bash
# Inicializar Git en el proyecto
git init

# Agregar todos los archivos al staging
git add .

# Primer commit
git commit -m "chore: init Next.js 14 TypeScript project"

# Vincular al repositorio remoto creado en el paso 4.1
git remote add origin https://github.com/usuario/mi-proyecto-ts.git

# Push inicial
git branch -M main
git push -u origin main
```

### 4.10 Verificar que el proyecto corre en local

```bash
pnpm dev
```

Abrir `http://localhost:3000` y confirmar que la página por defecto de Next.js carga sin errores.

### Criterio de aceptación — Fase 1
> ✅ El repositorio existe en GitHub con el código inicial. `pnpm dev` corre sin errores. `pnpm tsc --noEmit` no reporta problemas de tipos.

---

## 5. Fase 2 — Capa de Datos JSON-DB

### Objetivo
Construir la infraestructura de datos basada en archivos JSON que reemplaza la base de datos convencional. Esta fase establece los esquemas, las interfaces TypeScript y el módulo de acceso a datos.

### 5.1 Crear la estructura de carpetas

```bash
# Crear carpetas necesarias
mkdir -p data
mkdir -p lib
mkdir -p components/ui
```

### 5.2 Crear los archivos JSON iniciales

**`data/site.json`** — Configuración general del sitio:

```json
{
  "name": "Mi Proyecto",
  "description": "Fullstack TypeScript con Next.js y Vercel",
  "version": "1.0.0",
  "author": "Tu Nombre",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**`data/content.json`** — Contenido dinámico de las páginas:

```json
{
  "home": {
    "greeting": "Hola Mundo",
    "subtitle": "TypeScript · Next.js · Vercel",
    "description": "Sistema fullstack funcionando correctamente"
  }
}
```

**`data/README.md`** — Documentación del esquema (para el equipo):

```markdown
# /data — Capa de Datos JSON-DB

Esta carpeta actúa como base de datos de solo lectura en producción.
Cada archivo `.json` representa una colección o tabla.

## Colecciones disponibles

| Archivo | Descripción | Interfaz TypeScript |
|---------|-------------|---------------------|
| `site.json` | Configuración general | `SiteConfig` |
| `content.json` | Contenido por página | `SiteContent` |

## Reglas de uso

- En **desarrollo local**: lectura y escritura permitidas via `lib/db.ts`
- En **producción (Vercel)**: solo lectura
- Para agregar una nueva colección: crear el archivo JSON + su interfaz en `lib/types.ts`
```

### 5.3 Crear las interfaces TypeScript

**`lib/types.ts`**:

```typescript
// lib/types.ts
// Interfaces TypeScript que modelan los esquemas JSON de /data

// ─── Colección: site.json ─────────────────────────────────────
export interface SiteConfig {
  name: string;
  description: string;
  version: string;
  author: string;
  createdAt: string;
}

// ─── Colección: content.json ──────────────────────────────────
export interface HomeContent {
  greeting: string;
  subtitle: string;
  description: string;
}

export interface SiteContent {
  home: HomeContent;
}

// ─── Mapa de colecciones (para tipado dinámico en db.ts) ──────
export interface CollectionMap {
  site: SiteConfig;
  content: SiteContent;
}

export type CollectionName = keyof CollectionMap;
```

### 5.4 Crear el módulo de acceso a datos

**`lib/db.ts`**:

```typescript
// lib/db.ts
// Módulo de acceso a la capa de datos JSON-DB

import fs from "fs";
import path from "path";
import type { CollectionMap, CollectionName } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Lee una colección JSON de /data con tipado automático.
 *
 * @example
 * const site = await readCollection("site");
 * // tipo inferido: SiteConfig
 */
export async function readCollection<K extends CollectionName>(
  collection: K
): Promise<CollectionMap[K]> {
  const filePath = path.join(DATA_DIR, `${collection}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[JSON-DB] Colección "${collection}" no encontrada en /data/${collection}.json`
    );
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as CollectionMap[K];
  } catch (error) {
    throw new Error(
      `[JSON-DB] Error al parsear "${collection}.json": ${String(error)}`
    );
  }
}

/**
 * Escribe datos en una colección JSON de /data.
 * ⚠️ Solo disponible en desarrollo local. Lanza error en producción.
 *
 * @example
 * await writeCollection("site", { name: "Nuevo nombre", ... });
 */
export async function writeCollection<K extends CollectionName>(
  collection: K,
  data: CollectionMap[K]
): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[JSON-DB] Escritura no permitida en producción. Use el repositorio Git para actualizar datos."
    );
  }

  const filePath = path.join(DATA_DIR, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Lista todas las colecciones disponibles en /data.
 * Útil para debugging.
 */
export function listCollections(): string[] {
  return fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));
}
```

### 5.5 Crear la API Route de datos

**`app/api/data/route.ts`** — Endpoint que expone las colecciones:

```typescript
// app/api/data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readCollection, listCollections } from "@/lib/db";
import type { CollectionName } from "@/lib/types";

// GET /api/data?collection=site
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection") as CollectionName | null;

  // Sin parámetro → listar colecciones disponibles
  if (!collection) {
    const collections = listCollections();
    return NextResponse.json({ collections });
  }

  try {
    const data = await readCollection(collection);
    return NextResponse.json({ collection, data });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 404 }
    );
  }
}
```

### 5.6 Verificar la capa de datos

```bash
# Arrancar el servidor de desarrollo
pnpm dev

# En otra terminal, probar el endpoint
curl http://localhost:3000/api/data
# Debe responder: { "collections": ["site", "content"] }

curl http://localhost:3000/api/data?collection=site
# Debe responder: { "collection": "site", "data": { "name": "Mi Proyecto", ... } }

curl http://localhost:3000/api/data?collection=content
# Debe responder: { "collection": "content", "data": { "home": { ... } } }
```

### 5.7 Commit de la fase

```bash
git add .
git commit -m "feat(data): add JSON-DB layer with typed collections and API route"
git push origin main
```

### Criterio de aceptación — Fase 2
> ✅ Los tres endpoints de `/api/data` responden correctamente. `pnpm tsc --noEmit` pasa sin errores. Los tipos `CollectionMap` garantizan que el acceso a colecciones inexistentes falle en tiempo de compilación.

---

## 6. Fase 3 — Implementación del Home

### Objetivo
Construir la página principal con el texto "Hola Mundo" centrado, animaciones elegantes y validación visual del funcionamiento de TypeScript. Todo el contenido se lee dinámicamente desde `/data/content.json`.

### 6.1 Configurar Tailwind con animaciones personalizadas

Reemplazar el contenido de `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.3)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 6.2 Crear los estilos globales

Reemplazar `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #030712;
  --foreground: #f9fafb;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  margin: 0;
  padding: 0;
}

/* Resplandor radial sutil de fondo */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: radial-gradient(
    ellipse at 50% 40%,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(168, 85, 247, 0.04) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

/* Asegurar que el contenido quede sobre el pseudo-elemento */
main {
  position: relative;
  z-index: 1;
}
```

### 6.3 Crear el layout raíz

Reemplazar `app/layout.tsx`:

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Proyecto · TypeScript + Next.js",
  description: "Fullstack TypeScript con Next.js 14 y Vercel",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

### 6.4 Crear el componente HolaMundo

Crear `components/HolaMundo.tsx`:

```typescript
// components/HolaMundo.tsx
"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/types";

interface HolaMundoProps extends HomeContent {}

export default function HolaMundo({
  greeting,
  subtitle,
  description,
}: HolaMundoProps) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const baseTransition =
    "transition-all duration-1000 ease-out";
  const hidden = "opacity-0 translate-y-8";
  const shown = "opacity-100 translate-y-0";

  return (
    <div className="text-center px-6 select-none">

      {/* Título principal — gradiente + glow pulsante */}
      <h1
        className={`
          text-7xl md:text-9xl font-bold tracking-tight
          text-transparent bg-clip-text
          bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
          animate-glow-pulse
          ${baseTransition} ${visible ? shown : hidden}
        `}
        style={{ transitionDelay: "0ms" }}
      >
        {greeting}
      </h1>

      {/* Línea decorativa */}
      <div
        className={`
          mx-auto mt-6 h-px w-48
          bg-gradient-to-r from-transparent via-indigo-500 to-transparent
          ${baseTransition} ${visible ? shown : hidden}
        `}
        style={{ transitionDelay: "150ms" }}
      />

      {/* Subtítulo en fuente mono */}
      <p
        className={`
          mt-6 text-lg md:text-xl font-mono
          text-indigo-300/80 tracking-[0.25em] uppercase
          ${baseTransition} ${visible ? shown : hidden}
        `}
        style={{ transitionDelay: "250ms" }}
      >
        {subtitle}
      </p>

      {/* Descripción */}
      <p
        className={`
          mt-4 text-sm md:text-base
          text-gray-400 max-w-sm mx-auto leading-relaxed
          ${baseTransition} ${visible ? shown : hidden}
        `}
        style={{ transitionDelay: "400ms" }}
      >
        {description}
      </p>

      {/* Badge de estado — TypeScript operacional */}
      <div
        className={`
          mt-10 inline-flex items-center gap-2.5 px-5 py-2.5
          rounded-full border border-indigo-500/25
          bg-indigo-950/60 backdrop-blur-sm
          shadow-lg shadow-indigo-950/50
          ${baseTransition} ${visible ? shown : hidden}
        `}
        style={{ transitionDelay: "600ms" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
        </span>
        <span className="text-xs font-mono text-indigo-300 tracking-wider">
          TypeScript · Operacional
        </span>
      </div>

      {/* Versión del sistema */}
      <p
        className={`
          mt-6 text-xs font-mono text-gray-600
          ${baseTransition} ${visible ? shown : hidden}
        `}
        style={{ transitionDelay: "800ms" }}
      >
        next.js 14 · typescript 5 · vercel
      </p>
    </div>
  );
}
```

### 6.5 Crear la página principal (Server Component)

Reemplazar `app/page.tsx`:

```typescript
// app/page.tsx
import { readCollection } from "@/lib/db";
import type { SiteContent } from "@/lib/types";
import HolaMundo from "@/components/HolaMundo";

// Forzar renderizado dinámico para leer el JSON en cada request
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Lectura tipada desde /data/content.json
  const content = await readCollection("content");
  const { greeting, subtitle, description } = content.home;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <HolaMundo
        greeting={greeting}
        subtitle={subtitle}
        description={description}
      />
    </main>
  );
}
```

### 6.6 Verificar en local

```bash
# Iniciar desarrollo
pnpm dev

# Verificar tipado sin errores
pnpm tsc --noEmit

# Verificar linting sin errores
pnpm lint
```

Abrir `http://localhost:3000` y confirmar:
- "Hola Mundo" aparece centrado con animación fade-up y efecto glow
- El subtítulo y descripción aparecen con retraso escalonado
- El badge verde "TypeScript · Operacional" pulsa correctamente
- No hay errores en la consola del navegador
- No hay errores en la terminal de Next.js

### 6.7 Commit de la fase

```bash
git add .
git commit -m "feat(home): add animated Hola Mundo page reading from JSON-DB"
git push origin main
```

### Criterio de aceptación — Fase 3
> ✅ El Home muestra "Hola Mundo" con animaciones. Los datos provienen de `/data/content.json` a través del módulo `db.ts`. `pnpm tsc --noEmit` y `pnpm lint` pasan sin advertencias ni errores.

---

## 7. Fase 4 — Integración CI/CD con Vercel

### Objetivo
Conectar el repositorio GitHub con Vercel para que cada `push` a `main` dispare un deploy automático a producción.

### 7.1 Importar el proyecto en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Seleccionar **"Import Git Repository"**
3. Buscar y seleccionar `mi-proyecto-ts`
4. Vercel detecta automáticamente Next.js — no cambiar nada en la detección

### 7.2 Configurar el entorno en Vercel

En la sección **"Environment Variables"** del wizard de importación, agregar:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | *(Vercel lo auto-completa con la URL del deploy)* | Production |

> Nota: `NODE_ENV` la inyecta Vercel automáticamente; no es necesario agregarla.

### 7.3 Hacer el primer deploy

Hacer clic en **"Deploy"**. Vercel ejecutará:

```
1. pnpm install          — Instalar dependencias
2. pnpm build            — Compilar Next.js (incluye tsc --noEmit)
3. Deploy a CDN global   — Publicar en la red de Vercel
```

Si el build falla, revisar los logs en el dashboard de Vercel. Los errores más comunes en esta etapa son:

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module` | Import con ruta incorrecta | Verificar alias `@/*` en tsconfig |
| `Type error: ...` | TypeScript detectó error | Corregir el tipo y hacer nuevo push |
| `Module not found: 'fs'` | `fs` en código de cliente | Mover la lógica al Server Component |
| `Build failed` | Error de sintaxis | Revisar el archivo indicado en el log |

### 7.4 Verificar el deploy de producción

Una vez exitoso, Vercel asigna una URL del tipo:

```
https://mi-proyecto-ts.vercel.app
```

Verificar en esa URL:
- La animación "Hola Mundo" funciona igual que en local
- El badge "TypeScript · Operacional" aparece
- Las fuentes cargan correctamente
- No hay errores en la consola del navegador

### 7.5 Configurar dominio personalizado (opcional)

En **Vercel Dashboard → Project → Settings → Domains**:

1. Agregar el dominio propio (ej: `miproyecto.com`)
2. Seguir las instrucciones de DNS que Vercel proporciona
3. Vercel emite certificado SSL automáticamente (Let's Encrypt)

### 7.6 Verificar el pipeline automático

Para confirmar que CI/CD funciona, hacer un cambio mínimo y observar el deploy automático:

```bash
# Cambiar el texto en data/content.json
# Modificar "greeting": "Hola Mundo" por "greeting": "¡Hola Mundo! 🚀"

git add data/content.json
git commit -m "chore: update greeting text to test CI/CD pipeline"
git push origin main
```

En el dashboard de Vercel, verificar que:
- El deploy se dispara automáticamente al detectar el push
- El build completa en menos de 2 minutos
- La URL de producción muestra el texto actualizado

### 7.7 Verificar Preview Deployments

Crear una rama de prueba para confirmar que los PRs generan previews:

```bash
git checkout -b test/preview-deployment
# hacer algún cambio menor
git commit -am "test: verify preview deployment on PR"
git push origin test/preview-deployment
```

Abrir un Pull Request en GitHub. Vercel comentará automáticamente con una URL de preview única para ese PR.

### Criterio de aceptación — Fase 4
> ✅ La URL de producción en Vercel muestra el Home animado correctamente. Un push a `main` dispara un nuevo deploy automático. Los Pull Requests generan URLs de preview independientes.

---

## 8. Fase 5 — Validación y Pruebas

### Objetivo
Certificar que el sistema completo — desde la capa de datos hasta el deploy en producción — funciona correctamente y que TypeScript está cumpliendo su rol de validador estático.

### 8.1 Validaciones de TypeScript

```bash
# 1. Verificar tipado completo sin compilar
pnpm tsc --noEmit

# Resultado esperado: silencio (sin output = sin errores)

# 2. Verificar que errores de tipo se detectan correctamente
# Abrir lib/types.ts y cambiar temporalmente:
#   greeting: string;  →  greeting: number;
# Luego ejecutar:
pnpm tsc --noEmit
# Debe mostrar un error de tipo. Revertir el cambio al terminar.
```

### 8.2 Validaciones de la capa de datos

```bash
# Probar todos los endpoints del API
curl https://tu-proyecto.vercel.app/api/data
# Esperado: { "collections": ["site", "content"] }

curl https://tu-proyecto.vercel.app/api/data?collection=site
# Esperado: { "collection": "site", "data": { "name": "Mi Proyecto", ... } }

curl https://tu-proyecto.vercel.app/api/data?collection=content
# Esperado: { "collection": "content", "data": { "home": { ... } } }

curl https://tu-proyecto.vercel.app/api/data?collection=inexistente
# Esperado: status 404 con mensaje de error
```

### 8.3 Validaciones visuales del Home

Verificar en la URL de producción:

| Elemento | Qué verificar |
|----------|---------------|
| "Hola Mundo" | Aparece centrado horizontal y verticalmente |
| Gradiente | Degradado indigo → purple → pink visible |
| Animación glow | El título pulsa suavemente |
| Fade-up escalonado | Cada elemento aparece con retraso de 150-200ms |
| Badge verde | Punto pulsante + texto "TypeScript · Operacional" |
| Línea decorativa | Línea horizontal sutil bajo el título |
| Texto inferior | "next.js 14 · typescript 5 · vercel" en gris |
| Responsive | Se ve correctamente en móvil (375px) y desktop (1440px) |

### 8.4 Validaciones de build

```bash
# Ejecutar build de producción localmente
pnpm build

# Resultado esperado:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# Route (app)   Size   First Load JS
# ○ /           X kB   XX kB
# ○ /api/data   X kB   XX kB
```

### 8.5 Checklist de certificación final

Marcar cada ítem antes de declarar el sistema listo:

**TypeScript**
- [ ] `pnpm tsc --noEmit` pasa sin errores ni advertencias
- [ ] `pnpm lint` pasa sin errores ni advertencias
- [ ] `pnpm build` completa exitosamente

**Capa de datos**
- [ ] `/api/data` lista colecciones correctamente
- [ ] `/api/data?collection=site` devuelve datos de `site.json`
- [ ] `/api/data?collection=content` devuelve datos de `content.json`
- [ ] Colección inexistente devuelve HTTP 404

**Home**
- [ ] "Hola Mundo" aparece centrado en la pantalla
- [ ] Animación fade-up funciona al cargar la página
- [ ] Efecto glow pulsante visible en el título
- [ ] Badge "TypeScript · Operacional" visible y animado
- [ ] El contenido proviene de `/data/content.json` (verificar cambiando el JSON)

**CI/CD**
- [ ] Push a `main` dispara deploy automático en Vercel
- [ ] Pull Requests generan URLs de preview
- [ ] Variables de entorno configuradas en Vercel Dashboard
- [ ] URL de producción accesible públicamente

**Repositorio**
- [ ] `.env.local` NO está trackeado por Git (verificar con `git status`)
- [ ] `.gitignore` cubre `node_modules`, `.next` y archivos de entorno
- [ ] Historial de commits limpio y con mensajes descriptivos

### 8.6 Commit de cierre

```bash
git add .
git commit -m "docs: add validation checklist and complete phase 5 certification"
git push origin main
```

### Criterio de aceptación — Fase 5
> ✅ Todos los ítems del checklist de certificación están marcados. El sistema está documentado, tipado, desplegado y funcionando en producción.

---

## 9. Criterios de Éxito Globales

Al completar las 5 fases, el sistema debe cumplir los siguientes criterios de manera simultánea:

**Funcionales**
- La URL de producción muestra "Hola Mundo" con efecto elegante.
- El contenido se lee desde archivos JSON sin base de datos convencional.
- La API expone los datos JSON a través de endpoints tipados.

**Técnicos**
- TypeScript en modo estricto sin ningún error en todo el codebase.
- El pipeline CI/CD despliega automáticamente desde GitHub a Vercel.
- Los tipos fluyen completamente desde los esquemas JSON hasta los componentes React.

**Calidad**
- ESLint y Prettier configurados y sin advertencias.
- `.gitignore` correcto — ningún secreto ni archivo de build en el repositorio.
- Cada fase tiene su commit descriptivo siguiendo convención `type(scope): message`.

---

## 10. Control de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Error de tipos TypeScript en build | Media | Alto | Ejecutar `pnpm tsc --noEmit` antes de cada push |
| Módulo `fs` usado en Client Component | Alta (error común) | Alto | Solo usar `readCollection` en Server Components o API Routes |
| Variables de entorno faltantes en Vercel | Media | Medio | Revisar `.env.example` antes del primer deploy |
| pnpm no soportado en entorno del CI | Baja | Alto | Confirmar que `vercel.json` especifica `"installCommand": "pnpm install"` |
| Datos JSON con formato inválido | Baja | Alto | Validar JSON con un linter antes de hacer commit (`jsonlint`) |
| Escritura a `/data` en producción | Baja | Medio | El módulo `db.ts` lanza error explícito si `NODE_ENV === "production"` |

---

## 11. Glosario

| Término | Definición en el contexto de este proyecto |
|---------|-------------------------------------------|
| **JSON-DB** | Arquitectura de datos basada en archivos `.json` dentro de `/data`, que reemplaza una base de datos convencional |
| **Server Component** | Componente React que se ejecuta solo en el servidor (Node.js); puede usar `fs`, leer JSON, acceder a variables de entorno secretas |
| **Client Component** | Componente React marcado con `"use client"` que se ejecuta en el navegador; no puede usar `fs` ni módulos de Node |
| **API Route** | Función serverless de Next.js en `/app/api/*/route.ts` que maneja peticiones HTTP |
| **Colección** | Archivo `.json` dentro de `/data` que representa un conjunto de datos (equivalente a una tabla en SQL) |
| **CI/CD** | Integración y Despliegue Continuos — el flujo automático de GitHub → Vercel |
| **Preview Deployment** | URL temporal generada por Vercel para cada Pull Request, útil para revisión antes de mergear |
| **`tsc --noEmit`** | Comando de TypeScript que verifica tipos sin generar archivos de salida; se usa para validar antes de commits |

---

*Plan de Implementación elaborado para el sistema Fullstack TypeScript · Next.js 14 · GitHub · Vercel · JSON-DB*  
*Referencia: Plan de Infraestructura v1.0*
