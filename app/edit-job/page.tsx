import { Hero } from "@/components/Hero/Hero";
import EditJobForm from "@/components/EditJob/index";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function EditJob({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  console.log("Search Params:", searchParams);
  const supabase = createClient();
  const data1 = await supabase.auth.getUser();
  // console.log("User: ", data1?.data?.user?.id);
  if (data1?.data?.user?.id) {
    const { data: empData, error: empError } = await supabase
      .from("employer_details")
      .select("*")
      .eq("id", data1?.data?.user?.id);

    console.log("==========", empData);
    if (empError) {
      console.error("Error fetching user:", empError);
      return;
    }

    if (!(empData && empData.length > 0 && empData[0].is_employer_login)) {
      console.log("User data====", empData);
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    // .eq("employer_id", data1?.data?.user?.id) // Match employer_id
    .eq("id", searchParams?.id) // Match id
    //  2e13eb5c-f88a-42ab-9262-5538d11ca315
    .neq("is_draft", true); // Exclude rows where isDraft is true

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Fetched data:", data);
  }

  // console.log(data);
  const signUp = async (formData: any) => {
    "use server";
    console.log("formData=======????", formData);
    let formattedDate = null;
    if (formData?.deadline) {
      const date = new Date(formData?.deadline);
      formattedDate = date.toISOString().split("T")[0];
    }

    const supabase = createClient();
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
        employer_id: data1?.data?.user?.id,
        is_draft: formData?.isDraft && formData?.isDraft == true ? true : false,
        status: true,
        created_at: new Date().toISOString(),
      })
      .eq("id", searchParams.id); // Apply the WHERE condition

    if (updateError) {
      console.error("Error updating job", updateError);
      return false;
    } else {
      console.log("Job updated successfully", updateData);
      return true;
    }
  };
  return (
    <div>
      <Hero
        title="Edit Job Listing"
        subtitle=""
        align="center"
        role="Employer"
        page="post-job"
      />

      <EditJobForm searchParams={searchParams} onSubmit={signUp} data={data} />
    </div>
  );
}
