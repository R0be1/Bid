

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { AuthenticatedUser, UserRole } from './lib/auth';

const SESSION_KEY = 'user_session';

const protectedRoutes: Record<UserRole, string[]> = {
    'user': ['/dashboard', '/profile'],
    'admin': ['/admin'],
    'super-admin': ['/super-admin'],
}

const authRoutes = ['/login', '/register'];

const roleRedirects: Record<UserRole, string> = {
  'user': '/dashboard',
  'admin': '/admin',
  'super-admin': '/super-admin',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_KEY);
  let currentUser: AuthenticatedUser | null = null;

  if (sessionCookie) {
    try {
      currentUser = JSON.parse(sessionCookie.value) as AuthenticatedUser;
    } catch (e) {
      currentUser = null;
    }
  }

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (currentUser) {
    const userRole = currentUser.role;
    const defaultRedirectUrl = roleRedirects[userRole] || '/';
    
    if (isAuthRoute) {
        // If logged in, redirect from auth routes to their respective dashboard
        return NextResponse.redirect(new URL(defaultRedirectUrl, request.url));
    }
    
    // Check if the user is trying to access a protected route for another role.
    const isAccessingAllowedRoute = protectedRoutes[userRole]?.some(route => pathname.startsWith(route));
    const isAccessingAnyProtectedRoute = Object.values(protectedRoutes).flat().some(route => pathname.startsWith(route));
    
    if (isAccessingAnyProtectedRoute && !isAccessingAllowedRoute) {
        // If trying to access a protected route they don't have access to, redirect to their dashboard.
        return NextResponse.redirect(new URL(defaultRedirectUrl, request.url));
    }

  } else {
    // Not logged in
    const isProtectedRoute = Object.values(protectedRoutes).flat().some(route => pathname.startsWith(route));
    if (isProtectedRoute) {
        // If not logged in and trying to access a protected route, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
