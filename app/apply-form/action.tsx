"use server";

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();
export async function insertApplicationData(formData: any, jobId: string | undefined) {
    console.log("formData", formData);
  const userdata = await supabase.auth.getUser();

  const { data: insertData, error: insertError } = await supabase
    .from("applicants")
    .insert([
      {
        // employer_logo: formData?.companyLogo?.name || null,

        job_id: jobId,
        full_name: formData?.employerName || null,
        phone_number: formData?.phoneNumber || null,
        experience: formData?.experience || null,
        available_start_date: formData?.startDate || null,
        email: formData?.email || null,
        current_employment_status: formData?.employmentstatus || null,
        linkedin_profile: formData?.linkedinProfile || null,
        certifications: formData?.certification || null,
        resume: formData?.resumeUrl || null,
        cv: formData?.cvUrl || null,
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
    const { data: job, error: fetchError } = await supabase
      .from('jobs') // Replace with your table name
      .select('applicants_count')
      .eq('id', jobId)
      .single();

    if (fetchError) {
      console.error('Error fetching job data:', fetchError);
      return { status: false };
    }

    // Step 2: Default to 0 if `applicants_count` is null
    const currentCount = job?.applicants_count || 0;

    // Step 3: Update the count
    const { data:updateData, error:updateError } = await supabase
      .from('jobs')
      .update({ applicants_count: currentCount + 1 })
      //.update({ applicants_count: 2 })

      .eq('id', jobId);

    if (updateError) {
      console.error('Error incrementing applicants count:', updateError);
      return { status: false };
    }

    console.log('Applicants count updated successfully:', updateData);

    return { id: insertData?.id, status: true };
  }
}
