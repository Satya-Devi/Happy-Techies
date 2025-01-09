import { Hero } from "@/components/Hero/Hero";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DraftTable from "./DraftTable";
import { Container, Text, Box } from "@mantine/core";

export default async function Draft({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
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
    if (!(empData && empData.length > 0 && empData[0].is_employer_login)) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", userdata?.data?.user?.id) // Match employer_id
    //.eq("id", "4b60e2db-637b-4580-a14f-1f984a097a83") // Match id
    //  2e13eb5c-f88a-42ab-9262-5538d11ca315
    .neq("is_draft", false); // Exclude rows where isDraft is true

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Fetched data:", data);
  }
  const signUp = async (formData: any) => {
    "use server";
    console.log("formData", formData);
    let formattedDate = null;
    if (formData?.deadline) {
      const date = new Date(formData?.deadline);
      formattedDate = date.toISOString().split("T")[0];
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      // .eq("employer_id", data1?.data?.user?.id) // Match employer_id
      .eq("id", "4b60e2db-637b-4580-a14f-1f984a097a83") // Match id
      //  2e13eb5c-f88a-42ab-9262-5538d11ca315
      .neq("is_draft", true); // Exclude rows where isDraft is true

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log("Fetched data:", data);
    }
  };
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
          <Text size="lg" fw={600} c="#00000099">
            View All
          </Text>
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5H15M15 5L11 9M15 5L11 1"
              stroke="black"
              stroke-opacity="0.6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </Box>
      <div>
        <DraftTable
          searchParams={searchParams}
          onSubmit={signUp}
          data={data}
          showPagination={false}
        />
      </div>
    </div>
  );
}
