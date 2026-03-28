# 🤖 Prompts de Ejecución por Fases
## Fullstack TypeScript · Next.js 14 · GitHub · Vercel · JSON-DB

> **Archivo:** `PROMPTS_EJECUCION.md`  
> **Propósito:** Prompts listos para copiar y ejecutar en Claude, organizados por fase y tarea  
> **Modo de uso:** Copiar el bloque del prompt completo → pegarlo en Claude → ejecutar → pasar al siguiente  
> **Orden obligatorio:** Los prompts deben ejecutarse en secuencia. No saltar tareas ni fases.

---

## 📋 Cómo usar este archivo

1. Abre los tres documentos de referencia: `PLAN_INFRAESTRUCTURA.md`, `PLAN_IMPLEMENTACION_FASES.md` y `ESTADO_EJECUCION.md`
2. Localiza el próximo prompt pendiente (el primero sin ✅ en el índice de abajo)
3. Copia el bloque completo del prompt (entre las líneas `--- INICIO DEL PROMPT ---` y `--- FIN DEL PROMPT ---`)
4. Pégalo en una nueva conversación de Claude en claude.ai
5. Adjunta o pega el contenido de los tres documentos de referencia cuando el prompt lo indique
6. Ejecuta y espera la respuesta completa
7. Aplica los cambios indicados en tu proyecto local
8. Actualiza `ESTADO_EJECUCION.md` con lo que el prompt te indique registrar
9. Avanza al siguiente prompt

---

## 🗺️ Índice de Prompts

| ID | Fase | Tarea | Skill | Estado |
|----|------|-------|-------|--------|
| F0-T1 | 0 — Prerequisitos | Verificar entorno local | Ingeniero Fullstack | ⏳ |
| F0-T2 | 0 — Prerequisitos | Verificar cuentas GitHub y Vercel | Ingeniero Fullstack | ⏳ |
| F0-CIERRE | 0 — Prerequisitos | Generar resumen Fase 0 | Ingeniero Fullstack | ⏳ |
| F1-T1 | 1 — Inicialización | Crear repositorio y scaffolding | Ingeniero Fullstack | ⏳ |
| F1-T2 | 1 — Inicialización | Configurar TypeScript, ESLint y Prettier | Ingeniero Fullstack | ⏳ |
| F1-T3 | 1 — Inicialización | Configurar archivos de proyecto raíz | Ingeniero Fullstack | ⏳ |
| F1-T4 | 1 — Inicialización | Primer push a GitHub | Ingeniero Fullstack | ⏳ |
| F1-CIERRE | 1 — Inicialización | Generar resumen Fase 1 | Ingeniero Fullstack | ⏳ |
| F2-T1 | 2 — JSON-DB | Crear estructura de datos y esquemas JSON | Ingeniero Fullstack | ⏳ |
| F2-T2 | 2 — JSON-DB | Crear interfaces TypeScript | Ingeniero Fullstack | ⏳ |
| F2-T3 | 2 — JSON-DB | Crear módulo db.ts | Ingeniero Fullstack | ⏳ |
| F2-T4 | 2 — JSON-DB | Crear API Route /api/data | Ingeniero Fullstack | ⏳ |
| F2-CIERRE | 2 — JSON-DB | Generar resumen Fase 2 | Ingeniero Fullstack | ⏳ |
| F3-T1 | 3 — Home UI | Diseñar sistema visual y animaciones | Diseñador UX/UI | ⏳ |
| F3-T2 | 3 — Home UI | Implementar estilos globales y Tailwind | Diseñador UX/UI | ⏳ |
| F3-T3 | 3 — Home UI | Crear componente HolaMundo animado | Diseñador UX/UI | ⏳ |
| F3-T4 | 3 — Home UI | Crear layout y page.tsx (Server Component) | Ingeniero Fullstack | ⏳ |
| F3-CIERRE | 3 — Home UI | Generar resumen Fase 3 | Diseñador UX/UI | ⏳ |
| F4-T1 | 4 — CI/CD | Conectar repositorio con Vercel | Ingeniero Fullstack | ⏳ |
| F4-T2 | 4 — CI/CD | Configurar variables de entorno en Vercel | Ingeniero Fullstack | ⏳ |
| F4-T3 | 4 — CI/CD | Verificar primer deploy automático | Ingeniero Fullstack | ⏳ |
| F4-CIERRE | 4 — CI/CD | Generar resumen Fase 4 | Ingeniero Fullstack | ⏳ |
| F5-T1 | 5 — Validación | Validar TypeScript y linting | Ingeniero Fullstack | ⏳ |
| F5-T2 | 5 — Validación | Validar capa de datos en producción | Ingeniero Fullstack | ⏳ |
| F5-T3 | 5 — Validación | Validar UI y experiencia visual | Diseñador UX/UI | ⏳ |
| F5-CIERRE | 5 — Validación | Generar resumen Fase 5 y certificación final | Ingeniero Fullstack | ⏳ |

---

---

# ═══════════════════════════════════════
# FASE 0 — PREREQUISITOS Y ENTORNO
# ═══════════════════════════════════════

---

## Prompt F0-T1 — Verificar entorno local

