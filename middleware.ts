import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Additional security headers
    const response = NextResponse.next()
    
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY')
    
    // Prevent XSS
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    // Strict referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Protect all routes except login, api/auth, api/init, and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - api/init (init API route)
     * - login (login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/init|login|_next/static|_next/image|favicon.ico).*)',
  ],
}

