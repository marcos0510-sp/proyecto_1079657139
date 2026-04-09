import { NextResponse } from 'next/server'
import { readAppConfig } from '@/lib/dataService'

export async function GET() {
  try {
    const config = readAppConfig()
    return NextResponse.json(config, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido al leer config.json'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