```
--- INICIO DEL PROMPT F0-T1 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

Lee estos tres documentos antes de hacer cualquier cosa:
1. PLAN_INFRAESTRUCTURA.md — sección "Stack Tecnológico"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 0 · Prerequisitos y Entorno"
3. ESTADO_EJECUCION.md — revisar el estado actual de todas las fases

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior especializado en ecosistemas Node.js,
TypeScript y herramientas de desarrollo moderno. Tienes experiencia configurando
entornos de desarrollo para proyectos Next.js en equipos profesionales. Eres
metódico, preciso y no asumes nada: verificas antes de afirmar.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md antes de actuar

### [FASE 0 · TAREA 1] Verificación del entorno local
- Prompt ID: F0-T1
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Acción ejecutada: Inicio de verificación de herramientas instaladas en el entorno local
- Resultado obtenido: En progreso
- Archivos afectados: ninguno
- Observaciones: Primera tarea del proyecto

---

## TAREA

Guíame para verificar que mi entorno cumple todos los prerequisitos del plan.
Para cada herramienta dame: el comando exacto de verificación, la versión
mínima requerida, qué hacer si no cumple y cómo confirmar que quedó correcta.

Herramientas: Node.js 20.x LTS, pnpm 9.x, Git 2.x, identidad Git (user.name y email).

Al final dame un bloque bash que ejecute todas las verificaciones de una sola
vez con mensajes claros por cada resultado.

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md al terminar

### [FASE 0 · TAREA 1] Verificación del entorno local
- Prompt ID: F0-T1
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Acción ejecutada: Verificación de Node.js, pnpm, Git e identidad Git
- Resultado obtenido: [completar con versiones verificadas]
- Archivos afectados: ninguno
- Observaciones: [anotar si alguna herramienta requirió instalación]

--- FIN DEL PROMPT F0-T1 ---
```

---

## Prompt F0-T2 — Verificar cuentas GitHub y Vercel

```
--- INICIO DEL PROMPT F0-T2 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

Lee estos tres documentos antes de hacer cualquier cosa:
1. PLAN_INFRAESTRUCTURA.md — sección "Pipeline CI/CD — GitHub → Vercel"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 0 · 3.3 Cuentas requeridas"
3. ESTADO_EJECUCION.md — confirmar que F0-T1 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior con experiencia en configuración de
pipelines CI/CD usando GitHub y Vercel. Conoces el proceso de vinculación
entre ambas plataformas y los permisos necesarios para el deploy automático.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 0 · TAREA 2] Verificación de cuentas GitHub y Vercel
- Prompt ID: F0-T2
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Acción ejecutada: Inicio de verificación de cuentas y vinculación GitHub–Vercel
- Resultado obtenido: En progreso
- Archivos afectados: ninguno
- Observaciones: Prerequisito para el pipeline CI/CD

---

## TAREA

Dame una guía de verificación paso a paso para confirmar que:
1. La cuenta GitHub está activa y puede crear repositorios
2. La cuenta Vercel está activa y vinculada a GitHub con los permisos correctos
3. Vercel puede leer repositorios de mi cuenta GitHub

Para cada punto indica: URL exacta o sección en la interfaz, qué debo ver
para confirmarlo, y qué hacer si no está configurado.

Explícame qué permisos necesita Vercel sobre GitHub y por qué cada uno
es necesario para el CI/CD automático.

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 0 · TAREA 2] Verificación de cuentas GitHub y Vercel
- Prompt ID: F0-T2
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Acción ejecutada: Verificación de cuenta GitHub, Vercel y vinculación entre ambas
- Resultado obtenido: [anotar si están correctamente vinculadas]
- Archivos afectados: ninguno
- Observaciones: [anotar si hubo que configurar algo]

--- FIN DEL PROMPT F0-T2 ---
```

---

## Prompt F0-CIERRE — Resumen de Fase 0

```
--- INICIO DEL PROMPT F0-CIERRE ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

Lee estos tres documentos completos:
1. PLAN_IMPLEMENTACION_FASES.md — sección completa "Fase 0"
2. ESTADO_EJECUCION.md — revisar entradas F0-T1 y F0-T2
3. PLAN_INFRAESTRUCTURA.md — sección "Stack Tecnológico"

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior en rol de tech lead. Eres responsable
de documentar el estado del proyecto al cierre de cada fase para que cualquier
miembro del equipo pueda retomarlo con contexto completo.

---

## TAREA

Genera el contenido completo del archivo RESUMEN_FASE_0.md con:
1. Encabezado con nombre de fase, fecha y estado final
2. Objetivo de la fase según el plan
3. Tareas ejecutadas (F0-T1 y F0-T2) con resultados
4. Versiones verificadas de todas las herramientas
5. Estado de la vinculación GitHub–Vercel
6. Criterio de aceptación: ¿se cumplió?
7. Prerequisitos confirmados para avanzar a Fase 1

El archivo debe ser autocontenido: alguien sin contexto previo debe
entender qué se hizo solo con este resumen.

---

## INSTRUCCIONES DE CIERRE

Al terminar indica que debo:
1. Crear el archivo RESUMEN_FASE_0.md con el contenido generado
2. Marcar Fase 0 como ✅ Completada en el índice de ESTADO_EJECUCION.md
3. Agregar la entrada de cierre en el log de ESTADO_EJECUCION.md:

### [FASE 0 · CIERRE] Generación del resumen de Fase 0
- Prompt ID: F0-CIERRE
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Resultado obtenido: RESUMEN_FASE_0.md creado. Fase 0 cerrada. Listo para Fase 1.
- Archivos afectados: RESUMEN_FASE_0.md (creado), ESTADO_EJECUCION.md (actualizado)

--- FIN DEL PROMPT F0-CIERRE ---
```

---

---

# ═══════════════════════════════════════
# FASE 1 — INICIALIZACIÓN DEL PROYECTO
# ═══════════════════════════════════════

---

## Prompt F1-T1 — Crear repositorio y scaffolding

```
--- INICIO DEL PROMPT F1-T1 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — secciones "Estructura del Repositorio" y "Stack Tecnológico"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 1 · 4.1 y 4.2"
3. ESTADO_EJECUCION.md — confirmar que Fase 0 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior especializado en arquitectura de proyectos
Next.js con TypeScript. Tienes experiencia inicializando proyectos desde cero
con las mejores prácticas de estructura y convenciones de nomenclatura.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 1] Creación del repositorio y scaffolding
- Prompt ID: F1-T1
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Acción ejecutada: Inicio de creación del repositorio GitHub y scaffolding de Next.js
- Resultado obtenido: En progreso
- Archivos afectados: todos los archivos generados por create-next-app
- Observaciones: Primera tarea de código real del proyecto

---

## TAREA

Guíame paso a paso para:
1. Crear el repositorio en GitHub según las especificaciones exactas del plan
2. Ejecutar el scaffolding de Next.js con todas las flags correctas, explicando qué hace cada una
3. Instalar las dependencias adicionales del stack con comandos exactos
4. Verificar que la estructura de carpetas coincide con la del plan (dame un comando tree)
5. Ejecutar pnpm dev y describir exactamente qué debo ver para confirmar que funciona

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 1] Creación del repositorio y scaffolding
- Prompt ID: F1-T1
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Resultado obtenido: Proyecto corriendo en localhost:3000. Estructura verificada.
- Archivos afectados: [listar archivos generados por create-next-app]
- Observaciones: [anotar versiones de Next.js, React y TypeScript instaladas]

--- FIN DEL PROMPT F1-T1 ---
```

