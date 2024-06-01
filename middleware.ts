import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher([
    '/',
    '/upcoming',
    '/recordings',
    '/previous',
    '/personal-rooms',
    '/meetings(.*)'
])

export default clerkMiddleware((auth,req)=>{
    if(protectedRoutes(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
