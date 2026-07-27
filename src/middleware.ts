export { auth as middleware } from "@/auth";

export const config = {
  // Matcher allows auth checks on all routes except static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};