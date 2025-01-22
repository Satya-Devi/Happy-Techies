import { Hero } from "@/components/Hero/Hero";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ViewAllButton } from "./ViewAllButton";
import MyJobs from "../MyJobs";
import { Container, Text, Box } from "@mantine/core";
import { fetchJobsData} from "@/app/my-jobs/action";


export default async function Dashboard(
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
    if (!(empData && empData.length > 0 && empData[0].is_employer_login)) {
      redirect("/employers-login");
    }
  } else {
    redirect("/employers-login");
  }
  const result = await fetchJobsData({pagename:"Dashboard"});

  // const { data, error } = await supabase
  //   .from("jobs")
  //   .select("*")
  //   .eq("employer_id", userdata?.data?.user?.id) // Match employer_id
  //   //.eq("id", "4b60e2db-637b-4580-a14f-1f984a097a83") // Match id
  //   //  2e13eb5c-f88a-42ab-9262-5538d11ca315
  //   .neq("is_draft", true); // Exclude rows where isDraft is true

  // if (error) {
  //   console.error("Error fetching data:", error);
  // } else {
  //   console.log("Fetched data:", data);
  // }
  
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingBottom: "20px",
        }}
      >
        <Container>
          <div
            style={{
              fontSize: "43px",
              fontWeight: 700,
              marginBottom: 10,
              color: "#004A93",
              marginTop: 30,
              letterSpacing: "1px",
            }}
          >
            Your Hiring Dashboard
          </div>
          <div
            style={{
              fontSize: "27px",
              fontWeight: 500,
              marginBottom: 20,
              color: "#004A93",
              letterSpacing: "1px",
            }}
          >
            Monitor, Analyze And Optimize Your Hiring Process
          </div>
        </Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            justifyItems: "center",
            gap: "25px",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              height: "90px",
              width: "300px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <div
                style={{ fontSize: "20px", fontWeight: 600, color: "#004A93" }}
              >
                {result?.count}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  color: "#00000099",
                }}
              >
                Open Jobs
              </div>
            </div>
            <div>
              <svg
                width="20"
                height="19"
                viewBox="0 0 20 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5M10 10V10.01M1 11C3.79158 12.4067 6.87403 13.1394 10 13.1394C13.126 13.1394 16.2084 12.4067 19 11M1 7C1 6.46957 1.21071 5.96086 1.58579 5.58579C1.96086 5.21071 2.46957 5 3 5H17C17.5304 5 18.0391 5.21071 18.4142 5.58579C18.7893 5.96086 19 6.46957 19 7V16C19 16.5304 18.7893 17.0391 18.4142 17.4142C18.0391 17.7893 17.5304 18 17 18H3C2.46957 18 1.96086 17.7893 1.58579 17.4142C1.21071 17.0391 1 16.5304 1 16V7Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div
            style={{
              height: "90px",
              width: "300px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <div
                style={{ fontSize: "20px", fontWeight: 600, color: "#004A93" }}
              >
                0
              </div>
              <div
                style={{
                  fontWeight: 500,
                  color: "#00000099",
                }}
              >
                Applicants
              </div>
            </div>
            <div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 19V17C1 15.9391 1.42143 14.9217 2.17157 14.1716C2.92172 13.4214 3.93913 13 5 13H9C10.0609 13 11.0783 13.4214 11.8284 14.1716C12.5786 14.9217 13 15.9391 13 17V19M14 1.12988C14.8604 1.35018 15.623 1.85058 16.1676 2.55219C16.7122 3.2538 17.0078 4.11671 17.0078 5.00488C17.0078 5.89305 16.7122 6.75596 16.1676 7.45757C15.623 8.15918 14.8604 8.65958 14 8.87988M19 18.9999V16.9999C18.9949 16.1171 18.6979 15.2607 18.1553 14.5643C17.6126 13.8679 16.8548 13.3706 16 13.1499M3 5C3 6.06087 3.42143 7.07828 4.17157 7.82843C4.92172 8.57857 5.93913 9 7 9C8.06087 9 9.07828 8.57857 9.82843 7.82843C10.5786 7.07828 11 6.06087 11 5C11 3.93913 10.5786 2.92172 9.82843 2.17157C9.07828 1.42143 8.06087 1 7 1C5.93913 1 4.92172 1.42143 4.17157 2.17157C3.42143 2.92172 3 3.93913 3 5Z"
                  stroke="black"
                  stroke-opacity="0.4"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
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
          Recently Posted Jobs
        </div>
        <ViewAllButton redirectUrl={"/my-jobs"} />
      </Box>
      <MyJobs
        pagename={"overview"}
        showPagination={false}
      />
    </div>
  );
}
