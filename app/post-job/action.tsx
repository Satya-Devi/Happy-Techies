'use server'

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export async function fetchJobById(pageData: any) {

  const userdata = await supabase.auth.getUser();
  
 
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", userdata?.data?.user?.id)
    .eq("id", pageData.id)

  return  data ;
}
export async function saveJob(formData: any) {
  const userdata = await supabase.auth.getUser();
  console.log("formData", formData, formData?.deadline);
  let formattedDate = null;
  if (formData?.deadline) {
    const date = new Date(formData?.deadline);
    formattedDate = date.toISOString().split("T")[0];
  }
  console.log("formattedDate", formattedDate, null);

  if (formData?.jobId) {
   
// Step 1: Get the employer logo URL from the jobs table
const { data:imgData, error:imgErr } = await supabase
  .from('jobs')
  .select('employer_logo')
  .eq('id', formData?.jobId)
  .single();  // Get a single record

if (imgErr) {
  console.error('Error fetching employer logo:', imgErr);
  // return false;
}

const imageUrl = imgData?.employer_logo;
  if(imageUrl){
    const match = imageUrl.match(/public\/[^\/]+\/(.+)/);
    let url= match ? match[1] : null;
    if(url){
  const { data:imageData, error:imageErr } = await supabase
  .storage
  .from('images')
  .remove([url]);

if (imageErr) {
  console.error("Error deleting image:", imageErr.message);
  return false;
}}} 
    const { data: updateData, error: updateError } = await supabase
      .from("jobs")
      .update({
        company_name: formData?.employerName || null,
        links: [formData?.employerWebsite],
        job_title: formData?.jobTitle || null,
        employment_type: formData?.jobType || null,
        solution_area: formData?.solutionArea || null,
        job_location: formData?.jobLocation || null,
        remote:
          formData?.workplaceType === "Remote"
            ? true
            : formData?.workplaceType === "On-Site"
            ? false
            : null,
        salary_min: formData?.salaryMin || null,
        salary_max: formData?.salaryMax || null,
        years_of_experience: formData?.experience || null,
        application_deadline: formattedDate || null,
        skills: formData?.skills || [],
        job_description: formData?.jobDescription || null,
        employer_id: userdata?.data?.user?.id,
        is_draft: formData?.isDraft === true,
        status: true,
        employer_logo: formData?.imageUrl || null, // Updating the logo
      })
      .eq("id", formData?.jobId)
      .select('id')  // Explicitly requesting the 'id' field of the inserted row
      .single(); // Replace 'id' with your actual primary key

    // 🔎 Error Handling
    if (updateError) {
      console.error("Error updating job:", updateError);
      return {status:false};
    } else {
      console.log("Job updated successfully:", updateData);
     
      return {id:updateData?.id, status:true};
    }

  } 
  else {
    const { data: insertData, error: insertError } = await supabase
      .from("jobs")
      .insert([
        {
          // employer_logo: formData?.companyLogo?.name || null,
          company_name: formData?.employerName || null,
          links: [formData?.employerWebsite],
          job_title: formData?.jobTitle || null,
          employment_type: formData?.jobType || null,
          solution_area: formData?.solutionArea || null,
          job_location: formData?.jobLocation || null,
          remote:
            formData?.workplaceType == "Remote"
              ? true
              : formData?.workplaceType == "On-Site"
              ? false
              : null,
          salary_min: formData?.salaryMin || null,
          salary_max: formData?.salaryMax || null,
          years_of_experience: formData?.experience || null,
          application_deadline: formattedDate || null,
          skills: formData?.skills || [],
          job_description: formData?.jobDescription || null,
          employer_id: userdata?.data?.user?.id,
          is_draft:
            formData?.isDraft && formData?.isDraft == true ? true : false,
          status: true,
          created_at: new Date().toISOString(),
          employer_logo: formData?.imageUrl || null,
        },
      ])
      .select('id')  // Explicitly requesting the 'id' field of the inserted row
      .single();
    if (insertError) {
      console.error("Error inserting job", insertError);
      return {status:false};
    } else {
      console.log("Job inserted successfully", insertData);
       return {id:insertData?.id, status:true};
    }
  }
};