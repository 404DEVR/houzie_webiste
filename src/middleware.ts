import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth');
  const path = req.nextUrl.pathname;

  // Redirect logged-in users away from login/signup
  if (token && (path === '/login' || path === '/signUp')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect routes that require authentication
  if (
    (path.startsWith('/broker') ||
      path === '/profile' ||
      path.startsWith('/subscriptions') ||
      path.startsWith('/cart')) &&
    !token
  ) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control for the broker page
  if (path.startsWith('/broker') && token) {
    try {
      const userData = JSON.parse(token.value);

      // If the user's role is "RENTER", deny access
      if (userData.role === 'RENTER') {
        return NextResponse.redirect(new URL('/', req.url)); // Redirect to home or another page
      }
    } catch (error) {
      console.error('Invalid token:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/broker/:path*',
    '/profile',
    '/login',
    '/signUp',
    '/subscriptions',
    '/cart',
  ],
};
