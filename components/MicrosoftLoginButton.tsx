"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@mantine/core";
import Image from "next/image";

export default function MicrosoftLoginButton({ role }: { role?: string }) {
  const handleLoginWithMicrosoft = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          scopes: "email openid profile User.Read",
          redirectTo:
            role === "Employer"
              ? process.env.NEXT_PUBLIC_EMPREDIRECTIONTO!
              : process.env.NEXT_PUBLIC_REDIRECTIONTO!,
          //  redirectTo: process.env.NEXT_PUBLIC_REDIRECTIONTO,
          // redirectTo:role==="Employer"?"http://localhost:3000/auth/empcallback":"http://localhost:3000/auth/callback",

          // redirectTo: "http://localhost:3000/auth/callback"
        },
      });

      console.log("Data:", data);

      if (error) {
        console.error("Error signing in:", error);
      } else {
        console.log("Signed in successfully:", data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Button
      onClick={handleLoginWithMicrosoft}
      styles={(theme) => ({
        root: {
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      })}
    >
      <Image
        src="/images/icons/microsoft.svg"
        alt="Microsoft"
        width={24}
        height={24}
      />
    </Button>
  );
}
