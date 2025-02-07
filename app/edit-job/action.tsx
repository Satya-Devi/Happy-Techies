  'use server'
  
  import { createClient } from "@/utils/supabase/server";
  const supabase = createClient();
  export async function editJob(formData: any, id:any) {
    const userdata = await supabase.auth.getUser();
//   const signUp = async (formData: any) => {

    console.log("formData=======????", formData);
    let formattedDate = null;
    if (formData?.deadline) {
      const date = new Date(formData?.deadline);
      formattedDate = date.toISOString().split("T")[0];
    }

   
    const { data: updateData, error: updateError } = await supabase
      .from("jobs")
      .update({
        employer_logo: formData?.companyLogo?.name || null,
        company_name: formData?.employerName || null,
        links: [formData?.employerWebsite],
        job_title: formData?.jobTitle || null,
        employment_type: formData?.jobType || null,
        solution_area: formData?.solutionArea || null,
        job_location: formData?.jobLocation || null,
        remote:
          formData?.workplaceType === "Remote"
            ? true
            : formData?.workplaceType == "On-Site"
            ? false
            : null,
        salary_min: formData?.salaryMin || null,
        salary_max: formData?.salaryMax || null,
        // salary_range: formData?.salaryRange || null,
        years_of_experience: formData?.experience || null,
        application_deadline: formattedDate || null,
        skills: formData?.skills || [],
        job_description: formData?.jobDescription || null,
        employer_id: userdata?.data?.user?.id,
        is_draft: formData?.isDraft && formData?.isDraft == true ? true : false,
        status: true,
        created_at: new Date().toISOString(),
      })
      .eq("id", id); // Apply the WHERE condition

    if (updateError) {
      console.error("Error updating job", updateError);
      return false;
    } else {
      console.log("Job updated successfully", updateData);
      return true;
    }
  };