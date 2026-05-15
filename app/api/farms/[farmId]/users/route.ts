import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { listUsersInFarm, createInvitation } from '@/lib/dataService'
import { CreateInvitationSchema } from '@/lib/schemas'
import { sendInvitation } from '@/lib/emailService'

export async function GET(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access with admin role for user listing
    await withFarmAccess(userId, farmId, 'admin')

    const users = await listUsersInFarm(farmId)
    return NextResponse.json(users)
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Only propietario can invite users
    await withFarmAccess(userId, farmId, 'propietario')

    const body = await req.json()
    const data = CreateInvitationSchema.parse({ ...body, farm_id: farmId })

    const token = await createInvitation(data)

    // Send invitation email
    await sendInvitation(data.email, token, farmId, data.role)

    return NextResponse.json(
      { message: 'Invitation sent successfully', email: data.email },
      { status: 201 }
    )
  })
}
