import { Hero } from "@/components/Hero/Hero";
import SuggestionResults from "@/components/SuggestionResults";
import { Container } from "@mantine/core";
import { fetchRoleSuggestions, getMatchingJobs, getRecommendedJobs } from "../actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const query = searchParams.query;
  if (!query) {
    return <div>Error: No query provided</div>;
  }

  // const data = await fetchRoleSuggestions(query).catch((error) => {
  //   console.error("Error fetching role suggestions:", error);
  //   return null;
  // });

  // if (!data) {
  //   return <div>Error: Unable to process your request</div>;
  // }

  //const { skills, location } = data;
  // const recs = await getRecommendedJobs(skills, location).catch((error) => {
  //   console.error("Error getting recommended jobs:", error);
  //   return null;
  // });

  const userQuery = query.toLowerCase()
  .replace(/(?:^|\s)[a-z]/g, function (m) {
    return m.toUpperCase();
  });

  const recs = await getMatchingJobs(userQuery)

  if (!recs) {
    return <div>Error finding recommended jobs</div>;
  }

  return (
    <>
      <Hero title="" subtitle="" align="center" />
      <Container size="xl">
        <main>
          <SuggestionResults recs={recs} query={query} />
        </main>
      </Container>
    </>
  );
}