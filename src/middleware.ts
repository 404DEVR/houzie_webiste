import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth')?.value;

  if (!token) {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/broker', '/broker/:path*'],
};
