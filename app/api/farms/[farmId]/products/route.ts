import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { getProducts, createProduct } from '@/lib/dataService'
import { CreateProductSchema } from '@/lib/schemas'

export async function GET(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access
    await withFarmAccess(userId, farmId, 'trabajador')

    const products = await getProducts(farmId)
    return NextResponse.json(products)
  export async function POST(
    req: NextRequest,
    { params }: { params: { farmId: string } }
  ) {
    return withAuth(req, async (req) => {
      const { farmId } = params
      const userId = req.user.userId

      await withFarmAccess(userId, farmId, 'admin')

      const body = await req.json()
      const data = CreateProductSchema.parse({ ...body, farm_id: farmId })

      const product = await createProduct(userId, data)
      return NextResponse.json(product, { status: 201 })
    })
  }
  })
}