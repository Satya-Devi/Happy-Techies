import { Hero } from "@/components/Hero/Hero";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Applicants from "@/components/Applicants/Applicants";

type SearchParams = {
  id?: string;
};

export default async function ApplicantsPreviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();
  const data1 = await supabase.auth.getUser();

  if (data1?.data?.user?.id) {
    const { data: empData, error: empError } = await supabase
      .from("employer_details")
      .select("*")
      .eq("id", data1?.data?.user?.id);

    if (empError) {
      console.error("Error fetching user:", empError);
      return;
    }

    if (!(empData && empData.length > 0 && empData[0].is_employer_login)) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }

  const { data: jobData, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", searchParams?.id)
    .neq("is_draft", true)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
  }
  console.log("chalking", jobData);

  return (
    <div>
      <Hero
        title={`Applicants for ${jobData?.job_title || "Job"}`}
        subtitle={`Company: ${jobData?.company_name || "Unknown"}`}
        align="center"
        role="Employer"
        page="my-jobs"
        // subpage="preview"
      />
      <Applicants data={jobData} jobId={searchParams?.id || ""} />
    </div>
  );
}
