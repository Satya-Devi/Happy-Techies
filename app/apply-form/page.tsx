import { Hero } from "@/components/Hero/Hero";
import ApplicantForm from "@/components/ApplicantForm/ApplicantForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ApplyForm({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const submitApplication = async (formData: FormData) => {
    "use server";
    const supabase = createClient();
    console.log("checking", formData);
    
    // const applicationData = {
    //   job_id: searchParams.jobId,
    //   user_id: user?.id,
    //   employer_name: formData.get('employerName'),
    //   phone_number: formData.get('phoneNumber'),
    //   experience: formData.get('experience'),
    //   start_date: formData.get('startDate'),
    //   email: formData.get('email'),
    //   employment_status: formData.get('employmentstatus'),
    //   linkedin_profile: formData.get('linkedinProfile'),
    //   certification: formData.get('certification'),
    //   resume_url: formData.get('uploadResume'),
    //   cv_url: formData.get('uploadCV'),
      
    //   created_at: new Date().toISOString()
    // };
 
    // const { data, error } = await supabase
    //   .from('applications')
    //   .insert([applicationData])
    //   .select();

  //   if (error) {
  //     throw new Error('Failed to submit application');
  //   }

  //   redirect('/applications');
   };

  return (
    <div>
      <Hero
        title="Candidate Profile"
        subtitle="Submit your application"
        align="center"
        page="apply-form"
      />
      <ApplicantForm jobId={searchParams?.job_id} />
    </div>
  );
}


