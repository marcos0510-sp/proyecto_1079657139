import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { getCategories, createCategory } from '@/lib/dataService'
import { CreateCategorySchema } from '@/lib/schemas'

export async function GET(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access
    await withFarmAccess(userId, farmId, 'trabajador')

    const categories = await getCategories(farmId)
    return NextResponse.json(categories)
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    await withFarmAccess(userId, farmId, 'admin')

    const body = await req.json()
    const data = CreateCategorySchema.parse(body)

    const category = await createCategory(farmId, userId, data)
    return NextResponse.json(category, { status: 201 })
  })
}
