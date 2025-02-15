// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth')?.value; // Adjust the cookie name as needed

  // Check if the user is authenticated
  if (!token) {
    // Redirect to login if not authenticated, storing the intended path
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname); // Store the intended path
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to the broker page
  return NextResponse.next();
}

// Specify which routes the middleware should apply to
export const config = {
  matcher: ['/broker'], // Protect the /broker route
};
