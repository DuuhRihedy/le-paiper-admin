// Tipos e permissões de acesso por role

export type UserRole = "admin" | "viewer" | "vendedor";

// Rotas permitidas por role
const routePermissions: Record<UserRole, string[]> = {
    admin: ["/", "/inventario", "/pdv", "/clientes", "/relatorios", "/configuracoes"],
    viewer: ["/", "/inventario", "/pdv", "/clientes", "/relatorios", "/configuracoes"],
    vendedor: ["/bem-vindo", "/inventario", "/pdv", "/clientes"],
};

// Página inicial de cada role
const homePages: Record<UserRole, string> = {
    admin: "/",
    viewer: "/",
    vendedor: "/bem-vindo",
};

export function hasRouteAccess(role: UserRole, pathname: string): boolean {
    const allowed = routePermissions[role];
    if (!allowed) return false;
    return allowed.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export function getAllowedRoutes(role: UserRole): string[] {
    return routePermissions[role] ?? [];
}

export function getHomePage(role: UserRole): string {
    return homePages[role] ?? "/";
}
