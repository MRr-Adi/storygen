import { clerkMiddleware } from "@clerk/nextjs/server";

// This is the bouncer that checks if people are logged in!
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};