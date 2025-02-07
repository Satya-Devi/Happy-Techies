import { Hero } from "@/components/Hero/Hero";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import JobPreview from "@/components/JobPreview/JobPreview";

export default async function JobPreviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  console.log("Search Params:", searchParams);

  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.error("Error fetching user or user not logged in:", userError);
    redirect("/employers-login");
    return null;
  }

  const userId = userData.user.id;

  const { data: empData, error: empError } = await supabase
    .from("employer_details")
    .select("*")
    .eq("id", userId);

  if (empError) {
    console.error("Error fetching employer details:", empError);
    return null;
  }

  if (!empData?.length) {
    console.warn("User is not logged in as an employer:", empData);
    redirect("/employers-login");
    return null;
  }

  if (!searchParams?.id) {
    console.error("Job ID is missing in search parameters.");
    return null;
  }

  const { data: jobs, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", searchParams.id)
    .neq("is_draft", true);

  if (jobError) {
    console.error("Error fetching job data:", jobError);
    return null;
  }

  console.log("Fetched job data:", jobs);

  const signUp = async (formData: any) => {
    "use server";

    console.log("Form data received for update:", formData);

    let formattedDate = null;
    if (formData?.deadline) {
      const date = new Date(formData.deadline);
      formattedDate = date.toISOString().split("T")[0];
    }

    const { data: updateData, error: updateError } = await supabase
      .from("jobs")
      .update({
        employer_logo: formData?.companyLogo?.name || null,
        company_name: formData?.employerName || null,
        links: formData?.employerWebsite ? [formData.employerWebsite] : [],
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
        employer_id: userId,
        is_draft: formData?.isDraft ?? false,
        status: true,
        created_at: new Date().toISOString(),
      })
      .eq("id", searchParams.id);

    if (updateError) {
      console.error("Error updating job:", updateError);
      return false;
    }

    console.log("Job updated successfully:", updateData);
    return true;
  };

  return (
    <div>
      <Hero
        title=""
        subtitle=""
        align="center"
        role="Employer"
        page="my-jobs"
      />
      <JobPreview job={jobs?.[0]} jobs={jobs || []} />
    </div>
  );
}
