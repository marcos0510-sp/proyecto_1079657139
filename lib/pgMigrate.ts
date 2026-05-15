import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

export async function applyMigrations(): Promise<void> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  await client.connect()

  try {
    // Create _migrations table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    // Get applied migrations
    const applied = await client.query('SELECT filename FROM _migrations')
    const appliedFiles = applied.rows.map(row => row.filename)

    // Get migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
    const files = fs.readdirSync(migrationsDir).sort()

    for (const file of files) {
      if (!appliedFiles.includes(file)) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
        await client.query(sql)
        await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file])
        console.log(`Applied migration: ${file}`)
      }
    }
  } finally {
    await client.end()
  }
}