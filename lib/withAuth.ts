import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string
    email: string
  }
}

export async function withAuth(
  req: NextRequest,
  handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response> | Response,
  ...args: any[]
): Promise<Response> {
  try {
    const token = req.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)

    ;(req as any).user = {
      userId: payload.userId,
      email: payload.email
    }

    return handler(req as AuthenticatedRequest, ...args)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}