"use client";
import { useEffect } from "react";
import { generateJobSuggestions, getMatchingJobs } from "@/app/actions";
import { SFProRounded } from "@/app/layout";
import {
  Button,
  Container,
  Grid,
  Group,
  Loader,
  Pagination,
  Paper,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconBriefcaseFilled, IconReload } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import JobCardSmall from "./JobCardSmall/JobCardSmall";

type SuggestionResultsProps = {
  recs: any[];
  query: string;
};

export default function SuggestionResults({
  recs,
  query,
}: SuggestionResultsProps) {
  const [value, setValue] = useState(query);
  const [generatedJobs, setGeneratedJobs] = useState<any[]>(recs);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const pageSize = 10;

  const handleGenerateMore = async () => {
    setLoading(true);
    try {
      // const jobs = await generateJobSuggestions(value);

      const query = value.toLowerCase()
      .replace(/(?:^|\s)[a-z]/g, function (m) {
        return m.toUpperCase();
      });

      const jobs = await getMatchingJobs(query)
      setGeneratedJobs(jobs || []);
      setActivePage(1)
    } catch (error) {
      console.error("Error generating job suggestions:", error);
      setGeneratedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedJobs = generatedJobs.sort((a, b) => {
    return b.relevancy_score - a.relevancy_score;
  });

  const totalPages = Math.ceil(sortedJobs.length / pageSize);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  useEffect(() => {
    if (activePage > totalPages && totalPages > 0) {
      setActivePage(totalPages);
    }
  }, [activePage, totalPages]);

  return (
    <>
      {/* <Paper p="xl" mt="xl" radius="md"> */}
        <Group align="center" pt={0}>
          <ThemeIcon variant="white" size="xl">
            <IconBriefcaseFilled style={{ width: "80%", height: "80%" }} />
          </ThemeIcon>
          <Title order={1} className={SFProRounded.className}>
            Job results
          </Title>
        </Group>
        <Container pl={0} ml={0} pr="xl" mt="xs" mb="lg">
          <Text c="dimmed" size="lg" fw={500} ta="left">
            Here are some recommended suggestions for you.
          </Text>
        </Container>

        <Grid gutter="md"> {/* This creates spacing between grid items */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {loading ? (
              <Container
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <Loader size="md" />
              </Container>
            ) : generatedJobs.length > 0 ? (
              generatedJobs.map((job) => (
                <Container
                  px={0}
                  my="sm" // This adds vertical spacing between cards
                  key={job.id}
                  className={SFProRounded.className}
                >
                  <Link
                    href={`/jobs/${job.id}`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <JobCardSmall job={job} />
                  </Link>
                </Container>
              ))
            ) : (
              <Container py="xl" pl={0}>
                <Text size="lg" fw={500} ta="left">
                  Oops.. could not find any roles. Please try another query.
                </Text>
              </Container>
            )}
               <Textarea
          size="lg"
          radius="md"
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="I am a Power BI Developer looking for an opportunity..."
        />

        <Button
          leftSection={<IconReload size={14} />}
          fullWidth
          mt="lg"
          radius="md"
          size="lg"
          color="blue" // Change color to a valid color value
          onClick={handleGenerateMore}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate more answers"}
        </Button>
          </Grid.Col>
        </Grid>
      {/* </Paper> */}
    </>
  );
}

