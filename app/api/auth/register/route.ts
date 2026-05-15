import { NextRequest, NextResponse } from 'next/server'
import { getSystemMode, createUser } from '@/lib/dataService'
import { hashPassword, createJWT } from '@/lib/auth'
import { RegisterSchema } from '@/lib/schemas'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const mode = await getSystemMode()
    if (mode === 'live') {
      return NextResponse.json({ error: 'Registration not allowed in live mode' }, { status: 403 })
    }

    const body = await req.json()
    const { name, email, password } = RegisterSchema.parse(body)

    const passwordHash = await hashPassword(password)
    const user = await createUser({
      name,
      email,
      password_hash: passwordHash
    })

    const token = await createJWT({ userId: user.id, email: user.email })

    const cookieStore = cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}