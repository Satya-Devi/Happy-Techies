import { SFProRounded } from "@/app/layout";
import { CertificationCard } from "@/components/CertificationCard/page";
import { ExploreJobsButton } from "@/components/ExploreJobsButton/ExploreJobsButton";
import { Hero } from "@/components/Hero/Hero";
import { LearningPathCard } from "@/components/LearningPathCard/page";
import SearchLearningPathLevel from "@/components/SearchLearningPathLevel";
import { createClient } from "@/utils/supabase/server";
import {
  Badge,
  Box,
  Container,
  Grid,
  GridCol,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import fs from "fs/promises";
import path from "path";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    learningPathLevel?: string;
  };
}) {
  const supabase = createClient();

  const { id } = params;
  const { learningPathLevel } = searchParams || {};

  //   const response = await fetch("https://learn.microsoft.com/api/catalog/");
  //   const data = await response.json();
  //   const roles: { id: keyof typeof roleCategories; name: string }[] = data.roles;

  //   console.log(data);

  const filePath = path.join(process.cwd(), "api_catalog.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(fileContents);

  const learningPaths = data.learningPaths.filter(
    (learningPath: { roles: string[]; levels: string[] }) =>
      learningPath.roles.includes(id) &&
      (!learningPathLevel || learningPath.levels.includes(learningPathLevel))
  );

  const certifications = data.certifications.filter(
    (certification: { roles: string[] }) => certification.roles.includes(id)
  );

  const skills = data.mergedCertifications.reduce(
    (acc: string[], certification: { roles: string[]; products: string[] }) => {
      if (certification.roles.includes(id)) {
        acc.push(...certification.products);
      }
      return acc;
    },
    []
  );

  const uniqueSkills: string[] = Array.from(new Set(skills));

  let { data: role, error } = await supabase
    .from("roles")
    .select("*")
    .eq("microsoftId", id)
    .single();

  if (error) return <div>Error: {error.message}</div>;
  if (!role) return <div>No roles found</div>;

  return (
    <>
      <Hero title="" subtitle="" align="center" />

      <Container size="xl">
        <main>
          <Group align="center" justify="space-between">
            <div>
              {/* <Text tt="uppercase" size="sm" pb="xs">
                Role
              </Text> */}
              <Title order={1} className={SFProRounded.className} c="#004a93">
                {role.title}
              </Title>
            </div>
            <ExploreJobsButton searchTerm={role.title || ""} />
          </Group>

          <Grid>
            <GridCol span={{ base: 12, md: 8 }}>
              <Box pt="xl">
                <Title order={2} fw={700} pb="xs" className={SFProRounded.className}>
                  Overview
                </Title>
                <Text
                  mr="xl"
                  pr="xl"
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {role.overview}
                </Text>
              </Box>
            </GridCol>

            <GridCol span={{ base: 12, md: 8 }}>
              <Box pt="xl">
                <Title order={2} fw={700} pb="xs" className={SFProRounded.className}>
                  Microsoft skills
                </Title>
                {uniqueSkills.length ? (
                  uniqueSkills.slice(0, 10).map((skill: string) => (
                    <Badge
                      key={skill}
                      variant="light"
                      color="blue"
                      size="lg"
                      radius="xl"
                      mr="xs"
                      mt="xs"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <Text>No skills found.</Text>
                )}
              </Box>
            </GridCol>

            <GridCol span={{ base: 12, md: 12 }}>
              <Box pt="xl">
                <Title order={2} fw={700} pb="xs" className={SFProRounded.className}>
                  Relevant certifications
                </Title>

                <SimpleGrid
                  cols={{ base: 1, md: 3 }}
                  verticalSpacing="lg"
                  spacing="lg"
                >
                  {certifications.length > 0 ? (
                    certifications.map((certification: any) => (
                      <CertificationCard
                        key={certification.url}
                        title={certification.title}
                        icon_url={certification.icon_url}
                        url={certification.url}
                      />
                    ))
                  ) : (
                    <Text>No relevant certifications found.</Text>
                  )}
                </SimpleGrid>
              </Box>
            </GridCol>
          </Grid>

          <Group align="center" justify="space-between" pt="xl" pb="lg">
            <div>
              <Title order={2} fw={700} pb="xs" className={SFProRounded.className}>
                All learning paths
              </Title>
              <Text component="div" c="dimmed" size="lg" fw={500} ta="left">
                {learningPaths.length} path(s) found
              </Text>
            </div>
            <SearchLearningPathLevel />
          </Group>

          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            verticalSpacing="lg"
            spacing="lg"
          >
            {learningPaths.map((learningPath: any) => (
              <LearningPathCard
                key={learningPath.url}
                title={learningPath.title}
                duration_in_minutes={learningPath.duration_in_minutes}
                subjects={learningPath.subjects}
                icon_url={learningPath.icon_url}
                levels={learningPath.levels}
                url={learningPath.url}
              />
            ))}
          </SimpleGrid>
        </main>
      </Container>
    </>
  );
}
