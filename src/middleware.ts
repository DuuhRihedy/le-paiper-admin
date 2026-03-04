import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasRouteAccess, getHomePage, type UserRole } from "@/lib/permissions";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Permitir rotas de API do auth
    if (pathname.startsWith("/api/auth")) return NextResponse.next();

    // Rotas públicas
    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Decodificar JWT para obter sessão e role
    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
        secureCookie: req.nextUrl.protocol === "https:",
    });
    const isLoggedIn = !!token;

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isLoggedIn && isPublicRoute) {
        const role = (token.role as UserRole) ?? "admin";
        return NextResponse.redirect(new URL(getHomePage(role), req.url));
    }

    // Verificar permissão de rota por role
    if (isLoggedIn && !isPublicRoute) {
        const role = (token.role as UserRole) ?? "admin";
        if (!hasRouteAccess(role, pathname)) {
            return NextResponse.redirect(new URL(getHomePage(role), req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
