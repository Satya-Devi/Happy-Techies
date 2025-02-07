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

    // console.log("SatyaDevi==========", empData);
    if (empError) {
      console.error("Error fetching user:", empError);
      return;
    }
    if (!(empData && empData.length > 0)) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }

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
        data={jobData}
    
      />
    </div>
  );
}
