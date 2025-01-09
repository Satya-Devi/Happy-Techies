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
  const listData ={
    count: 0,
    step:1,
  }
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
    if (!(empData && empData.length > 0 && empData[0].is_employer_login)) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }

  const { data:countData, count, error:countErr } = await supabase
  .from("jobs")
  .select("*", { count: "exact" })
  .eq("employer_id", userdata?.data?.user?.id) 
  .neq("is_draft", true);
  if (countErr) {
    console.error("Error fetching data:", countErr);
  } else {
   
    console.log("Fetched data$$$$$$$$$$$$$$$$:", countData);
  }
  const limit = 20; // Number of rows per page
  const start = 0;
  const end = start + limit - 1;
const { data, error } = await supabase
  .from("jobs")
  .select("*")
  .eq("employer_id", userdata?.data?.user?.id)
  .neq("is_draft", true)
  .order("created_at", { ascending: false }) // Ensure latest records first
  .range(start, end);


    if (error) {
      console.error("Error fetching data:", error);
    } else {
     
      console.log("Fetched data%%%%%%%%%%%%%%%%%%%%%%%:", data);
    }
  const signUp = async (formData: any) => {
    "use server";
    console.log("formData", formData);
    
const supabase = createClient();
const dynamicOffset = formData?.step || 1;
const limit = 20; // Number of rows per page
const start = (dynamicOffset - 1) * limit;
const end = start + limit - 1;
const { data:countData, count, error:countErr } = await supabase
  .from("jobs")
  .select("*", { count: "exact" })
  .eq("employer_id", userdata?.data?.user?.id) 
  .neq("is_draft", true);
  if (countErr) {
    console.error("Error fetching data:", countErr);
  } else {
   
    console.log("Fetched data  counttttttt:", countData);
  }

const { data, error } = await supabase
  .from("jobs")
  .select("*")
  .eq("employer_id", userdata?.data?.user?.id)
  .neq("is_draft", true)
  .order("created_at", { ascending: false }) // Ensure latest records first
  .range(start, end);


    if (error) {
      console.error("Error fetching data:", error);
    } else {
     
      console.log("Fetched data:", data);
    }
    
  };
 
  return (
    <div>
      <Hero
        title="My Posted Jobs"
        subtitle=""
        align="center"
        role="Employer" 
        page="my-jobs"
      />

      <MyJobs searchParams={searchParams} onSubmit={signUp} data={data} count={count || 0} />
    </div>
  );
}
