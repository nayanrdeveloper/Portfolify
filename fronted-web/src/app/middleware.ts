import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose instead of jsonwebtoken

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Get the token from cookies
        console.log('Admin route detected');
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/auth', req.url));
        }

        try {
            // Use jose library instead of jsonwebtoken
            const secret = new TextEncoder().encode('very-secret-key');

            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL('/auth', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
