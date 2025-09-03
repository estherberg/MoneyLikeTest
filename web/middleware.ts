
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {

  const token = req.cookies.get('token')?.value;


  const PUBLIC_PATHS = [
    '/login',
    '/register',
    '/_next',   
    '/favicon', 
    '/public', 
    '/api',    
  ];
  const isPublic = PUBLIC_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isPublic) return NextResponse.next();

  const PROTECTED_PREFIXES = ['/campaign', '/campaigns', '/dashboard'];
  const needsAuth = PROTECTED_PREFIXES.some((p) => req.nextUrl.pathname.startsWith(p));

  if (needsAuth && !token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/campaign/:path*',
    '/campaigns/:path*',
    '/dashboard/:path*',
  ],
};
