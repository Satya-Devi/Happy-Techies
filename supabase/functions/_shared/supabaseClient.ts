import { createClient } from "https://esm.sh/v135/@supabase/supabase-js@2.42.5/dist/module/index.js";

export const createSupabaseClient = (req: Request) => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );
};
