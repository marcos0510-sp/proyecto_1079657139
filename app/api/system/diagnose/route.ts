import { NextRequest, NextResponse } from 'next/server'
import { getSystemMode } from '@/lib/dataService'

export async function GET() {
  try {
    const mode = await getSystemMode()

    const services = [
      {
        name: 'Supabase',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ok' : 'error',
        message: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'URL configurada' : 'Falta NEXT_PUBLIC_SUPABASE_URL'
      },
      {
        name: 'Base de datos',
        status: process.env.DATABASE_URL ? 'ok' : 'error',
        message: process.env.DATABASE_URL ? 'DATABASE_URL configurada' : 'Falta DATABASE_URL'
      },
      {
        name: 'JWT',
        status: process.env.JWT_SECRET ? 'ok' : 'error',
        message: process.env.JWT_SECRET ? 'JWT_SECRET configurada' : 'Falta JWT_SECRET'
      },
      {
        name: 'Blob',
        status: process.env.BLOB_READ_WRITE_TOKEN ? 'ok' : 'error',
        message: process.env.BLOB_READ_WRITE_TOKEN ? 'Token configurado' : 'Falta BLOB_READ_WRITE_TOKEN'
      },
      {
        name: 'Resend',
        status: process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL ? 'ok' : 'error',
        message: process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL ? 'Resend configurado' : 'Faltan RESEND_API_KEY o RESEND_FROM_EMAIL'
      }
    ]

    const diagnostics = {
      mode,
      timestamp: new Date().toISOString(),
      services,
      canBootstrap: mode === 'seed'
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json({ error: 'Diagnostic failed' }, { status: 500 })
  }
}