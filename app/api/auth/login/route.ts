import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, getUserFarmAccess } from '@/lib/dataService'
import { verifyPassword, createJWT } from '@/lib/auth'
import { LoginSchema } from '@/lib/schemas'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = LoginSchema.parse(body)

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account not activated' }, { status: 401 })
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return NextResponse.json({ error: 'Account locked' }, { status: 429 })
    }

    const isValidPassword = await verifyPassword(password, user.password_hash!)
    if (!isValidPassword) {
      // Increment login attempts
      const attempts = user.login_attempts + 1
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null

      await supabase.from('users').update({
        login_attempts: attempts,
        locked_until: lockedUntil?.toISOString()
      }).eq('id', user.id)

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Reset attempts and login
    await supabase.from('users').update({
      login_attempts: 0,
      locked_until: null,
      last_login_at: new Date().toISOString()
    }).eq('id', user.id)

    const token = await createJWT({ userId: user.id, email: user.email })
    const accesses = await getUserFarmAccess(user.id)

    const cookieStore = cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 // 8 hours
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
        last_login_at: user.last_login_at
      },
      farms: accesses
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}