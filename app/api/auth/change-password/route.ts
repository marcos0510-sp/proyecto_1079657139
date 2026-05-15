import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/dataService'
import { verifyPassword, hashPassword } from '@/lib/auth'
import { ChangePasswordSchema } from '@/lib/schemas'
import { withAuth } from '@/lib/withAuth'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    const { userId } = req.user
    const body = await req.json()
    const { current_password, new_password } = ChangePasswordSchema.parse(body)

    const user = await getUserById(userId)
    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isValid = await verifyPassword(current_password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 400 })
    }

    const newHash = await hashPassword(new_password)
    await supabase.from('users').update({
      password_hash: newHash,
      must_change_password: false
    }).eq('id', userId)

    return NextResponse.json({ message: 'Password changed' })
  })
}