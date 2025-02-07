import { Hero } from "@/components/Hero/Hero";
import ApplicantView from "@/components/ApplicationView/ApplicationView";
import { createClient } from "@/utils/supabase/server";
import { fetchJobById } from "@/app/post-job/action";
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
      console.log("User data", empData);
    }
  } else {
    redirect("/employers-login");
  }

  return (
    <div>
      <Hero
        title="Candidate Profile"
        subtitle=""
        align="center"
        role="Employer"
        page="post-job"
      />

      <ApplicantView id={searchParams?.id}
      />
    </div>
  );}





