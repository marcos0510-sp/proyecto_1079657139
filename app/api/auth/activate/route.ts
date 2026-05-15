import { NextRequest, NextResponse } from 'next/server'
import { activateUser } from '@/lib/dataService'
import { hashPassword, createJWT } from '@/lib/auth'
import { ActivateUserSchema } from '@/lib/schemas'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = ActivateUserSchema.parse(body)

    const passwordHash = await hashPassword(password)
    const user = await activateUser(token, passwordHash)

    const tokenJWT = await createJWT({ userId: user.id, email: user.email })

    const cookieStore = cookies()
    cookieStore.set('auth-token', tokenJWT, {
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
    return NextResponse.json({ error: 'Activation failed' }, { status: 500 })
  }
}