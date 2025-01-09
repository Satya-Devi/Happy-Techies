import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the SSR package. It exchanges an auth code for the user's session.
    // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    // Exchange the authorization code for a Supabase session
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error?.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const { session } = data;
    if (session) {
      // Redirect to the jobs page after authentication
      return NextResponse.redirect(`${origin}/jobs`);
    }
  }

  // Fallback: if no code, or error occurs
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
