'use server'

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();
export async function fetchJobsData(pageData: any) {

  const userdata = await supabase.auth.getUser();
  
//   const { data:countData, count, error:countErr } = await supabase
//     .from("jobs")
//     .select("*", { count: "exact" })
//     .eq("employer_id", userdata?.data?.user?.id)
//     .neq("is_draft", true)
//     .or("is_archived.is.null,is_archived.neq.true");
// if(pageData?.pagename == "Dashboard"){
//   return {count:count}
// }
let query = supabase
  .from("jobs")
  .select("*", { count: "exact" })
  .eq("employer_id", userdata?.data?.user?.id)
  .neq("is_draft", true)
  .or("is_archived.is.null,is_archived.neq.true");

// Apply additional condition if the page name is "Dashboard"
if (pageData?.pagename === "Dashboard" || pageData?.action ==="Count") {
  query = query.or("job_status.is.null,job_status.eq.active");
}

const { data: countData, count, error: countErr } = await query;

if (pageData?.action === "Count") {
  if(countErr) {
    console.error("Error fetching count:", countErr);
    return { error: countErr };
  }
  console.log("Count:---------", countData);
  return { count: count };
}

  const dynamicOffset = pageData.step || 1;
  const limit = pageData.limit || 20;
  const start = pageData?.pagename =="overview" ? 0 :(dynamicOffset - 1) * limit;
  const end = pageData?.pagename == "overview" ? 3 : start + limit - 1;
  if ( pageData?.pagename === "Dashboard") {
    const { data: filteredData, error: filteredError } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", userdata?.data?.user?.id)
      .neq("is_draft", true)
      .or("is_archived.is.null,is_archived.neq.true")
      .or("job_status.is.null,job_status.eq.active") // Added condition for Dashboard
      .order("created_at", { ascending: false })
      .range(start, end);
      if(filteredError) {
        console.error("Error fetching count:", filteredError);
        return { error: filteredError };
      }
  console.log("Filtered Data:---------", filteredData);
    return { data: filteredData, count };
  }
  else{
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", userdata?.data?.user?.id)
    .neq("is_draft", true)
    .or("is_archived.is.null,is_archived.neq.true") 

    // .neq("is_archived", true)
    .order("created_at", { ascending: false })
    .range(start, end);
    if(error) {
      console.error("Error fetching count:", error);
      return { error: error };
    }
  return { data, count };}
  
}

export async function markJobInactive(jobId: any) {
 
  
  const { data, error } = await supabase
    .from('jobs')
    .update({ job_status: 'inactive' })
    .eq('id', jobId);

  if (error) {
    throw error;
  }
console.log("Updated",data)
  return data;
}
export async function deleteJob(draftId: any) {
 
    
    const { data, error } = await supabase
    .from('jobs')
    .update({ is_archived: true })
    .eq('id', draftId);
    //   .from('jobs')
    // //   .select('*')
    //    .delete()
    //   .eq('id', draftId);
  
    if (error) {
      throw error;
    }
  
    console.log("DDDDDDAAAAATTTTAAAA",data);
    return data;
   
  }
