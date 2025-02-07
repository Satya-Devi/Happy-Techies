"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton({ role }: { role?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialResponse = (response: any) => {
    console.log("Received ID token:", response);
    setIsLoading(true);
  
    try {
      if (!response.credential) {
        throw new Error("No ID token received");
      }
  
      supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      })
      .then(({ data, error }) => {
        console.log("Received----",error)
        if (error) throw error;
  
        console.log("Sign-in data:", data);
        const emailCred = data?.user?.email;
        console.log("emailcred",emailCred);
        if (!emailCred) {
          console.warn("User data is not available");
          throw new Error("User email not found");
        }
  
        if (role == "Employer") {
          console.log("yesyes")
          return supabase
            .from("employer_details")
            .select("id")
            .eq("id", data?.session?.user?.id)
            .maybeSingle()
            .then(({ data: empData, error: empError }) => {
              console.log("empdata,",empError);
              console.log("emp", empData)
              if (empError) throw empError;
  
              const empDataInfo = data?.session?.user;
              const empNameMeta = data?.user?.user_metadata;

              if (!empData) {
                console.log("empdata,",empNameMeta,empDataInfo);
                return supabase
                  .from("employer_details")
                  .insert([
                    {
                      id: empDataInfo.id,
                      email: empDataInfo.email ?? null,
                      provider: empDataInfo.app_metadata.provider ?? null,
                      emp_name: empNameMeta.name,
                      is_employer_login: true,
                      created_at: new Date().toISOString(),
                    },
                  ]);
              }
            });
        } 
        else {
          return supabase
            .from("users")
            .select("id")
            .eq("email", emailCred)
            .maybeSingle()
            .then(({ data: userData, error: userError }) => {
              if (userError) throw userError;
  
              const userDataInfo = data?.session?.user;
              const userNameMeta = data?.user?.user_metadata;
  
              if (!userData && userDataInfo && userNameMeta) {
                return supabase
                  .from("users")
                  .insert([
                    {
                      id: userDataInfo.id,
                      email: userDataInfo.email ?? null,
                      password: "google-oauth-placeholder",
                      provider: userDataInfo.app_metadata.provider ?? null,
                      display_name: userNameMeta.name,
                      created_at: new Date().toISOString(),
                    },
                  ]);
              }
            });
        }
      })
      .then(() => {
        console.log("Signed in successfully");
        if (role == "Employer") {
          router.push("/overview");
        } else {
          router.push("/jobs");
        }
      })
      .catch((error) => {
        console.error("Error in sign-in process:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return script;
    };

    const script = loadGoogleScript();

    script.onload = () => {
      console.log("Google script loaded successfully");

      // Initialize Google One Tap with ID token response handling
      window.google.accounts.id.initialize({
        client_id:
          "67210046265-bo0guguu49jnffl6lojhclpu8sqgfs49.apps.googleusercontent.com",
        scope:
          "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        callback: handleCredentialResponse,
        cancel_on_tap_outside: false,
      });
    };

    script.onerror = () => {
      console.error("Error loading Google script");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSignIn = () => {
    if (isLoading) return;

    console.log("Displaying Google One Tap prompt");
    window.google.accounts.id.prompt(); // Display the Google One Tap prompt
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      style={{
        width: "50px",
        height: "50px",
        padding: 0,
        borderRadius: "50%",
        border: "1px solid #fff",
        background: "white",
        cursor: isLoading ? "wait" : "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src="/images/icons/google.svg"
        alt="Sign in with Google"
        width={24}
        height={24}
        style={{
          opacity: isLoading ? 0.5 : 1,
          transition: "opacity 0.3s",
        }}
      />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
          }}
        ></div>
      )}
    </button>
  );
}
