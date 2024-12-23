import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('shadownet_token')?.value;
  const expiredToken = !token;

  // Redirect unauthenticated users to login page
  if (expiredToken) {
    if (!request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    // Redirect authenticated users from login page to dashboard
    if (
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/login')
    ) {
      return NextResponse.redirect(new URL('/users', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/avatars/:path*',
    '/clans/:path*',
    '/enemies/:path*',
    '/levels/:path*',
    '/products/:path*',
    '/tap-activity/:path*',
    '/task-activity/:path*',
    '/tasks/:path*',
    '/waves/:path*',
    '/users/:path*',
  ],
};