---

## Prompt F1-T2 — Configurar TypeScript, ESLint y Prettier

```
--- INICIO DEL PROMPT F1-T2 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección "Configuración TypeScript"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 1 · 4.3 y 4.4"
3. ESTADO_EJECUCION.md — confirmar que F1-T1 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior con especialización en calidad de
código TypeScript. Eres el responsable de las configuraciones de tipado,
linting y formateo. Tu objetivo: hacer que el compilador sea el primer
line of defense contra errores.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 2] Configuración de TypeScript, ESLint y Prettier
- Prompt ID: F1-T2
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Acción ejecutada: Inicio de configuración de herramientas de calidad de código
- Resultado obtenido: En progreso
- Archivos afectados: tsconfig.json, .eslintrc.json, .prettierrc

---

## TAREA

1. Dame el tsconfig.json completo con modo estricto, explicando cada opción clave
2. Dame el .eslintrc.json con las reglas del plan y explicación de cada una
3. Dame el .prettierrc con prettier-plugin-tailwindcss si es necesario
4. Agrega en package.json los scripts: type-check, format y lint:fix
5. Muéstrame cómo verificar que TypeScript detecta errores introduciendo uno intencionalmente

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 2] Configuración de TypeScript, ESLint y Prettier
- Prompt ID: F1-T2
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: pnpm tsc --noEmit sin errores. Error de tipo detectado en prueba.
- Archivos afectados: tsconfig.json, .eslintrc.json, .prettierrc, package.json
- Observaciones: [anotar si hubo conflictos entre ESLint y Prettier]

--- FIN DEL PROMPT F1-T2 ---
```

---

## Prompt F1-T3 — Configurar archivos de proyecto raíz

```
--- INICIO DEL PROMPT F1-T3 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — secciones "Pipeline CI/CD" y "Variables de Entorno"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 1 · 4.5, 4.6, 4.7 y 4.8"
3. ESTADO_EJECUCION.md — confirmar que F1-T2 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior con experiencia en DevOps y configuración
de proyectos para producción. Conoces las mejores prácticas de seguridad en
repositorios y gestión de variables de entorno en múltiples ambientes.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 3] Configuración de archivos raíz del proyecto
- Prompt ID: F1-T3
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Archivos afectados: .gitignore, vercel.json, next.config.ts, .env.example, .env.local

---

## TAREA

Dame el contenido final y completo, listo para copiar, de:
1. .gitignore — completo con comentarios por sección
2. vercel.json — explicando por qué cada campo es necesario para pnpm
3. next.config.ts — con headers de seguridad del plan
4. .env.example — con las variables del plan documentadas
5. Instrucciones para crear .env.local y confirmar que está en .gitignore

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 3] Configuración de archivos raíz
- Prompt ID: F1-T3
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Todos los archivos de configuración base creados
- Observaciones: [confirmar que .env.local está excluido de Git]

--- FIN DEL PROMPT F1-T3 ---
```

---

## Prompt F1-T4 — Primer push a GitHub

```
--- INICIO DEL PROMPT F1-T4 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 1 · 4.9 y 4.10"
2. ESTADO_EJECUCION.md — confirmar que F1-T1, F1-T2 y F1-T3 están ✅ Completadas
3. PLAN_INFRAESTRUCTURA.md — sección "Pipeline CI/CD"

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior responsable de control de versiones.
Sigues Conventional Commits y verificas el estado del repositorio antes de
cualquier push a producción.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 4] Primer push a GitHub
- Prompt ID: F1-T4
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Acción ejecutada: Inicio del proceso de vinculación Git y primer push

---

## TAREA

1. Dame comandos para verificar que .env.local, .next/ y node_modules/ NO aparecen en git status
2. Dame la secuencia completa: git init, add, commit (Conventional Commits), remote, push
3. Después del push, cómo verificar en GitHub que .env.local no está visible
4. Ejecutar pnpm build y describir el output exitoso esperado

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 1 · TAREA 4] Primer push a GitHub
- Prompt ID: F1-T4
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Repositorio en GitHub. pnpm build exitoso.
- Observaciones: [anotar URL del repositorio y hash del primer commit]

--- FIN DEL PROMPT F1-T4 ---
```

---

## Prompt F1-CIERRE — Resumen de Fase 1

```
--- INICIO DEL PROMPT F1-CIERRE ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección completa "Fase 1"
2. ESTADO_EJECUCION.md — revisar entradas F1-T1, F1-T2, F1-T3 y F1-T4
3. PLAN_INFRAESTRUCTURA.md — secciones "Estructura del Repositorio" y "Configuración TypeScript"

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior en rol de tech lead documentador.

---

## TAREA

Genera el contenido completo de RESUMEN_FASE_1.md incluyendo: encabezado,
objetivo, tabla de tareas F1-T1 a F1-T4 con resultados, archivos creados
y modificados, versiones instaladas, configuraciones clave, URL del repositorio,
hash del primer commit, criterio de aceptación verificado y prerequisitos para Fase 2.

Indica al terminar que debo crear el archivo, marcar Fase 1 como ✅ en el
índice de ESTADO_EJECUCION.md y agregar la entrada de cierre en el log.

--- FIN DEL PROMPT F1-CIERRE ---
```

---

---

# ═══════════════════════════════════════
# FASE 2 — CAPA DE DATOS JSON-DB
# ═══════════════════════════════════════

