// "use client"
import { Container, Group, Paper, Text, Title } from "@mantine/core";
import MobileFilter from "@/components/MobileFilter/MobileFilter";
import PaginatedSearch from "@/components/PaginatedSearch";
import Link from "next/link";
import { fetchJobs } from "../actions";
import { SFProRounded } from "../layout";
import { User } from "@supabase/supabase-js";
import JobCardSmall from "@/components/JobCardSmall/JobCardSmall";
// import { useRouter } from 'next/navigation'

type JobListProps = {
  searchParams?: {
    query?: string;
    location?: string;
    company?: string;
    remote?: string;
    includeFulltime?: string;
    includeContractor?: string;
    speciality?: string;
    page?: string;
    tab?: string;
    filter?: string;
  };
  page: number;
  itemsPerPage: number;
  user:User|null
};

export async function JobList({
  searchParams,
  page,
  itemsPerPage,
  user,
}: JobListProps) {
  const { jobs, error, count } = await fetchJobs({
    query: searchParams?.query || "",
    location: searchParams?.location || "",
    company: searchParams?.company || "",
    remote: searchParams?.remote || "",
    includeFulltime: searchParams?.includeFulltime || "",
    includeContractor: searchParams?.includeContractor || "",
    speciality: searchParams?.speciality || "",
    page,
    itemsPerPage,
    tab: searchParams?.tab || "hot-jobs",
    filter: searchParams?.filter || "",
  });
  // const router = useRouter()

  const title = (
    // <Title
    //   order={1}
    //   pt="lg"
    //   className={SFProRounded.className}
    //   fw={600}
    //   style={{
    //     lineHeight: "1.2",
    //     letterSpacing: "-1.45px",
    //   }}
    // >
    //   Recent job posts
    // </Title>
    <></>
  );

  if (error) {
    return (
      <Container px={0}>
        <Group justify="space-between">
          <div>
            {title}
            <Text component="div" c="dimmed" size="lg" fw={500} ta="left">
              No jobs found for your search query.
            </Text>
          </div>
          <MobileFilter />
        </Group>
      </Container>
    );
  }

  return (
    <>
      <Container px={0} className={SFProRounded.className}>
        <Group justify="space-between">
          {/* <div>
            {title}
            <Text component="div" c="gray" size="md"  fw={500} ta="left">
              {count?.toLocaleString()} job(s) found
            </Text>
          </div> */}

          {/* <div style={{ width: "25%" }}>
            <PageSizeSelection />
          </div> */}
          <MobileFilter />
        </Group>
      </Container>

      {jobs?.length === 0 && (
        <Container fluid my="xs" className={SFProRounded.className}>
          <Paper p={30} mt={30} radius="md">
            <Title ta="center" order={3} className={SFProRounded.className}>
              No data found
            </Title>
            <Text c="dimmed" size="lg" ta="center" mt={5} className={SFProRounded.className}>
              No jobs found for your search query.
            </Text>
          </Paper>
        </Container>
      )}

      {jobs?.map((job) => (
        <Container px={0} my="sm" key={job.id} className={SFProRounded.className}>
          <Link
            href={`/jobs/${job.id}`}
            style={{
              textDecoration: "none",
            }}
            key={job.id}
          >
            <JobCardSmall userId={user?.id} job={job} key={job.id} />
          </Link>
        </Container>
      ))}

      <PaginatedSearch total={count || 0} itemsPerPage={itemsPerPage} />
    </>
  );
}
