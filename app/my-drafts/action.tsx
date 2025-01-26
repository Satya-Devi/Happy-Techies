'use server'

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();
export async function fetchDraftsData(pageData: any) {

  const userdata = await supabase.auth.getUser();
  
  const { data:countData, count, error:countErr } = await supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .eq("employer_id", userdata?.data?.user?.id)
    .eq("is_draft", true);

  const dynamicOffset = pageData.step || 1;
  const limit = pageData.limit || 20;
  const start = pageData?.pagename =="overview" ? 0 : (dynamicOffset - 1) * limit;
  const end = pageData?.pagename =="overview" ? 3 : start + limit - 1;

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", userdata?.data?.user?.id)
    .eq("is_draft", true)
    .order("created_at", { ascending: false })
    .range(start, end);

  return { data, count };
}

export async function deleteDraft(draftId: any,imageId: string|undefined|null) {
 
    
    const { data, error } = await supabase

      .from('jobs')
    //   .select('*')
       .delete()
      .eq('id', draftId);
  
    if (error) {
      throw error;
    }
    console.log("DDDDDDAAAAATTTTAAAAaa",imageId);
    if(imageId){
      const match = imageId.match(/public\/[^\/]+\/(.+)/);
      let url= match ? match[1] : null;
      if(url){
    const { data:imageData, error:imageErr } = await supabase
    .storage
    .from('images')
    .remove([url]);

  if (imageErr) {
    console.error("Error deleting image:", imageErr.message);
    return false;
  }}}
  
    console.log("DDDDDDAAAAATTTTAAAA",data);
    return data;
   
  }
  

