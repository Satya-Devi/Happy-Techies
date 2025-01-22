'use server'

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();
export async function fetchJobById(pageData: any) {

  const userdata = await supabase.auth.getUser();
  
 
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", userdata?.data?.user?.id)
    .eq("id", pageData.id)

  return  data ;
}