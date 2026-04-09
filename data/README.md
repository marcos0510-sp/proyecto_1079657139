# Capa de Datos JSON

Este proyecto utiliza la carpeta `/data` como una capa de datos plana. Los archivos JSON actúan como la fuente de verdad para la aplicación.

## Propósito de cada archivo

- `config.json`: configuración global de la aplicación.
- `home.json`: contenido del Home, incluyendo título, subtítulo, descripción y metadata.

## Regla de acceso

Los archivos JSON en `/data` deben ser leídos solo desde el servidor. No se deben importar directamente desde componentes del cliente ni exponerlos sin validación.

## Cómo agregar nuevos archivos JSON

1. Crear un nuevo archivo `.json` dentro de `/data`.
2. Definir la estructura esperada en `lib/types.ts`.
3. Crear o actualizar el schema de validación en `lib/validators.ts`.
4. Leer el archivo desde un servicio de datos centralizado como `lib/dataService.ts`.

## Ejemplo de uso

```ts
import { readJsonFile } from '@/lib/dataService'

const config = readJsonFile<{ appName: string; version: string; locale: string; theme: string }>('config.json')
```