---

## Prompt F2-T1 — Crear estructura de datos y esquemas JSON

```
--- INICIO DEL PROMPT F2-T1 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección completa "Arquitectura de la Capa de Datos (JSON-DB)"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 2 · 5.1 y 5.2"
3. ESTADO_EJECUCION.md — confirmar que Fase 1 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior con especialización en diseño de
esquemas de datos y arquitecturas sin base de datos convencional. Tienes
experiencia diseñando estructuras JSON mantenibles, extensibles y versionables
a través de Git.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 1] Creación de estructura de datos y esquemas JSON
- Prompt ID: F2-T1
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Archivos afectados: data/site.json, data/content.json, data/README.md

---

## TAREA

1. Dame comandos para crear las carpetas /data, /lib y /components/ui
2. Dame el contenido listo para copiar de data/site.json, data/content.json y data/README.md
3. Explícame la filosofía: por qué es solo lectura en producción, cómo se versionan los datos
   y cuándo agregar una nueva colección
4. Dime cómo validar el JSON antes de hacer commit

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 1] Creación de estructura de datos y esquemas JSON
- Prompt ID: F2-T1
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Carpeta /data creada con site.json, content.json y README.md validados
- Observaciones: [anotar herramienta de validación JSON usada]

--- FIN DEL PROMPT F2-T1 ---
```

---

## Prompt F2-T2 — Crear interfaces TypeScript

```
--- INICIO DEL PROMPT F2-T2 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección "4.5 Tipos globales — lib/types.ts"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 2 · 5.3"
3. ESTADO_EJECUCION.md — confirmar que F2-T1 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior especializado en sistemas de tipos con
TypeScript. Tu enfoque: interfaces expresivas y extensibles que el compilador
use para garantizar integridad de datos desde JSON hasta componentes de UI.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 2] Creación de interfaces TypeScript
- Prompt ID: F2-T2
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Archivos afectados: lib/types.ts

---

## TAREA

1. Dame el contenido completo de lib/types.ts con SiteConfig, HomeContent,
   SiteContent, CollectionMap y CollectionName, con comentarios JSDoc en cada interfaz
2. Explícame cómo funciona el patrón CollectionMap + CollectionName y qué garantiza en compilación
3. Muéstrame qué error lanza TypeScript si intento readCollection("usuarios") cuando
   "usuarios" no existe en CollectionMap
4. Ejecuta pnpm tsc --noEmit y confirma el resultado esperado

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 2] Creación de interfaces TypeScript
- Prompt ID: F2-T2
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: lib/types.ts creado. pnpm tsc --noEmit sin errores. Sistema de tipos verificado.
- Observaciones: [anotar si se extendieron interfaces respecto al plan]

--- FIN DEL PROMPT F2-T2 ---
```

---

## Prompt F2-T3 — Crear módulo db.ts

```
--- INICIO DEL PROMPT F2-T3 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección "4.4 Módulo lib/db.ts"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 2 · 5.4"
3. ESTADO_EJECUCION.md — confirmar que F2-T2 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior experto en patrones de acceso a datos
en Node.js. Sabes qué módulos solo funcionan en el servidor y cómo diseñar
una API interna que abstraiga el origen de datos para facilitar migraciones.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 3] Creación del módulo db.ts
- Prompt ID: F2-T3
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Archivos afectados: lib/db.ts
- Observaciones: Solo debe usarse en Server Components y API Routes

---

## TAREA

1. Dame el contenido completo de lib/db.ts con readCollection<K>, writeCollection<K>
   y listCollections(), con manejo de errores descriptivos y comentarios JSDoc con ejemplos
2. Explica por qué fs no puede usarse en Client Components y qué error de Next.js aparecería
3. Muéstrame cómo se ve el autocomplete de TypeScript cuando uso readCollection("content")

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 3] Creación del módulo db.ts
- Prompt ID: F2-T3
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: lib/db.ts con tipado genérico funcional. pnpm tsc --noEmit sin errores.

--- FIN DEL PROMPT F2-T3 ---
```

---

## Prompt F2-T4 — Crear API Route /api/data

```
--- INICIO DEL PROMPT F2-T4 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 2 · 5.5 y 5.6"
2. PLAN_INFRAESTRUCTURA.md — arquitectura general y sección API Route
3. ESTADO_EJECUCION.md — confirmar que F2-T3 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior especializado en API design con Next.js
App Router. Diseñas endpoints RESTful con manejo de errores HTTP correcto,
tipado completo y respuestas consistentes.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 4] Creación de API Route /api/data
- Prompt ID: F2-T4
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Archivos afectados: app/api/data/route.ts

---

## TAREA

1. Dame el contenido completo de app/api/data/route.ts con handler GET que:
   - Sin parámetro: lista colecciones disponibles
   - Con parámetro válido: devuelve datos de la colección
   - Con parámetro inválido: responde HTTP 404 con mensaje descriptivo
2. Dame los comandos curl exactos y el output JSON esperado para los tres escenarios
3. Explica por qué esta ruta es una Serverless Function en Vercel y sus implicaciones
4. Dame el commit de Fase 2 en Conventional Commits y los comandos git completos

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 2 · TAREA 4] Creación de API Route /api/data
- Prompt ID: F2-T4
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Endpoint funcional. 3 escenarios curl verificados. Commit de Fase 2 realizado.
- Observaciones: [anotar resultados de cada prueba curl]

--- FIN DEL PROMPT F2-T4 ---
```

---

## Prompt F2-CIERRE — Resumen de Fase 2

```
--- INICIO DEL PROMPT F2-CIERRE ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección completa "Fase 2"
2. ESTADO_EJECUCION.md — revisar todas las entradas de la Fase 2
3. PLAN_INFRAESTRUCTURA.md — sección "Arquitectura de la Capa de Datos"

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior documentador.

---

## TAREA

Genera RESUMEN_FASE_2.md incluyendo: objetivo, tareas F2-T1 a F2-T4 con
resultados, archivos creados con rutas, patrón CollectionMap explicado,
resultados de pruebas curl, criterio de aceptación verificado y
prerequisitos para Fase 3.

Indica al terminar que debo crear el archivo, marcar Fase 2 como ✅ en
ESTADO_EJECUCION.md y agregar la entrada de cierre en el log.

--- FIN DEL PROMPT F2-CIERRE ---
```

