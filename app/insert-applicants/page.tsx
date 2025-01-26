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
//   const addApplicant = async () => {
//     const { data, error } = await supabase
//       .from('applicants')
//       .insert([
//         {
//             full_name: "Daniel Wilson",
//             phone_number: "+12125551234",
//             experience: 8, 
//             available_start_date: "2024-07-15",
//             email: "daniel.wilson@example.com",
//             current_employement_status: "Employed",
//             linkedin_profile: "https://linkedin.com/in/danielwilson",
//             is_saved: false,
//             is_archived: false
//           },
//           {
//             full_name: "Sophia Martinez",
//             phone_number: "+13216549876",
//             experience: 6, 
//             available_start_date: "2024-06-25",
//             email: "sophia.martinez@example.com",
//             current_employement_status: "Unemployed",
//             linkedin_profile: "https://linkedin.com/in/sophiamartinez",
//             is_saved: true,
//             is_archived: false
//           },
//           {
//             full_name: "James Anderson",
//             phone_number: "+14561238974",
//             experience: 4, 
//             available_start_date: "2024-09-05",
//             email: "james.anderson@example.com",
//             current_employement_status: "Freelancer",
//             linkedin_profile: "https://linkedin.com/in/jamesanderson",
//             is_saved: true,
//             is_archived: false
//           },
//           {
//             full_name: "Olivia Thomas",
//             phone_number: "+17895461230",
//             experience: 9, 
//             available_start_date: "2024-07-20",
//             email: "olivia.thomas@example.com",
//             current_employement_status: "Employed",
//             linkedin_profile: "https://linkedin.com/in/oliviathomas",
//             is_saved: false,
//             is_archived: true
//           },
//           {
//             full_name: "William Scott",
//             phone_number: "+19874563210",
//             experience: 3, 
//             available_start_date: "2024-08-10",
//             email: "william.scott@example.com",
//             current_employement_status: "Looking for Opportunities",
//             linkedin_profile: "https://linkedin.com/in/williamscott",
//             is_saved: true,
//             is_archived: false
//           }
//         ]);
  
//     if (error) {
//       console.error("Error inserting applicant:", error);
//     } else {
//       console.log("Applicant added successfully:", data);
//     }
//   };
  
//  addApplicant();
  return (
    <div>
        <h1>Insert Data</h1>
    </div>
  );
}
