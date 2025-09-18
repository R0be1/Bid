
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_KEY);
  let currentUser: AuthenticatedUser | null = null;

  if (sessionCookie) {
    try {
      currentUser = JSON.parse(sessionCookie.value) as AuthenticatedUser;
    } catch (e) {
      // Invalid cookie, treat as logged out
      currentUser = null;
    }
  }

  const isAuthRoute = authRoutes.includes(pathname);

  if (currentUser) {
    if (isAuthRoute) {
        // If logged in, redirect from auth routes to their respective dashboard
        const url = request.nextUrl.clone();
        switch (currentUser.role) {
            case 'admin':
                url.pathname = '/admin';
                break;
            case 'super-admin':
                url.pathname = '/super-admin';
                break;
            case 'user':
                url.pathname = '/dashboard';
                break;
            default:
                url.pathname = '/';
        }
        return NextResponse.redirect(url);
    }
    
    // Check if user is trying to access a route they are not allowed to
    const userRole = currentUser.role;
    const isAuthorized = Object.entries(protectedRoutes).some(([role, routes]) => {
        if (role === userRole) {
            return routes.some(route => pathname.startsWith(route));
        }
        return false;
    });

    const isTryingToAccessProtectedRoute = Object.values(protectedRoutes).flat().some(route => pathname.startsWith(route));

    if (isTryingToAccessProtectedRoute && !isAuthorized) {
        // User is trying to access a protected route of another role
        // Redirect to their own dashboard
        const url = request.nextUrl.clone();
         switch (currentUser.role) {
            case 'admin':
                url.pathname = '/admin';
                break;
            case 'super-admin':
                url.pathname = '/super-admin';
                break;
            case 'user':
                url.pathname = '/dashboard';
                break;
            default:
                url.pathname = '/';
        }
        return NextResponse.redirect(url);
    }

  } else {
    // Not logged in
    const isProtectedRoute = Object.values(protectedRoutes).flat().some(route => pathname.startsWith(route));
    if (isProtectedRoute) {
        // If not logged in and trying to access a protected route, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.search = `redirect=${pathname}`;
        return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next()
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
