import { Hero } from "@/components/Hero/Hero";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DraftTable from "./DraftTable";
import { Container, Text, Box } from "@mantine/core";
import { ViewAllButton } from "@/components/Dashboard/ViewAllButton";
export default async function Draft(
//   {
//   searchParams,
// }: {
//   searchParams: { [key: string]: string };
// }
) {
  const supabase = createClient();
  const userdata = await supabase.auth.getUser();
  console.log("User: ", userdata?.data?.user?.id);
  if (userdata?.data?.user?.id) {
    const { data: empData, error: empError } = await supabase
      .from("employer_details")
      .select("*")
      .eq("id", userdata?.data?.user?.id);

    console.log("==========", empData);
    if (empError) {
      console.error("Error fetching user:", empError);
      return;
    }
    if (!(empData && empData.length > 0)) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }


 
  return (
    <div>
      <Box
        mx="auto"
        style={{
          maxWidth: "85%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "23px",
            fontWeight: 600,
            color: "#000",
          }}
        >
          Saved Job Drafts
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
           <ViewAllButton redirectUrl={"/my-drafts"} />
         
        
        </div>
      </Box>
      <div>
        <DraftTable
          pagename={"overview"}
          showPagination={false}
        />
      </div>
    </div>
  );
}
