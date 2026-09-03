import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Quando este app está rodando como o servidor do Portal (porta 4100,
// iniciado por scripts/portal.mjs), força a raiz "/" a abrir direto
// em "/portal" — evita cair na landing page genérica por engano.
export function middleware(request: NextRequest) {
  if (process.env.GBIT_SURFACE === "portal" && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/portal", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