---

---

# ═══════════════════════════════════════
# FASE 3 — IMPLEMENTACIÓN DEL HOME
# ═══════════════════════════════════════

---

## Prompt F3-T1 — Diseñar sistema visual y animaciones

```
--- INICIO DEL PROMPT F3-T1 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — secciones "Implementación del Home" y configuración Next.js
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 3 · Objetivo y 6.1"
3. ESTADO_EJECUCION.md — confirmar que Fase 2 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Diseñador UX/UI Senior con especialización en motion design y
sistemas de diseño para interfaces web modernas. Tienes experiencia creando
experiencias visuales premium con Tailwind CSS y animaciones CSS. Tu filosofía:
menos es más — cada elemento debe justificar su presencia.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 1] Diseño del sistema visual y animaciones
- Prompt ID: F3-T1
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Diseñador UX/UI Senior
- Archivos afectados: tailwind.config.ts
- Observaciones: Primera tarea con rol de Diseñador UX/UI

---

## TAREA

Como diseñador, define y justifica el sistema visual para el Home:
1. Paleta de colores: explica por qué el esquema oscuro con acentos indigo/purple/pink
   comunica tecnología y elegancia
2. Sistema de animaciones: diseña la coreografía (timing fade-up, easing, delays escalonados,
   frecuencia e intensidad del glow)
3. Tipografía: justifica la combinación Geist Sans + Geist Mono y su mensaje
4. Microinteracciones del badge: ping animation y backdrop-blur como elementos de diseño
5. Dame el tailwind.config.ts completo con keyframes y comentarios de decisiones de diseño

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 1] Diseño del sistema visual y animaciones
- Prompt ID: F3-T1
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Diseñador UX/UI Senior
- Resultado obtenido: tailwind.config.ts actualizado con keyframes y tokens de diseño
- Observaciones: [anotar decisiones de diseño clave tomadas]

--- FIN DEL PROMPT F3-T1 ---
```

---

## Prompt F3-T2 — Implementar estilos globales

```
--- INICIO DEL PROMPT F3-T2 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección "8.4 Estilos globales"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 3 · 6.2"
3. ESTADO_EJECUCION.md — confirmar que F3-T1 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Diseñador UX/UI Senior con profundo conocimiento de CSS moderno
y variables de diseño. Sabes crear efectos de fondo visualmente atractivos
sin comprometer el rendimiento.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 2] Implementación de estilos globales
- Prompt ID: F3-T2
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Diseñador UX/UI Senior
- Archivos afectados: app/globals.css

---

## TAREA

1. Dame el contenido completo de app/globals.css con variables CSS root, reset,
   configuración del body, efecto radial con ::before y control de z-index.
   Incluye comentarios que expliquen cada sección desde el punto de vista del diseño.
2. Explica: por qué radial-gradient con rgba en lugar de color sólido, cómo el
   backdrop-blur crea profundidad, y por qué pointer-events: none es crítico.
3. Describe qué debo ver en localhost:3000 para confirmar que el fondo funciona.

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 2] Implementación de estilos globales
- Prompt ID: F3-T2
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: globals.css con fondo oscuro y resplandor radial verificado
- Observaciones: [anotar ajustes a colores o intensidades del gradiente]

--- FIN DEL PROMPT F3-T2 ---
```

---

## Prompt F3-T3 — Crear componente HolaMundo animado

```
--- INICIO DEL PROMPT F3-T3 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección "8.3 Componente animado HolaMundo.tsx"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 3 · 6.4"
3. ESTADO_EJECUCION.md — confirmar que F3-T2 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Diseñador UX/UI Senior con experiencia implementando componentes
React animados. Entiendes la diferencia entre Server y Client Components y
sabes traducir un sistema visual en código limpio, accesible y performático.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 3] Creación del componente HolaMundo animado
- Prompt ID: F3-T3
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Diseñador UX/UI Senior
- Archivos afectados: components/HolaMundo.tsx

---

## TAREA

Dame el contenido completo de components/HolaMundo.tsx con:
- Directiva "use client" justificada
- Props interface usando HomeContent de lib/types.ts
- useState y useEffect con timer y limpieza correcta
- Todos los elementos del diseño con delays escalonados (0, 150, 250, 400, 600, 800ms)
- Variables de clase para estados shown/hidden

Explícame: por qué el fade-up escalonado mejora la percepción del usuario,
y por qué este componente debe ser Client Component.

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 3] Creación del componente HolaMundo animado
- Prompt ID: F3-T3
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Diseñador UX/UI Senior
- Resultado obtenido: components/HolaMundo.tsx con animaciones y tipado completo
- Observaciones: [anotar cambios de diseño respecto al plan original]

--- FIN DEL PROMPT F3-T3 ---
```

---

## Prompt F3-T4 — Crear layout y page.tsx

```
--- INICIO DEL PROMPT F3-T4 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — secciones "8.1 Layout raíz" y "8.2 Página principal"
2. PLAN_IMPLEMENTACION_FASES.md — secciones "Fase 3 · 6.3 y 6.5 a 6.7"
3. ESTADO_EJECUCION.md — confirmar que F3-T3 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior especializado en Next.js App Router.
Entiendes el flujo de datos desde el servidor hasta el cliente y cómo
los metadatos impactan el SEO.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 4] Creación de layout.tsx y page.tsx
- Prompt ID: F3-T4
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Archivos afectados: app/layout.tsx, app/page.tsx

---

## TAREA

1. Dame el contenido de app/layout.tsx con Geist fonts, metadata tipada,
   RootLayoutProps con Readonly y suppressHydrationWarning explicado
2. Dame el contenido de app/page.tsx con dynamic = "force-dynamic" explicado,
   readCollection tipado y props correctas para HolaMundo
3. Describe exactamente qué debo ver en localhost:3000
4. Ejecuta: pnpm tsc --noEmit, pnpm lint y pnpm build — describe los outputs esperados
5. Dame el commit de Fase 3 en Conventional Commits y los comandos git

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 3 · TAREA 4] Creación de layout.tsx y page.tsx
- Prompt ID: F3-T4
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Home animado funcionando en localhost:3000 con datos desde JSON-DB
- Observaciones: [anotar output del pnpm build con rutas y tamaños de bundle]

--- FIN DEL PROMPT F3-T4 ---
```

