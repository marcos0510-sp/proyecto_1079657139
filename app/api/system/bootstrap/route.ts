import { NextRequest, NextResponse } from 'next/server'
import { applyMigrations } from '@/lib/pgMigrate'
import { readSeedData } from '@/lib/seedReader'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { withRole } from '@/lib/withRole'

export async function POST(req: NextRequest) {
  return withRole(req, async (req) => {
    try {
      // Apply migrations
      await applyMigrations()

      // Seed data
      const seed = readSeedData()
      const userMap = new Map<string, string>()

      for (const user of seed.users) {
        const passwordHash = await hashPassword('admin123')
        const { data: insertedUser, error } = await supabase
          .from('users')
          .upsert(
            {
              email: user.email,
              name: user.name,
              password_hash: passwordHash,
              is_active: true
            },
            { onConflict: 'email' }
          )
          .select('id,email')
          .single()

        if (error) throw error
        if (insertedUser) {
          userMap.set(insertedUser.email, insertedUser.id)
        }
      }

      const safeInsert = async (table: string, row: any) => {
        const { error } = await supabase.from(table).insert(row)
        if (error && !/relation.*does not exist|table.*does not exist/i.test(error.message || '')) {
          throw error
        }
      }

      for (const farm of seed.farms) {
        const ownerId = farm.owner_id || userMap.get(farm.owner_email)
        if (!ownerId) continue

        await safeInsert('farms', {
          ...farm,
          owner_id: ownerId
        })

        if (farm.id) {
          await safeInsert('user_farm_access', {
            user_id: ownerId,
            farm_id: farm.id,
            role: 'propietario',
            is_active: true
          })
        }
      }

      for (const warehouse of seed.warehouses) {
        await safeInsert('warehouses', warehouse)
      }

      for (const category of seed.categories) {
        const { data: farms } = await supabase.from('farms').select('id')
        for (const farm of farms || []) {
          await safeInsert('categories', {
            ...category,
            farm_id: farm.id
          })
        }
      }

      return NextResponse.json({ message: 'Bootstrap completed' })
    } catch (error) {
      console.error('Bootstrap error:', error)
      return NextResponse.json({ error: 'Bootstrap failed' }, { status: 500 })
    }
  }, ['propietario'])
}