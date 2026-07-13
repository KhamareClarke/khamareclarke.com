
import { NextResponse } from 'next/server';

export function middleware(request) {
  const privateRoutes = [
    '/dashboard',
    '/portal',
    '/login',
    '/onboarding',
  ];

  if (privateRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/portal/:path*',
    '/login',
    '/onboarding',
  ],
};
