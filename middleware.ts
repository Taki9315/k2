import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware that refreshes the Supabase auth session on every request.
 *
 * This ensures:
 * - Cookies stay fresh when navigating between pages
 * - Switching between user and admin accounts works seamlessly
 * - Session tokens are automatically refreshed before expiry
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Set cookies on the request so downstream Server Components can read them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // 2. Recreate the response with updated request
          supabaseResponse = NextResponse.next({
            request,
          });

          // 3. Set cookies on the response so the browser stores them
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use supabase.auth.getSession() here.
  // getUser() sends a request to the Supabase Auth server every time,
  // which guarantees the token is fresh and validated server-side.
  try {
    await supabase.auth.getUser();
  } catch (error) {
    // Supabase may be temporarily unreachable — continue without crashing
    // the request. The client-side auth context will handle re-auth.
    console.warn('Middleware: Supabase getUser failed, continuing without auth refresh.');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
