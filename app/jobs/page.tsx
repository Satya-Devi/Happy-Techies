import { CardAICTA } from "@/components/CardAICTA/CardAICTA";
import { CardContentCTA } from "@/components/CardContentCTA/CardContentCTA";
import { Hero } from "@/components/Hero/Hero";
import SearchFilters from "@/components/SearchFilters";
import { Container, Grid, GridCol } from "@mantine/core";
import { Suspense } from "react";
import { JobList } from "./joblist";
import { createClient } from "@/utils/supabase/server";
import JobTabs from "@/components/JobTabs/JobTabs";
import SolutionAreaFilter from "@/components/SolutionAreaFilter/SolutionAreaFilter";
import { SFProRounded } from "../layout";
import classes from "./jobs.module.css";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    location?: string;
    remote?: string;
    includeFulltime?: string;
    includeContractor?: string;
    speciality?: string;
    company?: string;
    page?: string;
    count?: string;
  };
}) {
  const page = parseInt(searchParams?.page || "1");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let itemsPerPage = 10;

  if (searchParams?.count && ["25", "50"].includes(searchParams?.count)) {
    itemsPerPage = parseInt(searchParams?.count);
  }
  const searchParamsKey =
    searchParams?.query ||
    "" + searchParams?.location ||
    "" + searchParams?.remote ||
    "" + searchParams?.includeFulltime + searchParams?.includeContractor ||
    "" + searchParams?.speciality ||
    "" + searchParams?.company ||
    "";

  return (
    <>
      <head>
        <title>Microsoft Tech Job Listings</title>
        <meta
          name="description"
          content="Find the latest Microsoft-focused tech jobs. Browse roles in Azure, Dynamics, Power BI, and more. Apply today with HappyTechies."
        />
      </head>
      <Hero
        title="Stop the endless scroll of job searching"
        subtitle="Only relevent Microsoft Technology jobs here"
        align="center"
        // backButtonStyles={{ marginLeft: "20px" }}
      />
      <Container
        size="xl"
        className={`${SFProRounded.className} ${classes.container}`}
        mx={"auto"}
      >
        <SolutionAreaFilter />
        <JobTabs />
        <main>
          <Grid>
            <GridCol
              style={{ overflowY: "scroll" }}
              py={0}
              span={{ base: 12, md: 8 }}
            >
              <Suspense
                fallback={<span>Loading...</span>}
                key={searchParamsKey}
              >
                <JobList
                  user={user}
                  searchParams={searchParams}
                  page={page}
                  itemsPerPage={itemsPerPage}
                />
              </Suspense>
            </GridCol>

            <GridCol mt={20} span={{ base: 12, md: 4 }}>
              <SearchFilters />
              <CardAICTA />
              <CardContentCTA />
            </GridCol>
          </Grid>
        </main>
      </Container>
    </>
  );
}
