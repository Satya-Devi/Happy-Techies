"use server";

import { JobData } from "@/utils/interface";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function jobExistsForUser(userId: string, jobId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    console.error(`Error fetching job: ${error.message}`);
    return null;
  }

  return data && data.length > 0;
}

export async function saveJob(userId: string, job:JobData ) {
  const supabase = createClient();

  const jobExists = await jobExistsForUser(userId, job.id);
  if (jobExists) {
    return null;
  }

  const { data, error } = await supabase.from("saved_jobs").insert({
    user_id: userId,
    job_id: job.id,
    job_title: job.job_title,
    job_description: job.job_description,
    company_name: job.company_name,
    job_location: job.job_location,
    job_listing_source_url: job.job_listing_source_url,
    skills: job.skills,
    employer_logo: job.employer_logo,
  });

  if (error) {
    throw error;
  }

  revalidatePath(`/`);
  return data;
}

export async function unsaveJob(userId: string, jobId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("user_id", userId)
    .eq("id", jobId);

  if (error) {
    throw error;
  }

  revalidatePath(`/`);
  return data;
}
