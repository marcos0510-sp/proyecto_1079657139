import fs from 'fs';
import path from 'path';

// Tipo genérico para lectura de cualquier JSON
export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}import fs from 'fs';
import path from 'path';

// Tipo genérico para lectura de cualquier JSON
export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}