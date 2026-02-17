import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Define type for each cookie
type CookieToSet = {
  name: string;
  value: string;
  options?: {
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    maxAge?: number;
  };
};

export const updateSession = async (request: NextRequest) => {
  try {
    // Initial unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            // Update cookies in the request (server-side)
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value, ...options);
            });

            // Create a fresh response and set cookies in the response
            response = NextResponse.next({
              request,
            });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, ...options);
            });
          },
        },
      }
    );

    // Refresh session if expired (required for Server Components)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return response;
  } catch (e) {
    // If Supabase client fails (e.g., missing env vars), just return a NextResponse
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