---

## Prompt F3-CIERRE — Resumen de Fase 3

```
--- INICIO DEL PROMPT F3-CIERRE ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección completa "Fase 3"
2. ESTADO_EJECUCION.md — revisar todas las entradas de la Fase 3
3. PLAN_INFRAESTRUCTURA.md — sección "Implementación del Home"

---

## SKILL ACTIVO

Actúa como Diseñador UX/UI Senior en rol de documentador de entregas. El resumen
debe capturar tanto las decisiones técnicas como las de diseño visual.

---

## TAREA

Genera RESUMEN_FASE_3.md incluyendo: objetivo, tareas F3-T1 a F3-T4 con
resultados, archivos creados, decisiones de diseño (paleta, animaciones,
tipografía), flujo de datos JSON → componente, resultado del pnpm build,
criterio de aceptación verificado y prerequisitos para Fase 4.

Indica al terminar que debo crear el archivo, marcar Fase 3 como ✅ en
ESTADO_EJECUCION.md y agregar la entrada de cierre en el log.

--- FIN DEL PROMPT F3-CIERRE ---
```

---

---

# ═══════════════════════════════════════
# FASE 4 — INTEGRACIÓN CI/CD CON VERCEL
# ═══════════════════════════════════════

---

## Prompt F4-T1 — Conectar repositorio con Vercel

```
--- INICIO DEL PROMPT F4-T1 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección "Pipeline CI/CD — GitHub → Vercel"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 4 · 7.1 y 7.2"
3. ESTADO_EJECUCION.md — confirmar que Fase 3 está ✅ Completada y el build pasa

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior especializado en DevOps y despliegue
continuo con Vercel. Conoces el proceso de importación, detección automática
de frameworks y configuraciones para Next.js con pnpm.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 4 · TAREA 1] Conexión del repositorio con Vercel
- Prompt ID: F4-T1
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Observaciones: Primera fase de despliegue a producción

---

## TAREA

Dame guía paso a paso para conectar el repositorio con Vercel:
1. URL exacta donde iniciar el proceso de importación
2. Pasos del wizard de importación describiendo qué ver en cada pantalla
3. Qué configuraciones de framework detecta Vercel automáticamente y cuáles verificar manualmente
4. Por qué el vercel.json de Fase 1 ya resuelve parte de la configuración
5. Cómo confirmar que Vercel está usando pnpm y no npm o yarn

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 4 · TAREA 1] Conexión del repositorio con Vercel
- Prompt ID: F4-T1
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Proyecto configurado en Vercel, listo para primer deploy
- Observaciones: [anotar nombre del proyecto en Vercel y URL asignada]

--- FIN DEL PROMPT F4-T1 ---
```

---

## Prompt F4-T2 — Configurar variables de entorno en Vercel

```
--- INICIO DEL PROMPT F4-T2 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_INFRAESTRUCTURA.md — sección "Variables de Entorno"
2. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 4 · 7.2"
3. ESTADO_EJECUCION.md — confirmar que F4-T1 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior con experiencia en seguridad y gestión
de configuración en entornos cloud. Entiendes la diferencia entre variables
públicas NEXT_PUBLIC_ y secretas, y cómo Vercel las inyecta en distintos contextos.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 4 · TAREA 2] Configuración de variables de entorno en Vercel
- Prompt ID: F4-T2
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior

---

## TAREA

1. Dame la tabla completa de variables a configurar: nombre, valor, entornos y si es pública o privada
2. Explica las variables que Vercel inyecta automáticamente (como VERCEL_URL)
3. Dime exactamente en qué sección del Dashboard se configuran y cómo hacerlo
4. Identifica si hay alguna variable crítica para el primer deploy

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 4 · TAREA 2] Configuración de variables de entorno en Vercel
- Prompt ID: F4-T2
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Variables configuradas en Vercel para todos los entornos
- Observaciones: [listar variables configuradas y sus entornos]

--- FIN DEL PROMPT F4-T2 ---
```

---

## Prompt F4-T3 — Verificar deploy y pipeline automático

```
--- INICIO DEL PROMPT F4-T3 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — secciones "Fase 4 · 7.3, 7.4, 7.5, 7.6 y 7.7"
2. PLAN_INFRAESTRUCTURA.md — sección "Pipeline CI/CD" con el diagrama de flujo
3. ESTADO_EJECUCION.md — confirmar que F4-T1 y F4-T2 están ✅ Completadas

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior especializado en diagnóstico de builds
y pipelines CI/CD. Sabes interpretar logs de Vercel e identificar errores
comunes en deploys de Next.js.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 4 · TAREA 3] Verificación del deploy y pipeline CI/CD
- Prompt ID: F4-T3
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior
- Observaciones: Primer deploy a producción

---

## TAREA

1. Dame el proceso para disparar el primer deploy desde Vercel Dashboard
2. Explica cómo leer los logs de build: secciones que aparecen, líneas clave de éxito
   y cómo interpretar un error (con ejemplo del error más común: fs en Client Component)
3. Dame el proceso de verificación post-deploy: URL de producción, verificación visual, curl en producción
4. Dame el mini-cambio en data/content.json y comandos git para probar el pipeline automático
5. Explica cómo crear una rama de prueba, abrir un PR y dónde encontrar la URL de preview de Vercel

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 4 · TAREA 3] Verificación del deploy y pipeline CI/CD
- Prompt ID: F4-T3
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: URL de producción activa. CI/CD automático verificado. Preview deployments confirmados.
- Observaciones: [anotar URL de producción definitiva de Vercel]

--- FIN DEL PROMPT F4-T3 ---
```

