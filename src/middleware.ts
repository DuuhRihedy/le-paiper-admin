import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow auth API routes
    if (pathname.startsWith("/api/auth")) return NextResponse.next();

    // Public routes
    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Check for NextAuth session token (works with JWT strategy)
    const token =
        req.cookies.get("authjs.session-token")?.value ||
        req.cookies.get("__Secure-authjs.session-token")?.value;

    const isLoggedIn = !!token;

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isLoggedIn && isPublicRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
