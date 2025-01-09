import { createClient } from "@/utils/supabase/server";
import { Button } from "@mantine/core";

export default async function EmpLogin() {
  const signIn = async () => {
    try {
      const supabase = createClient();

      // Fetch data
      const { data: data1, error: error1 } = await supabase
        .from("jobs")
        .select("*")
        // .neq("id","f79ba232-f3c1-488a-ac77-11d85b4a68dc")
        .eq("is_draft", true) // Exclude rows where isDraft is true
        .eq("employer_id", "32a55a83-eec5-4af4-bd05-e52a0f4eebbd"); // Match id

      if (error1) {
        console.error("Error fetching data:", error1);
      } else {
        console.log("Fetched data:", data1);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  await signIn();
  return (
    <>
      <h1>Sign In</h1>
    </>
  );
}
