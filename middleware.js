import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Auth middleware — validates Supabase session on protected routes and refreshes
 * the auth cookies. Fail-closed: any missing config or session redirects to /login.
 *
 * Protected paths (see `config.matcher` at bottom):
 *   /dashboard        — admin control centre (also requires role=admin, checked in page/API)
 *   /portal           — client portal (any authenticated user)
 */
export async function middleware(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);

  // Fail-closed: if Supabase isn't configured, deny protected routes.
  if (!url || !anon) {
    return NextResponse.redirect(loginUrl);
  }

  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          req.cookies.set(name, value);
        });
        res = NextResponse.next({ request: { headers: req.headers } });
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(loginUrl);
  }

  // /dashboard is admin-only — verify role.
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profile?.role !== 'admin') {
      // Signed-in client tried to hit admin area — send them to portal.
      const portalUrl = new URL('/portal', req.url);
      return NextResponse.redirect(portalUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/portal',
    '/portal/:path*',
  ],
};
