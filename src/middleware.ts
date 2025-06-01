import { NextRequest, NextResponse } from 'next/server';
import { createClient } from './services/supabase/server';

const routeConfig = {
  landing: {
    patterns: ['/'],
    requiresAuth: false,
  },
  dashboard: {
    patterns: ['/home', '/functions'],
    requiresAuth: true,
  },
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  const route = Object.values(routeConfig).find(({ patterns }) =>
    patterns.includes(pathname)
  );
  if (!route) {
    return NextResponse.next();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (route.requiresAuth && !user) {
    const url = new URL('/signin', req.url);
    url.searchParams.set(
      'callbackUrl',
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(url);
  }
  if (pathname === '/' && user) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}
