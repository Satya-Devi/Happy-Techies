import DedicationSection from "@/components/DedicationSection/DedicationSection";
import ExploreSolutionAreas from "@/components/ExploreSolutionAreas/ExploreSolutionAreas";
import { Hero } from "@/components/Hero/Hero";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/components/Dashboard/Dashboard";
import Draft from "@/components/DraftSection/Draft";
import { fetchJobsData} from "@/app/my-jobs/action";


export default async function Overview() {
  const supabase = createClient();
  const data = await supabase.auth.getUser();
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
  const {count}=await fetchJobsData({action:"Count"});
  return (
    <>
      <Hero
        title=""
        role="Employer"
        subtitle=""
        align="center"
        page="overview"
        isHome
      />
      <div>
      
    <Dashboard count={count}/> 
      <Draft />
    </div>
    </>
  );
}
