
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { AuthenticatedUser, UserRole } from './lib/auth';

const SESSION_KEY = 'user_session';

// Define which routes are protected and for which roles
const protectedRoutesConfig = {
    '/dashboard': ['user'],
    '/profile': ['user'],
    '/admin': ['admin', 'super-admin'],
    '/super-admin': ['super-admin'],
};

const authRoutes = ['/login', '/register', '/auth/force-change-password'];

const roleRedirects: Record<UserRole, string> = {
  'user': '/dashboard',
  'admin': '/admin',
  'super-admin': '/super-admin',
};

// Function to determine if a route is protected and get its required roles
function getRouteProtection(pathname: string): UserRole[] | null {
    if (pathname.startsWith('/admin/')) return ['admin', 'super-admin'];
    if (pathname.startsWith('/super-admin/')) return ['super-admin'];
    
    for (const route in protectedRoutesConfig) {
        // @ts-ignore
        if (pathname.startsWith(route)) return protectedRoutesConfig[route];
    }
    return null;
}


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_KEY);
  let currentUser: AuthenticatedUser | null = null;
  let response = NextResponse.next();

  if (sessionCookie) {
    try {
      currentUser = JSON.parse(sessionCookie.value) as AuthenticatedUser;
      
      // Refresh the cookie to implement a sliding session
      const newCookie = {
        name: SESSION_KEY,
        value: sessionCookie.value,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      };
      response.cookies.set(newCookie);

    } catch (e) {
      // Invalid session cookie, treat as logged out
      currentUser = null;
      // It's a good idea to clear the invalid cookie
      response.cookies.delete(SESSION_KEY);
    }
  }

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const requiredRoles = getRouteProtection(pathname);

  if (currentUser) {
    // User is logged in
    const userRole = currentUser.role;
    
    // 1. If on an auth page, redirect to their dashboard
    if (isAuthRoute) {
        const redirectUrl = roleRedirects[userRole] || '/';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // 2. If on a protected route, check for role access
    if (requiredRoles && !requiredRoles.includes(userRole)) {
        // User does not have the required role, redirect to their dashboard
        const redirectUrl = roleRedirects[userRole] || '/';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    
  } else {
    // User is not logged in
    // 1. If trying to access a protected route, redirect to login
    if (requiredRoles) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }
  }
  
  // No special logic needed, return the response (which may have a refreshed cookie)
  return response;
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
