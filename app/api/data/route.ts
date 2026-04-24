import { NextResponse } from 'next/server'
import { readHomeData, writeHomeData } from '@/lib/dataService'

export async function GET() {
  try {
    const data = await readHomeData()
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido al leer home.json'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    await writeHomeData(payload)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido al escribir home.json'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
