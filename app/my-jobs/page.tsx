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
    if (!(empData && empData.length > 0 && empData[0].is_employer_login)) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", userdata?.data?.user?.id) // Match employer_id
    //.eq("id", "4b60e2db-637b-4580-a14f-1f984a097a83") // Match id
    //  2e13eb5c-f88a-42ab-9262-5538d11ca315
    .neq("is_draft", true); // Exclude rows where isDraft is true

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Fetched data:", data);
  }
  const signUp = async (formData: any) => {
    "use server";
    console.log("formData", formData);
    let formattedDate = null;
    if (formData?.deadline) {
      const date = new Date(formData?.deadline);
      formattedDate = date.toISOString().split("T")[0];
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      // .eq("employer_id", data1?.data?.user?.id) // Match employer_id
      .eq("id", "4b60e2db-637b-4580-a14f-1f984a097a83") // Match id
      //  2e13eb5c-f88a-42ab-9262-5538d11ca315
      .neq("is_draft", true); // Exclude rows where isDraft is true

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log("Fetched data:", data);
    }
  };
  return (
    <div>
      <Hero
        title="Create a Job Listing"
        subtitle=""
        align="center"
        role="Employer"
        page="my-jobs"
      />

      <MyJobs searchParams={searchParams} onSubmit={signUp} data={data} />
    </div>
  );
}
