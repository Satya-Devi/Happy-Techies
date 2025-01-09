// const handleInputChange = async (field: string, file: File | null) => {
//   if (file) {
//     // Convert file to base64
//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       const base64Data = reader.result;

//       // Call upload API
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           file: base64Data,
//           fileName: file.name,
//         }),
//       });

//       const data = await response.json();

//       // Update form data with the returned URL
//       setFormData((prev) => ({
//         ...prev,
//         [field]: data.url,
//       }));
//     };
//   }
// };


import { Hero } from "@/components/Hero/Hero";
import EmpJobForm from "@/components/JobForm/empJobForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
    const { data: insertData, error: insertError } = await supabase
      .from("jobs")
      .insert([
        {
          employer_logo: formData?.companyLogo?.name || null,
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
        },
      ]);

    if (insertError) {
      console.error("Error inserting job", insertError);
      return false;
    } else {
      console.log("Job inserted successfully", insertData);
      return true;
    }
  };
  return (
    <div>
      <Hero
        title="Create a Job Listing"
        subtitle=""
        align="center"
        role="Employer"
        page="post-job"
      />

      <EmpJobForm searchParams={searchParams} onSubmit={signUp} />
    </div>
  );
}
