# Capa de Datos — JSON como Base de Datos

Esta carpeta `/data` actúa como la capa de persistencia plana del sistema. Los archivos JSON aquí son la fuente de verdad de los datos de la aplicación.

## Reglas de Uso

1. **Solo lectura en servidor**: Los archivos JSON en esta carpeta **jamás son accedidos directamente desde el cliente**. Toda lectura ocurre exclusivamente en Server Components o Route Handlers de Next.js.

2. **Acceso controlado**: Usa únicamente las funciones del servicio `lib/dataService.ts` para leer estos archivos.

3. **Validación obligatoria**: Todo dato leído debe pasar por su correspondiente schema Zod en `lib/validators.ts` antes de ser usado.

## Archivos Actuales

### `config.json` — Configuración Global de la Aplicación
Contiene configuración global como nombre de la app, versión, locale y tema.
- **Propósito**: Configuración que puede cambiar sin rebuild
- **Acceso**: Solo desde servidor, nunca expuesto al cliente

### `home.json` — Contenido de la Página Home
Contiene el contenido del hero de la página principal, incluyendo título, subtítulo, descripción y estilo de animación.
- **Propósito**: Datos del contenido de la página Home
- **Acceso**: Leído en `app/page.tsx` para renderizado server-side

## Cómo Agregar Nuevos Archivos JSON

1. Crear el archivo JSON en esta carpeta con datos de ejemplo.
2. Agregar la interfaz TypeScript correspondiente en `lib/types.ts`.
3. Crear el schema Zod en `lib/validators.ts`.
4. Agregar la función tipada en `lib/dataService.ts` (ej: `readNewData()`).
5. Usar la función en el Server Component o Route Handler correspondiente.

## Seguridad

- Los JSONs nunca se sirven directamente al cliente.
- No almacenar datos sensibles aquí (usar variables de entorno para eso).
- Mantener los archivos pequeños y enfocados en un dominio específico.# Capa de Datos — JSON como Base de Datos

Esta carpeta contiene todos los archivos JSON que actúan como fuente de verdad para la aplicación. Estos archivos son leídos únicamente en el servidor (Server Components y Route Handlers) y nunca se exponen directamente al cliente.

## Reglas
- **Solo lectura en servidor**: Los JSONs nunca se acceden desde el cliente.
- **Validación obligatoria**: Todo JSON debe validarse con su schema Zod correspondiente.
- **Un archivo por dominio**: Cada entidad conceptual tiene su propio JSON.
- **Sin lógica**: Solo datos, nunca funciones.

## Archivos
- `config.json`: Configuración global de la app.
- `home.json`: Contenido de la página Home.