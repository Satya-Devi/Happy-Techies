import { Hero } from "@/components/Hero/Hero";
import MyJobs from "@/components/MyJobs/index";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PostJob({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const supabase = createClient();

  const userdata = await supabase.auth.getUser();
  console.log("User: ", userdata?.data?.user?.id);
  if (userdata?.data?.user?.id) {
    const { data: empData, error: empError } = await supabase
      .from("employer_details")
      .select("*")
      .eq("id", userdata?.data?.user?.id);

    console.log("==========", empData);
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
console.log("==========search", searchParams);
  return (
    <div>
      <Hero
        title="My Posted Jobs"
        subtitle=""
        align="center"
        role="Employer" 
        page="my-jobs"
        nav_from={searchParams?.nav_from}
      />

      <MyJobs 
     pagename={searchParams?.pagename}  
      showPagination={true} />
    </div>
  );
}
