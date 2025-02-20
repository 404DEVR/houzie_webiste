import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth');
  const path = req.nextUrl.pathname;

  if (token && (path === '/login' || path === '/signUp')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if ((path.startsWith('/broker') || path === '/profile') && !token) {
    // Add the original URL as a redirect parameter
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/broker/:path*', '/profile', '/login', '/signUp'],
};
