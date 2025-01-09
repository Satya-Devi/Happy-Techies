import DedicationSection from "@/components/DedicationSection/DedicationSection";
import ExploreSolutionAreas from "@/components/ExploreSolutionAreas/ExploreSolutionAreas";
import { Hero } from "@/components/Hero/Hero";
import Dashboard from "@/components/Dashboard/Dashboard";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Draft from "@/components/DraftSection/Draft";

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
  return (
    <div>
      <Hero
        title=""
        role="Employer"
        subtitle=""
        align="center"
        page="overview"
        isHome
      />
      <Dashboard />
      <Draft />
    </div>
  );
}
