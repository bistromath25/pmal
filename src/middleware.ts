import { NextResponse } from 'next/server';
import { auth } from './services/auth';

const routeConfig = {
  landing: {
    patterns: ['/'],
    requiresAuth: false,
  },
  dashboard: {
    patterns: ['/home', '/editor'],
    requiresAuth: true,
  },
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export async function middleware(req: Request) {
  const { pathname } = new URL(req.url);

  if (pathname === '/signin') {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  if (pathname === '/signout') {
    return NextResponse.redirect(new URL('/api/auth/signout', req.url));
  }

  const route = Object.values(routeConfig).find(({ patterns }) =>
    patterns.includes(pathname)
  );
  if (!route) {
    return NextResponse.next();
  }

  const session = await auth();
  if (route.requiresAuth && !session) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}
