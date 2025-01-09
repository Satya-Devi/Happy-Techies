import { keywords, PAGES } from "../_shared/constants.ts";
import { fetchJobs } from "../_shared/fetchJobs.ts";
import { processJobs } from "../_shared/processJobs.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  try {
    const supabase = createSupabaseClient(req);
    let insertedJobs: unknown[] = [];

    for (let page = 1; page <= PAGES; page++) {
      for (const keyword of keywords) {
        const jobs = await fetchJobs(keyword, page);
        const newJobs = await processJobs(jobs, supabase);
        insertedJobs = [...insertedJobs, ...newJobs];
      }
    }

    return new Response(JSON.stringify(insertedJobs), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
