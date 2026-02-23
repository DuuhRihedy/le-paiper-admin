import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    const isAuthApi = pathname.startsWith("/api/auth");

    if (isAuthApi) return NextResponse.next();

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect logged-in users away from login
    if (isLoggedIn && isPublicRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
