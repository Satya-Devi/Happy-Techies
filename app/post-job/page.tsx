import { Hero } from "@/components/Hero/Hero";
import EmpJobForm from "@/components/JobForm/empJobForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchJobById } from "@/app/post-job/action";

export default async function PostJob({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const supabase = createClient();
  const data = await supabase.auth.getUser();
  console.log("User: ", data?.data?.user?.id);
  if (data?.data?.user?.id) {
    const { data: empData, error: empError } = await supabase
      .from("employer_details")
      .select("*")
      .eq("id", data?.data?.user?.id);

    console.log("SatyaDevi==========", empData);
    if (empError) {
      console.error("Error fetching user:", empError);
      return;
    }
    if (!(empData && empData.length > 0 && empData[0].is_employer_login)) {
      redirect("/employers-login");
      console.log("User data", empData);
    }
  } else {
    redirect("/employers-login");
  }
  const signUp = async (formData: any) => {
    "use server";
    console.log("formData", formData, formData?.deadline);
    let formattedDate = null;
    if (formData?.deadline) {
      const date = new Date(formData?.deadline);
      formattedDate = date.toISOString().split("T")[0];
    }
    console.log("formattedDate", formattedDate, null);
    const supabase = createClient();
    if (formData?.jobId) {
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
          employer_id: data?.data?.user?.id,
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
    } else {
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
            employer_id: data?.data?.user?.id,
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
  const { data: jobData, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", data?.data?.user?.id)
    .eq("id", searchParams?.id);
  return (
    <div>
      <Hero
        title="Create a Job Listing"
        subtitle=""
        align="center"
        role="Employer"
        page="post-job"
      />

      <EmpJobForm
        searchParams={searchParams}
        onSubmit={signUp}
        data={jobData}
      />
    </div>
  );
}
