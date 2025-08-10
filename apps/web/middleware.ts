import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)"
]);

const isOrganizationFreeRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/organization-selection(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

    if (!isPublicRoute(req)) {
        await auth.protect();
    } 

    if ( userId && !orgId && !isOrganizationFreeRoute(req)) {
      const searchParams = new URLSearchParams({ redirectUrl: req.url });
      
      const orgSlelection = new URL(
        `/organization-selection?${searchParams.toString()}`,
        req.url
      );

      return NextResponse.redirect(orgSlelection);
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};