import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { getInventory } from '@/lib/dataService'

export async function GET(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access
    await withFarmAccess(userId, farmId, 'trabajador')

    const { searchParams } = new URL(req.url)
    const filters = {
      farm_id: farmId,
      warehouse_id: searchParams.get('warehouse_id') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      product_code: searchParams.get('product_code') || undefined,
      low_stock_only: searchParams.get('low_stock_only') === 'true',
      user_id: userId
    }

    const inventory = await getInventory(filters)
    return NextResponse.json(inventory)
  })
}