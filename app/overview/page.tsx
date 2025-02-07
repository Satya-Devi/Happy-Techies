import { Hero } from "@/components/Hero/Hero";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/components/Dashboard/Dashboard";
import Draft from "@/components/DraftSection/Draft";


export default async function Overview() {
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
    if (!(empData && empData.length > 0 )) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }
  let query = supabase
  .from("jobs")
  .select("*", { count: "exact" })
  .eq("employer_id", data?.data?.user?.id)
  .neq("is_draft", true)
  .or("is_archived.is.null,is_archived.neq.true")
  .or("job_status.is.null,job_status.eq.active");


const { data: countData, count, error: countErr } = await query;
  if(countErr) {
    console.error("Error fetching count:", countErr);
    return { error: countErr };
  }
//  console.log("Fetching count", countData);
  let applicants_count=0;
  if(countData && countData.length){
countData.map(item=>{
  if(item.applicants_count)
  applicants_count+=item.applicants_count;
 
})
  }
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
      
     <Dashboard count={count} applicants_count={applicants_count}/> 
      <Draft />
    </div>
    </>
  );
}
