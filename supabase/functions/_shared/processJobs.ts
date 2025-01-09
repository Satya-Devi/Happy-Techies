// deno-lint-ignore-file no-explicit-any
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.42.5/dist/module/index.js";
import { microsoftSkills } from "./constants.ts";

export const processJobs = async (jobs: any, supabase: SupabaseClient) => {
  const rows = [];
  if (jobs["data"]) {
    for (const job of jobs["data"]) {
      const jobSkills: string[] = [];
      const words = job.job_highlights.Qualifications?.join(" ").split(
        /[\s,]+/,
      );
      for (const word of words || []) {
        if (microsoftSkills.includes(word) && !jobSkills.includes(word)) {
          jobSkills.push(word);
        }
      }

      const links = Array.isArray(job.apply_options)
        ? job.apply_options.map((option: any) => option.apply_link)
        : [];

      const row = {
        job_id: job.job_id,
        created_at: job.job_posted_at_datetime_utc,
        company_name: job.employer_name,
        company_description: job.job_description,
        job_listing_source_url: job.job_apply_link,
        job_title: job.job_title,
        job_location: `${job.job_city}, ${job.job_state}`,
        job_description: job.job_description,
        requirements: job.job_highlights.Qualifications,
        skills: jobSkills,
        salary_range: job.job_min_salary && job.job_max_salary
          ? `$${job.job_min_salary} - $${job.job_max_salary}`
          : null,
        employer_logo: job.employer_logo,
        employment_type: job.job_employment_type,
        remote: job.job_is_remote,
        links: links,
      };
      rows.push(row);

      console.log(`Upserting job ${job.job_id}`);
    }

    const { data, error } = await supabase
      .from("jobs")
      .upsert(rows, { onConflict: "job_id" })
      .select();

    if (error) throw error;

    return data;
  } else {
    return [];
  }
};
