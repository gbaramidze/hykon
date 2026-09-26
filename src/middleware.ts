import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, Next.js internal paths, API routes, admin, and image files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let lang = 'ka';
  let targetPath = pathname;

  if (pathname === '/ru') {
    lang = 'ru';
    targetPath = '/';
  } else if (pathname.startsWith('/ru/')) {
    lang = 'ru';
    targetPath = pathname.replace(/^\/ru/, '') || '/';
  } else if (pathname === '/en') {
    lang = 'en';
    targetPath = '/';
  } else if (pathname.startsWith('/en/')) {
    lang = 'en';
    targetPath = pathname.replace(/^\/en/, '') || '/';
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hykon-lang', lang);
  requestHeaders.set('x-hykon-pathname', pathname);

  if (lang !== 'ka') {
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-hykon-lang', lang);
    response.cookies.set('hykon_language', lang, { path: '/' });
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('x-hykon-lang', 'ka');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|images|api|admin).*)'],
};
