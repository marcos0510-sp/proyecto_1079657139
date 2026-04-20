import fs from 'fs'
import path from 'path'

const BLOB_BASE_URL = process.env.VERCEL_BLOB_BASE_URL
const BLOB_TOKEN = process.env.VERCEL_BLOB_TOKEN

function getBlobUrl(filename: string) {
  if (!BLOB_BASE_URL) {
    throw new Error('VERCEL_BLOB_BASE_URL no está configurada')
  }

  const url = new URL(filename, BLOB_BASE_URL)
  return url.toString()
}

async function readLocalJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(process.cwd(), 'data', filename)
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent) as T
}

async function writeLocalJsonFile(filename: string, data: unknown): Promise<void> {
  const filePath = path.join(process.cwd(), 'data', filename)
  const content = JSON.stringify(data, null, 2)
  await fs.promises.writeFile(filePath, content, 'utf-8')
}

async function readBlobJson<T>(filename: string): Promise<T> {
  const url = getBlobUrl(filename)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(BLOB_TOKEN ? { Authorization: `Bearer ${BLOB_TOKEN}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Error al leer blob ${filename}: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

async function writeBlobJson(filename: string, data: unknown): Promise<void> {
  const url = getBlobUrl(filename)
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(BLOB_TOKEN ? { Authorization: `Bearer ${BLOB_TOKEN}` } : {}),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Error al escribir blob ${filename}: ${response.status} ${response.statusText}`)
  }
}

export async function readJsonData<T>(filename: string): Promise<T> {
  if (BLOB_BASE_URL) {
    return await readBlobJson<T>(filename)
  }
  return await readLocalJsonFile<T>(filename)
}

export async function writeJsonData(filename: string, data: unknown): Promise<void> {
  if (BLOB_BASE_URL) {
    return await writeBlobJson(filename, data)
  }
  return await writeLocalJsonFile(filename, data)
}
