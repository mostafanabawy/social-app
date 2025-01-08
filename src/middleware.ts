import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const url = request.nextUrl.clone();
    const PUBLIC_ROUTES = ['/login', '/signup'];
    const isPublicRoute = PUBLIC_ROUTES.some(route => url.pathname.startsWith(route));
    const isApiRoute = url.pathname.startsWith('/api/');

    // redirect to root if already logged in
    if (isPublicRoute && token ) {
        url.pathname = '/';
        return NextResponse.redirect(url.href);
    }
    // Skip processing for static files, and API routes
    if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/static/') || /\.(.*)$/.test(url.pathname)  || isApiRoute) {
        return NextResponse.next();
    }

    // Redirect to login if no token is present and route is not public
    if (!token && !isPublicRoute) {
        url.pathname = '/login';
        return NextResponse.redirect(url.href);
    }

    return NextResponse.next();
}

/* export const config = {
    matcher: ['/:path*']
} */