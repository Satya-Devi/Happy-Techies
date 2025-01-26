'use server'

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();
// export async function fetchJobsData(pageData: any) {

//   const userdata = await supabase.auth.getUser();
  
// //   const { data:countData, count, error:countErr } = await supabase
// //     .from("jobs")
// //     .select("*", { count: "exact" })
// //     .eq("employer_id", userdata?.data?.user?.id)
// //     .neq("is_draft", true)
// //     .or("is_archived.is.null,is_archived.neq.true");
// // if(pageData?.pagename == "Dashboard"){
// //   return {count:count}
// // }
// let query = supabase
//   .from("applicants")
//   .select("*", { count: "exact" })
//   .eq("job_id", pageData?.job_id)

// const { data: countData, count, error: countErr } = await query;


//   const dynamicOffset = pageData.step || 1;
//   const limit = pageData.limit || 20;
//   const start = pageData?.pagename =="overview" ? 0 :(dynamicOffset - 1) * limit;
//   const end = pageData?.pagename == "overview" ? 3 : start + limit - 1;
 
//   const { data, error } = await supabase
//     .from("applicants")
//     .select("*")
//     .eq("job_id", pageData?.job_id)
//     .order("created_at", { ascending: false })
//     .range(start, end);
//     if(error) {
//       console.error("Error fetching count:", error);
//       return { error: error };
//     }
//     console.log("DDDDDDAAAAATTTTAAAA",data, pageData);
//   return { data, count };

  
// }
export async function fetchApplicantsData(pageData: any) {
  const userdata = await supabase.auth.getUser();

  let query = supabase
    .from("applicants")
    .select("*", { count: "exact" })
    .eq("job_id", pageData?.job_id);

  // Add filtering conditions based on applicant_type
  if (pageData?.applicant_type === 'saved') {
    query = query.eq("is_saved", true);
  } else if (pageData?.applicant_type === 'archived') {
    query = query.eq("is_archived", true);
  }
  else{
    query = query.or('is_archived.eq.false,is_archived.is.null');
    //query = query.or("is_archived.is.null,is_archived.neq.true");
    //query = query.neq("is_archived", true);
  }

  const { data: countData, count, error: countErr } = await query;

  const dynamicOffset = pageData.step || 1;
  const limit = pageData.limit || 20;
  const start = pageData?.pagename === "overview" ? 0 : (dynamicOffset - 1) * limit;
  const end = pageData?.pagename === "overview" ? 3 : start + limit - 1;

  // Apply filtering before ordering and pagination
  query = supabase
    .from("applicants")
    .select("*")
    .eq("job_id", pageData?.job_id);

  if (pageData?.applicant_type === 'saved') {
    query = query.eq("is_saved", true);
  } else if (pageData?.applicant_type === 'archived') {
    query = query.eq("is_archived", true);
  }
  else{
    query = query.or('is_archived.eq.false,is_archived.is.null');

    //query = query.neq("is_archived", true);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Error fetching data:", error);
    return { error: error };
  }

  console.log("DDDDDDAAAAATTTTAAAA", data, pageData);
  return { data, count };
}


// export async function markJobInactive(jobId: any) {
 
  
//   const { data, error } = await supabase
//     .from('jobs')
//     .update({ job_status: 'inactive' })
//     .eq('id', jobId);

//   if (error) {
//     throw error;
//   }
// console.log("Updated",data)
//   return data;
// }
// export async function deleteJob(draftId: any) {
 
    
//     const { data, error } = await supabase
//     .from('jobs')
//     .update({ is_archived: true })
//     .eq('id', draftId);
//     //   .from('jobs')
//     // //   .select('*')
//     //    .delete()
//     //   .eq('id', draftId);
  
//     if (error) {
//       throw error;
//     }
  
//     console.log("DDDDDDAAAAATTTTAAAA",data);
//     return data;
   
//   }
  export async function saveApplicants(pageData: any) {
 
  console.log("SavingApplicants",pageData);
    const { data, error } = await supabase
    .from('applicants')
    .update({ is_saved: true,is_archived: false})
    .in('id', pageData?.applicant_ids)
    .eq('job_id', pageData?.job_id);
  
    if (error) {
      return error;
    }
  console.log("Updated",data)
    return true;
  }
  export async function archiveApplicants(pageData: any) {
 
  
    const { data, error } = await supabase
    .from('applicants')
    .update({ is_archived: true , is_saved: false})
    .in('id', pageData?.applicant_ids)
    .eq('job_id', pageData?.job_id);
  
    if (error) {
      return error;
    }
  console.log("Updated",data)
    return true;
  }
 
