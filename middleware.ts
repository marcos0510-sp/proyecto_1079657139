import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { getUserFarmAccess } from '@/lib/dataService'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin/* routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify token
    const payload = await verifyJWT(token)
    const userId = payload.userId

    // For /admin/db-setup, require propietario role in at least one farm
    if (pathname === '/admin/db-setup') {
      const accesses = await getUserFarmAccess(userId)
      const hasPropietarioRole = accesses.some(access => access.role === 'propietario')

      if (!hasPropietarioRole) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Add userId to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('userId', userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/admin/:path*',
}