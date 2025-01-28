"use server";

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();
export async function insertApplicationData(formData: any, jobId: string | undefined) {
  const userdata = await supabase.auth.getUser();

  const { data: insertData, error: insertError } = await supabase
    .from("applicants")
    .insert([
      {
        // employer_logo: formData?.companyLogo?.name || null,

        job_id: jobId,
        full_name: formData?.employerName || null,
        phone_number: [formData?.phoneNumber],
        experience: formData?.experience || null,
        available_start_date: formData?.startDate || null,
        email: formData?.email || null,
        current_employment_status: formData?.employmentstatus || null,

        linkedin_profile: formData?.linkedinProfile || null,
        certifications: formData?.certification || null,
        resume: formData?.uploadResume || null,
        cv: formData?.uploadCV || null,
        // skills: formData?.skills || [],
        // job_description: formData?.jobDescription || null,
        // employer_id: data?.data?.user?.id,
        // is_draft:
        //   formData?.isDraft && formData?.isDraft == true ? true : false,
        // status: true,
        // created_at: new Date().toISOString(),
        // employer_logo: formData?.imageUrl || null,
      },
    ])
    .select("id") // Explicitly requesting the 'id' field of the inserted row
    .single();
  if (insertError) {
    console.error("Error inserting job", insertError);
    return { status: false };
  } else {
    console.log("Job inserted successfully", insertData);
    return { id: insertData?.id, status: true };
  }
}