---

## Prompt F4-CIERRE — Resumen de Fase 4

```
--- INICIO DEL PROMPT F4-CIERRE ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección completa "Fase 4"
2. ESTADO_EJECUCION.md — revisar todas las entradas de la Fase 4
3. PLAN_INFRAESTRUCTURA.md — sección "Pipeline CI/CD"

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior documentador. Este resumen captura el
momento en que el sistema pasó de local a producción por primera vez.

---

## TAREA

Genera RESUMEN_FASE_4.md incluyendo: objetivo, pasos de conexión con Vercel,
variables configuradas, URL de producción, resultado del primer deploy, verificación
del pipeline automático (con el cambio de prueba en content.json), verificación de
Preview Deployments, tabla de errores comunes y cómo se evitaron, criterio de
aceptación verificado y prerequisitos para Fase 5.

Indica al terminar que debo crear el archivo, marcar Fase 4 como ✅ en
ESTADO_EJECUCION.md y agregar la entrada de cierre.

--- FIN DEL PROMPT F4-CIERRE ---
```

---

---

# ═══════════════════════════════════════
# FASE 5 — VALIDACIÓN Y PRUEBAS
# ═══════════════════════════════════════

---

## Prompt F5-T1 — Validar TypeScript y linting

```
--- INICIO DEL PROMPT F5-T1 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 5 · 8.1 y 8.4"
2. PLAN_INFRAESTRUCTURA.md — sección "Configuración TypeScript"
3. ESTADO_EJECUCION.md — confirmar que Fase 4 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior en rol de QA técnico. Tu trabajo es
certificar que el sistema de tipos funciona correctamente: detecta errores
reales, el compilador está en modo estricto y el linting está limpio.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 5 · TAREA 1] Validación de TypeScript y linting
- Prompt ID: F5-T1
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior (QA Técnico)

---

## TAREA

1. Ejecuta y documenta el resultado de: pnpm tsc --noEmit, pnpm lint y pnpm build
2. Prueba que TypeScript detecta estos errores intencionalmente:
   - Cambiar greeting: string a greeting: number en lib/types.ts
   - Llamar a readCollection("coleccion-inexistente")
   - Pasar una prop incorrecta a HolaMundo (número donde se espera string)
3. Traza el flujo completo de tipos: data/content.json → lib/types.ts → lib/db.ts → app/page.tsx → components/HolaMundo.tsx
4. Confirma que allowJs: false está activo y qué error daría un archivo .js

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 5 · TAREA 1] Validación de TypeScript y linting
- Prompt ID: F5-T1
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: Sistema de tipos certificado. tsc, lint y build sin errores.
- Observaciones: [anotar los tres errores de prueba que TypeScript detectó]

--- FIN DEL PROMPT F5-T1 ---
```

---

## Prompt F5-T2 — Validar capa de datos en producción

```
--- INICIO DEL PROMPT F5-T2 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 5 · 8.2"
2. PLAN_INFRAESTRUCTURA.md — sección "Arquitectura de la Capa de Datos"
3. ESTADO_EJECUCION.md — confirmar que F5-T1 está ✅ Completada y la URL de producción

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior en rol de QA de integración. Validas
que la capa de datos funciona correctamente en Vercel, no solo en desarrollo local.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 5 · TAREA 2] Validación de la capa de datos en producción
- Prompt ID: F5-T2
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior (QA Integración)
- Observaciones: Validación sobre producción real, no localhost

---

## TAREA

Usando la URL de producción de Vercel, dame los comandos curl exactos y el
output esperado para:
1. GET /api/data — debe listar ["site", "content"]
2. GET /api/data?collection=site — debe retornar site.json
3. GET /api/data?collection=content — debe retornar content.json
4. GET /api/data?collection=inexistente — debe retornar HTTP 404

5. Valida el flujo E2E: cambia greeting en content.json a "¡TypeScript Validado! ✅",
   push a main, espera el deploy, verifica en producción, y luego revierte.
6. Confirma el mecanismo de protección de writeCollection en producción.

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 5 · TAREA 2] Validación de la capa de datos en producción
- Prompt ID: F5-T2
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Resultado obtenido: JSON-DB funcional en Vercel. Flujo E2E verificado.
- Observaciones: [anotar resultados de cada curl en producción]

--- FIN DEL PROMPT F5-T2 ---
```

---

## Prompt F5-T3 — Validar UI y experiencia visual

```
--- INICIO DEL PROMPT F5-T3 ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

1. PLAN_IMPLEMENTACION_FASES.md — sección "Fase 5 · 8.3"
2. PLAN_INFRAESTRUCTURA.md — sección "Implementación del Home"
3. ESTADO_EJECUCION.md — confirmar que F5-T2 está ✅ Completada

---

## SKILL ACTIVO

Actúa como Diseñador UX/UI Senior en rol de QA visual. Verificas que la
experiencia implementada cumple el diseño definido en Fase 3, en desktop
y móvil. Eres meticuloso con detalles visuales y comportamiento de animaciones.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 5 · TAREA 3] Validación de UI y experiencia visual
- Prompt ID: F5-T3
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Diseñador UX/UI Senior (QA Visual)

---

## TAREA

Dame un protocolo de revisión visual completo para el Home en producción.
Para cada elemento indica qué debo ver, cómo verificarlo y qué considera "aprobado":

1. Centrado vertical y horizontal en viewports de 375px, 768px y 1440px
2. Gradiente del título (indigo → purple → pink) visible sin pixelado
3. Animación glow: suave, frecuencia premium, no distractora
4. Fade-up escalonado: secuencia de aparición al recargar
5. Badge de estado: punto verde con ping visible pero no dominante, backdrop-blur correcto
6. Tipografía: Geist Sans y Mono cargadas correctamente (no fallback) — cómo verificar en DevTools
7. Responsive: título legible sin desbordarse en móvil
8. Consola del navegador: sin errores JS, warnings React ni errores de hidratación

---

## REGISTRO DE CIERRE — agregar en ESTADO_EJECUCION.md

### [FASE 5 · TAREA 3] Validación de UI y experiencia visual
- Prompt ID: F5-T3
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Diseñador UX/UI Senior (QA Visual)
- Resultado obtenido: Todos los elementos visuales aprobados. Consola limpia.
- Observaciones: [anotar ajustes visuales realizados para aprobar la revisión]

--- FIN DEL PROMPT F5-T3 ---
```

