import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/reset-password", "/update-password", "/welcome", "/features", "/pricing"]

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Check if the route is public
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // Check for admin routes
    if (pathname.startsWith("/admin")) {
      // Check if user is admin
      const isAdmin = request.cookies.get("isAdmin")?.value === "true"

      if (!isAdmin) {
        // Redirect to login if not admin
        return NextResponse.redirect(new URL("/login", request.url))
      }

      return NextResponse.next()
    }

    // For all other routes, check if user is authenticated
    const authSession = request.cookies.get("supabase-auth-token")

    // If no auth session, check for demo mode
    if (!authSession) {
      // Check if we have firstName in localStorage (demo mode)
      // Note: We can't access localStorage in middleware, so this is just a fallback
      // The actual check will happen in the client component
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to proceed
    // The error will be handled by the error boundary
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
