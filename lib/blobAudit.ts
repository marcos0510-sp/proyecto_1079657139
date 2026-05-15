import { put, head, del, list } from '@vercel/blob'

let blobToken: string | null = null

async function getBlobToken(): Promise<string> {
  if (!blobToken) {
    const response = await fetch(`${process.env.BLOB_READ_WRITE_TOKEN}`)
    if (!response.ok) {
      throw new Error('Failed to get blob token')
    }
    blobToken = await response.text()
  }
  return blobToken
}

export async function recordAuditEntry(filename: string, data: any): Promise<void> {
  const token = await getBlobToken()
  const key = `audit/${filename}`
  await put(key, JSON.stringify(data), { access: 'private', token })
}

export async function getAuditEntry(filename: string): Promise<any> {
  const token = await getBlobToken()
  const key = `audit/${filename}`
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${key}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!response.ok) {
    throw new Error('Audit entry not found')
  }
  return response.json()
}

export async function listAuditFiles(): Promise<string[]> {
  const token = await getBlobToken()
  const result = await list({ prefix: 'audit/', token })
  return result.blobs.map(blob => blob.pathname)
}