---

## Prompt F5-CIERRE — Resumen de Fase 5 y Certificación Final

```
--- INICIO DEL PROMPT F5-CIERRE ---

## LECTURA OBLIGATORIA ANTES DE ACTUAR

Lee COMPLETAMENTE estos tres documentos antes de hacer cualquier cosa:
1. PLAN_IMPLEMENTACION_FASES.md — sección completa "Fase 5" y "Criterios de Éxito Globales"
2. ESTADO_EJECUCION.md — revisar TODO el log desde Fase 0 hasta Fase 5
3. PLAN_INFRAESTRUCTURA.md — sección "Notas Finales del Arquitecto"

---

## SKILL ACTIVO

Actúa como Ingeniero Fullstack Senior en rol de arquitecto de cierre. Este es
el prompt final del proyecto. Generas dos documentos: el resumen de Fase 5 y
la certificación final del sistema.

---

## REGISTRO DE INICIO — agregar en ESTADO_EJECUCION.md

### [FASE 5 · CIERRE] Certificación final del sistema
- Prompt ID: F5-CIERRE
- Estado: 🔄 Iniciada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior (Arquitecto de Cierre)
- Archivos afectados: RESUMEN_FASE_5.md y CERTIFICACION_FINAL.md (por crear)
- Observaciones: Último prompt del plan de implementación

---

## TAREA

Genera dos documentos completos:

DOCUMENTO 1 — RESUMEN_FASE_5.md:
Objetivo, tareas F5-T1 a F5-T3 con resultados, validaciones de TypeScript
ejecutadas, resultados curl en producción, QA visual, checklist de certificación
ítem por ítem, criterio de aceptación verificado.

DOCUMENTO 2 — CERTIFICACION_FINAL.md:
- Título: Certificación de Sistema Operativo
- Fecha y versión del sistema
- URL de producción verificada
- Stack confirmado con versiones reales
- Resumen ejecutivo de cada fase (1 párrafo)
- Criterios de éxito globales: tabla con estado sí/no de cada uno
- Métricas finales: fases completadas, commits, deploys, archivos creados
- Limitaciones conocidas del sistema
- Próximos pasos sugeridos para evolucionar el sistema
- Firma del arquitecto: fecha, stack, estado: SISTEMA CERTIFICADO ✅

---

## INSTRUCCIONES DE CIERRE FINAL

Al terminar indica que debo:
1. Crear RESUMEN_FASE_5.md
2. Crear CERTIFICACION_FINAL.md
3. Marcar Fase 5 como ✅ Completada en ESTADO_EJECUCION.md
4. Actualizar todas las métricas finales en ESTADO_EJECUCION.md
5. Agregar la entrada final en el log:

### [FASE 5 · CIERRE FINAL] Certificación del sistema completada
- Prompt ID: F5-CIERRE
- Estado: ✅ Completada
- Fecha/Hora: [completar]
- Skill activo: Ingeniero Fullstack Senior (Arquitecto de Cierre)
- Resultado obtenido: Sistema certificado. Todas las fases completadas.
- Archivos afectados: RESUMEN_FASE_5.md (creado), CERTIFICACION_FINAL.md (creado), ESTADO_EJECUCION.md (actualizado)
- Observaciones: PROYECTO COMPLETADO ✅ — Fullstack TypeScript · Next.js 14 · Vercel · JSON-DB operativo en producción.

--- FIN DEL PROMPT F5-CIERRE ---
```

---

---

## 📌 Notas de uso del sistema de prompts

**Orden de ejecución:** Los prompts están diseñados para ejecutarse en secuencia estricta. El criterio de aceptación de cada fase debe cumplirse antes de iniciar la siguiente.

**Sobre ESTADO_EJECUCION.md:** Es el único archivo que crece continuamente. Nunca borrar entradas. Es el log de auditoría del proyecto.

**Sobre los archivos de resumen:** Cada RESUMEN_FASE_X.md se genera una sola vez al cerrar la fase y no se modifica después. Son el historial inmutable.

**Sobre el cambio de skill:** El cambio de Ingeniero Fullstack a Diseñador UX/UI en la Fase 3 activa un modo de razonamiento distinto centrado en decisiones visuales.

**Archivos existentes al completar el proyecto:**

```
PLAN_INFRAESTRUCTURA.md         — referencia (no se modifica)
PLAN_IMPLEMENTACION_FASES.md    — referencia (no se modifica)
PROMPTS_EJECUCION.md            — este archivo (no se modifica)
ESTADO_EJECUCION.md             — log acumulativo (solo se agrega)
RESUMEN_FASE_0.md               — generado al cerrar Fase 0
RESUMEN_FASE_1.md               — generado al cerrar Fase 1
RESUMEN_FASE_2.md               — generado al cerrar Fase 2
RESUMEN_FASE_3.md               — generado al cerrar Fase 3
RESUMEN_FASE_4.md               — generado al cerrar Fase 4
RESUMEN_FASE_5.md               — generado al cerrar Fase 5
CERTIFICACION_FINAL.md          — generado al cierre total del proyecto
```

---

*Prompts de Ejecución · Fullstack TypeScript · Next.js 14 · GitHub · Vercel · JSON-DB*
*Referencia: PLAN_INFRAESTRUCTURA.md v1.0 · PLAN_IMPLEMENTACION_FASES.md v1.0*
