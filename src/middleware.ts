import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  const protectedRoutes = ['/broker', '/broker/:path*'];
  const loginPath = '/login';

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token) {
      const url = new URL(loginPath, req.url);
      url.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/broker', '/broker/:path*'],
};
