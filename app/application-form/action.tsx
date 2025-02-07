'use server'

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();
export async function fetchApplicantsData(pageData: any) {

  const userdata = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id",pageData.id)
   



  return data ;
}


  

