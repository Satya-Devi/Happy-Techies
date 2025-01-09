import { CardAICTA } from "@/components/CardAICTA/CardAICTA";
import { CardContentCTA } from "@/components/CardContentCTA/CardContentCTA";
import { Hero } from "@/components/Hero/Hero";
import Search from "@/components/Search";
import { createClient } from "@/utils/supabase/server";
import {
  Button,
  Center,
  Container,
  Grid,
  GridCol,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SFProRounded } from "../layout";
import JobCardSmall from "@/components/JobCardSmall/JobCardSmall";
import Head from "next/head";

import classes from "./tracker.module.css";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const supabase = createClient();
  const query = searchParams?.query || "";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  let { data: saved_jobs, error } = await supabase
    .from("saved_jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error(error);

  let jobs = saved_jobs
    ? saved_jobs.filter((job) =>
        job.job_title?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <head>
        <title>
          My Jobs – Your Saved Microsoft Career Opportunities
        </title>
        <meta
          name="description"
          content="Keep track of your saved job postings. Review and apply to your preferred Microsoft tech roles on HappyTechies."
        />
      </head>
      <Hero title="My Dashboard" subtitle="" align="center" />
      {/* <Container style={{ width: "100%" }} ml="30px"> */}
      <div>
        <Grid gutter="xs">
          <GridCol span={{ base: 12, md: 6 }}>
            <Group pb="sm" justify="space-between" className={classes.saveJob}>
              <div>
                <Title ta="left" order={1} className={SFProRounded.className}>
                  Saved jobs
                </Title>
                <Text c="dimmed" size="lg" fw={500} ta="left">
                  {jobs?.length.toLocaleString()} job(s) found
                </Text>
              </div>
              <Search placeholder="Search" />
            </Group>

            {jobs?.length === 0 && (
              <div>
                <Paper p={30} mt={30} ml={30} radius="md" bg="none">
                  <Title ta="center" order={3}>
                    No saved jobs found
                  </Title>
                  <Text c="dimmed" size="lg" ta="center" mt={5}>
                    Search for another role or browse more jobs.
                  </Text>
                  <Center mt="md">
                    <Button
                      variant="filled"
                      radius="md"
                      size="md"
                      color="#004a93"
                      component="a"
                      href="/jobs"
                    >
                      Browse jobs
                    </Button>
                  </Center>
                </Paper>
              </div>
            )}

            {jobs?.map((job) => (
              <div key={job.id}>
                <Container px={0} my="xs" className={classes.jobCard}>
                  <Link
                    href={`/jobs/${job.job_id}`}
                    style={{
                      textDecoration: "none",
                    }}
                    key={job.id}
                  >
                    <JobCardSmall
                      userId={user.id}
                      job={job}
                      isTracker={true}
                      key={job.id}
                    />
                  </Link>
                </Container>
              </div>
            ))}
          </GridCol>
          <GridCol span={{ base: 12, md: 1 }}></GridCol>
          <GridCol span={{ base: 12, md: 3 }}>
            <CardAICTA />
            <CardContentCTA />
          </GridCol>
          {/* <GridCol span={{ base: 12, md: 1 }}></GridCol> */}
        </Grid>
      </div>
      {/* </Container> */}
    </>
  );
}
