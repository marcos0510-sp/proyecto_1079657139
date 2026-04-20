import { NextResponse } from 'next/server'
import { readAppConfig, writeAppConfig } from '@/lib/dataService'

export async function GET() {
  try {
    const config = await readAppConfig()
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

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    await writeAppConfig(payload)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido al escribir config.json'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
