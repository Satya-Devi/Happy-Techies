'use server'

import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

// export async function fetchJobById(pageData: any) {

//   const userdata = await supabase.auth.getUser();
  
 
//   const { data, error } = await supabase
//     .from("jobs")
//     .select("*")
//     .eq("employer_id", userdata?.data?.user?.id)
//     .eq("id", pageData.id)

//   return  data ;
// }
export async function insertPaymentData(formData: any) {
  const userdata = await supabase.auth.getUser();
  console.log("formData", formData);
  

  if (formData?.jobId) { 
    const { data: insertData, error: insertError } = await supabase
      .from("payment_details")
      .insert([
        {
        job_id: formData?.jobId || null,
          company_name: formData?.data?.companyName || null,
          employer_name: formData?.data?.employerName || null,
          contact_number: formData?.data?.contactNumber || null,
          billing_address: formData?.data?.billingAddress || null,
          country: formData?.data?.country || null,
          employer_email: formData?.data?.emailAddress || null,
          employer_id: userdata?.data?.user?.id,
        },
      ])
      .select('id')  // Explicitly requesting the 'id' field of the inserted row
      .single();
    if (insertError) {
      console.error("Error inserting job", insertError);
      return {status:false};
    } else {
      console.log("Job inserted successfully", insertData);
       return {id:insertData?.id, status:true, empId: userdata?.data?.user?.id};
    }
  }
};