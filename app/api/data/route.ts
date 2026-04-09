import { NextResponse } from 'next/server'
import { readHomeData } from '@/lib/dataService'

export async function GET() {
  try {
    const data = readHomeData()
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
