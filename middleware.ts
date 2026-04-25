import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { publicRoutes, apiAuthPrefix } from "@/routes";

const isProtectedRoute = createRouteMatcher([
  "/((?!auth/sign-in|api/auth).*)" // Protects everything except auth and webhooks/static
]);

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || req.nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return;
  }

  if (isProtectedRoute(req)) {
      await auth.protect();
  }
}, { clockSkewInMs: 100000 });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
