import { PAGES } from "../_shared/constants.ts";
import { fetchJobs } from "../_shared/fetchJobs.ts";
import { processJobs } from "../_shared/processJobs.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  try {
    const supabase = createSupabaseClient(req);
    let insertedJobs: unknown[] = [];

    for (let page = 1; page <= PAGES; page++) {
      const jobs = await fetchJobs("azure", page);
      const newJobs = await processJobs(jobs, supabase);
      insertedJobs = [...insertedJobs, ...newJobs];
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

/* To test the function, you can use the following curl command:
curl -L -X POST 'http://localhost:54321/functions/v1/jsearch-api' \
 --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbHd0Y21lbnlyanVld2Fpd3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NzE1OTAsImV4cCI6MjAyODI0NzU5MH0.Bu9ZH2rGhrhue4ccpansLd9N9iWCBvamviWUjDHO7IQ'
*/

/* To test the function, you can use the following curl command:
curl -L -X POST 'http://localhost:54321/functions/v1/jsearch-api' \
 --header 'Authorization: Bearer <ANON TOKEN>'
*/

/* To get the local credentials, run the following command:
supabase status
*/
