// Dashboard auth is handled client-side (useSession) to avoid cookie/redirect issues on Vercel
// API routes /api/submissions and /api/onboarding still check auth server-side
export async function middleware(req) {
  return Response.next();
}

export const config = {
  matcher: [],
};
