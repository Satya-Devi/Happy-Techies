import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  console.log("Request", code);
  if (code) {
    // Exchange the authorization code for a Supabase session
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error?.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const { session } = data;
    console.log("session==========", session);
    if (session) {
      const { data: empData, error: empError } = await supabase
        .from("employer_details")
        .select("id")
        .eq("email", session?.user?.email)
        .maybeSingle(); // Use maybeSingle() to handle zero rows gracefully

      if (empError) {
        console.error("Error fetching user:", empError);
        return;
      }
      if (!empData) {
        const { data: insertData, error: insertError } = await supabase
          .from("employer_details")
          .insert([
            {
              id: session?.user?.id ?? null,
              email: session?.user.email ?? null,
              is_employer_login: true,
              created_at: new Date().toISOString(),
            },
          ]);

        if (insertError) {
          console.error("User insertion error:", insertError);
        } else {
          console.log("User inserted successfully:", insertData);
        }
      }

      // Redirect to the jobs page after authentication
      return NextResponse.redirect(`${origin}/overview`);
    }
  }

  // Fallback: if no code, or error occurs
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
