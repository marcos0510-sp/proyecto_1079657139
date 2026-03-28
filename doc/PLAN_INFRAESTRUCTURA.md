# 🏗️ Plan de Infraestructura — Fullstack TypeScript + GitHub + Vercel

> **Versión:** 1.0  
> **Stack:** Next.js 14 · TypeScript · Vercel · GitHub  
> **Persistencia:** JSON File System (sin base de datos convencional)  
> **Objetivo inicial:** Home con "Hola Mundo" centrado y efecto elegante para validar TypeScript

---

## 📋 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura del Repositorio](#3-estructura-del-repositorio)
4. [Arquitectura de la Capa de Datos (JSON-DB)](#4-arquitectura-de-la-capa-de-datos-json-db)
5. [Configuración TypeScript](#5-configuración-typescript)
6. [Configuración Next.js](#6-configuración-nextjs)
7. [Pipeline CI/CD — GitHub → Vercel](#7-pipeline-cicd--github--vercel)
8. [Implementación del Home — Hola Mundo](#8-implementación-del-home--hola-mundo)
9. [Variables de Entorno](#9-variables-de-entorno)
10. [Checklist de Implementación](#10-checklist-de-implementación)
11. [Comandos de Referencia Rápida](#11-comandos-de-referencia-rápida)

---

## 1. Visión General

```
┌─────────────────────────────────────────────────────────┐
│                   FLUJO DE TRABAJO                      │
│                                                         │
│   Desarrollador                                         │
│       │                                                 │
│       ▼                                                 │
│   git push ──► GitHub (main)                            │
│                    │                                    │
│                    ▼                                    │
│              Vercel CI/CD                               │
│            (build automático)                           │
│                    │                                    │
│                    ▼                                    │
│         https://tu-proyecto.vercel.app                  │
│                                                         │
│   Sin DB tradicional — datos en /data/*.json            │
└─────────────────────────────────────────────────────────┘
```

**Principios del sistema:**

- **TypeScript estricto** en todo el proyecto (front y back).
- **Next.js App Router** como framework fullstack.
- **JSON como capa de datos** — archivos en `/data` actúan como tablas.
- **Vercel** como plataforma de despliegue con integración nativa a GitHub.
- **Sin servidor propio** — Vercel Serverless Functions manejan la API.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión recomendada | Propósito |
|------|-----------|---------------------|-----------|
| Framework | Next.js | 14.x (App Router) | SSR, SSG, API Routes |
| Lenguaje | TypeScript | 5.x | Tipado estático fullstack |
| Estilos | Tailwind CSS | 3.x | Utilidades CSS rápidas |
| Animaciones | Framer Motion | 11.x | Efectos visuales elegantes |
| Runtime | Node.js | 20.x LTS | Requerido por Vercel |
| Package Manager | pnpm | 9.x | Velocidad y eficiencia |
| Linter | ESLint + Prettier | Latest | Calidad de código |
| Deploy | Vercel | — | Hosting + CI/CD |
| Control de versiones | GitHub | — | Repositorio remoto |

---

## 3. Estructura del Repositorio

```
mi-proyecto/
│
├── 📁 app/                        # Next.js App Router
│   ├── layout.tsx                 # Layout raíz (HTML, body, fuentes)
│   ├── page.tsx                   # Home — "Hola Mundo"
│   ├── globals.css                # Estilos globales + variables CSS
│   │
│   └── 📁 api/                    # Serverless API Routes
│       └── 📁 data/
│           └── route.ts           # GET /api/data — Lee archivos JSON
│
├── 📁 components/                 # Componentes React reutilizables
│   ├── HolaMundo.tsx              # Componente principal animado
│   └── ui/                        # Componentes de interfaz genéricos
│
├── 📁 data/                       # ⭐ CAPA DE DATOS (JSON-DB)
│   ├── README.md                  # Documentación del esquema
│   ├── site.json                  # Config general del sitio
│   └── content.json               # Contenido dinámico (textos, etc.)
│
├── 📁 lib/                        # Utilidades y lógica de negocio
│   ├── db.ts                      # Módulo lector/escritor de JSON
│   └── types.ts                   # Tipos e interfaces TypeScript globales
│
├── 📁 public/                     # Assets estáticos
│   └── favicon.ico
│
├── .env.local                     # Variables de entorno (local, no en Git)
├── .env.example                   # Plantilla de variables (sí en Git)
├── .eslintrc.json                 # Configuración ESLint
├── .gitignore                     # Archivos ignorados por Git
├── .prettierrc                    # Configuración Prettier
├── next.config.ts                 # Configuración Next.js
├── package.json                   # Dependencias y scripts
├── pnpm-lock.yaml                 # Lockfile de pnpm
├── tailwind.config.ts             # Configuración Tailwind
├── tsconfig.json                  # Configuración TypeScript
└── vercel.json                    # Configuración de despliegue Vercel
```

---

## 4. Arquitectura de la Capa de Datos (JSON-DB)

### 4.1 Filosofía

La carpeta `/data` reemplaza a la base de datos convencional. Cada archivo `.json` representa una "colección" o "tabla". Vercel despliega estos archivos como parte del bundle, por lo que son de **solo lectura en producción**. Las operaciones de escritura deben realizarse en **desarrollo local** o mediante un proceso de CI/CD que actualice el repositorio.

```
/data
  ├── site.json       →  "tabla" sites
  ├── content.json    →  "tabla" contents  
  └── [entidad].json  →  "tabla" [entidad]
```

### 4.2 Esquema inicial — `data/site.json`

```json
{
  "name": "Mi Proyecto",
  "description": "Fullstack TypeScript con Next.js y Vercel",
  "version": "1.0.0",
  "author": "Tu Nombre",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### 4.3 Esquema inicial — `data/content.json`

```json
{
  "home": {
    "greeting": "Hola Mundo",
    "subtitle": "TypeScript · Next.js · Vercel",
    "description": "Sistema fullstack funcionando correctamente"
  }
}
```

### 4.4 Módulo `lib/db.ts` — Lector de JSON tipado

```typescript
// lib/db.ts
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Lee un archivo JSON de la carpeta /data y lo retorna tipado.
 * @param collection - Nombre del archivo sin extensión (ej: "site")
 */
export async function readCollection<T>(collection: string): Promise<T> {
  const filePath = path.join(DATA_DIR, `${collection}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Colección "${collection}" no encontrada en /data`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Escribe datos en un archivo JSON de /data.
 * ⚠️ Solo funciona en desarrollo local.
 */
export async function writeCollection<T>(
  collection: string,
  data: T
): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Escritura no permitida en producción.");
  }

  const filePath = path.join(DATA_DIR, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
```

### 4.5 Tipos globales — `lib/types.ts`

```typescript
// lib/types.ts

export interface SiteConfig {
  name: string;
  description: string;
  version: string;
  author: string;
  createdAt: string;
}

export interface HomeContent {
  greeting: string;
  subtitle: string;
  description: string;
}

export interface SiteContent {
  home: HomeContent;
}
```

---

## 5. Configuración TypeScript

### `tsconfig.json`

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

**Parámetros clave:**
- `strict: true` — Modo estricto activado (obligatorio para validar TypeScript).
- `resolveJsonModule: true` — Permite importar `.json` directamente.
- `paths: { "@/*" }` — Alias de importación para rutas limpias.

---

## 6. Configuración Next.js

### `next.config.ts`

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tipado en el archivo de configuración (requiere TypeScript)
  experimental: {
    typedRoutes: true,
  },
  // Headers de seguridad básicos
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

### `tailwind.config.ts`

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { textShadow: "0 0 20px rgba(99,102,241,0.5)" },
          "50%": { textShadow: "0 0 60px rgba(99,102,241,0.9)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 7. Pipeline CI/CD — GitHub → Vercel

### 7.1 Flujo automático

```
Commit → Push → GitHub (main) → Vercel detecta cambio
                                       │
                              ┌────────▼────────┐
                              │  pnpm install   │
                              │  pnpm build     │
                              │  (tsc --noEmit) │
                              └────────┬────────┘
                                       │
                              ┌────────▼────────┐
                              │    Deploy       │
                              │  a Producción   │
                              └─────────────────┘
```

### 7.2 Configuración de Vercel — `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### 7.3 Vinculación del repositorio con Vercel

**Pasos para conectar:**

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Importar el repositorio desde GitHub
3. Vercel detecta automáticamente Next.js
4. Configurar variables de entorno (ver sección 9)
5. Hacer clic en **Deploy**

A partir de ese momento:
- Cada `push` a `main` → **deploy a producción** automático
- Cada Pull Request → **preview URL** temporal para revisión

### 7.4 Configuración `.gitignore`

```gitignore
# Dependencias
node_modules/
.pnpm-store/

# Build
.next/
out/

# Entorno
.env
.env.local
.env.*.local

# Sistema operativo
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/

# Vercel
.vercel
```

---

## 8. Implementación del Home — Hola Mundo

### 8.1 Layout raíz — `app/layout.tsx`

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
  description: "Fullstack TypeScript con Next.js y Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### 8.2 Página principal — `app/page.tsx`

```typescript
// app/page.tsx
import { readCollection } from "@/lib/db";
import type { SiteContent } from "@/lib/types";
import HolaMundo from "@/components/HolaMundo";

export default async function HomePage() {
  // Lee datos desde /data/content.json
  const content = await readCollection<SiteContent>("content");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <HolaMundo
        greeting={content.home.greeting}
        subtitle={content.home.subtitle}
        description={content.home.description}
      />
    </main>
  );
}
```

### 8.3 Componente animado — `components/HolaMundo.tsx`

```typescript
// components/HolaMundo.tsx
"use client";

import { useEffect, useState } from "react";

interface HolaMundoProps {
  greeting: string;
  subtitle: string;
  description: string;
}

export default function HolaMundo({
  greeting,
  subtitle,
  description,
}: HolaMundoProps) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    // Trigger de animación al montar
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center px-6 select-none">
      {/* Título principal con efecto glow */}
      <h1
        className={`
          text-7xl md:text-9xl font-bold tracking-tight
          text-transparent bg-clip-text
          bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
          transition-all duration-1000 ease-out
          animate-glow-pulse
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
        style={{ transitionDelay: "0ms" }}
      >
        {greeting}
      </h1>

      {/* Subtítulo con aparición diferida */}
      <p
        className={`
          mt-6 text-xl md:text-2xl font-mono
          text-indigo-300/80 tracking-widest uppercase
          transition-all duration-1000 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
        style={{ transitionDelay: "200ms" }}
      >
        {subtitle}
      </p>

      {/* Descripción con aparición más tardía */}
      <p
        className={`
          mt-4 text-base md:text-lg
          text-gray-400 max-w-md mx-auto
          transition-all duration-1000 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
        style={{ transitionDelay: "400ms" }}
      >
        {description}
      </p>

      {/* Indicador de estado TypeScript */}
      <div
        className={`
          mt-10 inline-flex items-center gap-2 px-4 py-2
          rounded-full border border-indigo-500/30
          bg-indigo-500/10 backdrop-blur-sm
          transition-all duration-1000 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
        style={{ transitionDelay: "600ms" }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm font-mono text-indigo-300">
          TypeScript · Operacional
        </span>
      </div>
    </div>
  );
}
```

### 8.4 Estilos globales — `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #030712;
  --foreground: #f9fafb;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}

/* Efecto de partículas sutil en el fondo */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: radial-gradient(
    ellipse at 50% 50%,
    rgba(99, 102, 241, 0.08) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 0;
}
```

---

## 9. Variables de Entorno

### `.env.example` (incluir en Git)

```env
# Entorno de ejecución
NODE_ENV=development

# URL base del sitio (Vercel la inyecta automáticamente en producción)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Versión de la aplicación
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Notas sobre variables de entorno en Vercel

- Las variables prefijadas con `NEXT_PUBLIC_` son accesibles en el **cliente**.
- Las variables sin prefijo solo son accesibles en el **servidor** (API Routes, Server Components).
- Vercel inyecta automáticamente `VERCEL_URL` con la URL del deploy.
- Agregar las variables en **Vercel Dashboard → Project → Settings → Environment Variables**.

---

## 10. Checklist de Implementación

### Fase 1 — Setup inicial

- [ ] Crear repositorio en GitHub (privado o público)
- [ ] Inicializar proyecto: `pnpm create next-app@latest . --typescript --tailwind --app --src-dir no --import-alias "@/*"`
- [ ] Instalar dependencias adicionales: `pnpm add framer-motion`
- [ ] Configurar `tsconfig.json` con modo estricto
- [ ] Crear carpeta `/data` con `site.json` y `content.json`
- [ ] Crear módulo `lib/db.ts` con lectura tipada
- [ ] Crear `lib/types.ts` con interfaces base
- [ ] Configurar `tailwind.config.ts` con animaciones personalizadas

### Fase 2 — Implementación del Home

- [ ] Crear `app/layout.tsx` con fuentes y metadata
- [ ] Crear `app/globals.css` con estilos base y efecto de fondo
- [ ] Crear `components/HolaMundo.tsx` con animación fade-up y glow
- [ ] Crear `app/page.tsx` como Server Component que lee `/data/content.json`
- [ ] Verificar tipado correcto: `pnpm tsc --noEmit`
- [ ] Probar en local: `pnpm dev` → `http://localhost:3000`

### Fase 3 — Despliegue

- [ ] Configurar `.gitignore` completo
- [ ] Hacer commit inicial: `git add . && git commit -m "feat: init project with Hola Mundo"`
- [ ] Push a GitHub: `git push origin main`
- [ ] Conectar repositorio en [vercel.com](https://vercel.com) → **Import Project**
- [ ] Configurar variables de entorno en Vercel Dashboard
- [ ] Verificar build exitoso en Vercel
- [ ] Confirmar URL de producción funcionando con el Home animado

### Fase 4 — Validación TypeScript

- [ ] Verificar que `pnpm build` corre `tsc --noEmit` sin errores
- [ ] Confirmar que los tipos fluyen desde `/data/*.json` → `lib/types.ts` → componentes
- [ ] Verificar que el badge "TypeScript · Operacional" aparece en el Home
- [ ] Revisar Vercel logs para confirmar cero errores de tipo en producción

---

## 11. Comandos de Referencia Rápida

```bash
# Crear el proyecto
pnpm create next-app@latest mi-proyecto --typescript --tailwind --app

# Instalar dependencias
pnpm install

# Desarrollo local
pnpm dev

# Verificar tipado TypeScript (sin compilar)
pnpm tsc --noEmit

# Build de producción
pnpm build

# Iniciar en modo producción local
pnpm start

# Linting
pnpm lint

# Vincular con Vercel (primera vez)
npx vercel link

# Deploy manual a Vercel (sin CI/CD)
npx vercel --prod
```

---

## 📌 Notas Finales del Arquitecto

**Sobre la capa de datos JSON:**
> En producción, Vercel no permite escritura en el sistema de archivos. La carpeta `/data` es efectiva para datos de **solo lectura** (configuración, contenido estático, catálogos). Si en el futuro el proyecto requiere escritura persistente, considerar migrar a **Vercel KV**, **PlanetScale** (MySQL serverless) o **Supabase** (PostgreSQL).

**Sobre escalabilidad:**
> Esta arquitectura es sólida para proyectos de hasta mediana complejidad. El módulo `lib/db.ts` está diseñado para ser reemplazado fácilmente por un cliente de base de datos real sin cambiar la API que consumen los componentes.

**Sobre TypeScript estricto:**
> El modo `strict: true` en `tsconfig.json` garantiza que el sistema de tipos de TypeScript valide completamente el flujo de datos desde los archivos JSON hasta los componentes. Esto es lo que se validará con el Home de "Hola Mundo".

---

*Plan elaborado como arquitectura de referencia para sistema Fullstack TypeScript · Next.js 14 · GitHub · Vercel · JSON-DB*
