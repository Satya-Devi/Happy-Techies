import { fetchGlassdoorRating } from "@/app/actions";
import { SFProRounded } from "@/app/layout";
import { CardAICTA } from "@/components/CardAICTA/CardAICTA";
import { CardContentCTA } from "@/components/CardContentCTA/CardContentCTA";
import { CardImage } from "@/components/CardImage/CardImage";
import { Hero } from "@/components/Hero/Hero";
import { Job } from "@/components/Job/Job";
import JobCardSmall from "@/components/JobCardSmall/JobCardSmall";
import { createClient } from "@/utils/supabase/server";
import {
  Box,
  Card,
  CardSection,
  Container,
  Grid,
  GridCol,
  Group,
  Image,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { getStoryblokApi } from "@storyblok/react/rsc";
import { IconCertificate, IconMapPin, IconPinned, IconUsers, IconTrophy } from "@tabler/icons-react";
import Link from "next/link";
import classes from "../partner.module.css";
import { RatingComponent } from "@/components/Rating/Rating";

const fetchCareerService = async (slug: string) => {
  const client = getStoryblokApi();
  const response = await client.get(`cdn/stories/partners/${slug}`, {
    version: "published",
  });
  return response.data.story;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const story = await fetchCareerService(params.slug);

  const { data: jobs, error: error } = await supabase
    .from("jobs")
    .select()
    .textSearch("company_name", story.content.name);

  if (error) console.error(error);

  const glassdoorRating = await fetchGlassdoorRating(
    story.content.glassdoor_company_id
  );
  const { rating = "N/A", reviewCount = 0 } = glassdoorRating || {};

  return (
    <>
      <Hero
        title=""
        subtitle=""
        // employer_logo={story.content.logo.filename}
        // isPartner={true}
        align="center"
        backButtonStyles={{ marginLeft: "20px" }}
      />
      <Container size="xl" className={`${SFProRounded.className} ${classes.container_detail}`}>
        <main>
          <Grid>
            <GridCol span={{ base: 12, md: 8 }}>
              <Container>
                {/* <Text tt="uppercase" size="sm" pb="xs">
                  Partner Profile
                </Text> */}

                <Group>
                  <CardImage employer_logo={story.content.logo.filename} />
                  <Title
                    ta="left"
                    order={1}
                    c="#004a93"
                    className={SFProRounded.className}
                    component="h1"
                  >
                    {story.content.name}
                  </Title>
                </Group>

                <Box pt="xl">
                  <Title
                    order={2}
                    fw={700}
                    pb="xs"
                    className={SFProRounded.className}
                  >
                    Brief
                  </Title>
                  <Text
                    mr="xl"
                    pr="xl"
                    style={{
                      whiteSpace: "pre-line",
                    }}
                    component="h2"
                  >
                    {story.content.brief}
                  </Text>
                </Box>

                <Container px={0} py="xl" visibleFrom="sm">
                  <Title
                    ta="left"
                    order={1}
                    pb="md"
                    className={SFProRounded.className}
                  >
                    Available positions
                  </Title>
                  {jobs && jobs.length > 0 ? (
                    <SimpleGrid cols={1}>
                      {jobs.map((job) => (
                        <GridCol span={12} p={0} key={job.id}>
                          <Link
                            href={`/jobs/${job.id}`}
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <JobCardSmall job={job} />
                          </Link>
                        </GridCol>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text>No available positions found.</Text>
                  )}
                </Container>
              </Container>
            </GridCol>

            <GridCol span={{ base: 12, md: 4 }}>
              <Card p="lg" my="md" radius="md">
                <CardSection
                  p="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ThemeIcon variant="light">
                      <IconMapPin style={{ width: "70%", height: "70%" }} />
                    </ThemeIcon>
                    <Text
                      c="#000000B2"
                      fw={500}
                      // tt="uppercase"
                      style={{ marginLeft: "10px" }}
                    >
                      Location
                    </Text>
                  </div>
                  <Text fw={500} style={{ marginTop: "10px" }}>
                    {story.content.location}
                  </Text>
                </CardSection>

                <CardSection
                  p="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ThemeIcon variant="light">
                      <IconUsers style={{ width: "70%", height: "70%" }} />
                    </ThemeIcon>
                    <Text
                      c="#000000B2"
                      fw={500}
                      // tt="uppercase"
                      style={{ marginLeft: "10px" }}
                    >
                      Employees
                    </Text>
                  </div>
                  <Text fw={500} style={{ marginTop: "10px" }}>
                    {story.content.employees}
                  </Text>
                </CardSection>

                <CardSection
                  p="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ThemeIcon variant="light">
                      <IconTrophy style={{ width: "70%", height: "70%" }} />
                    </ThemeIcon>
                    <Text
                      c="#000000B2"
                      fw={500}
                      // tt="uppercase"
                      style={{ marginLeft: "10px" }}
                      component="h1"
                    >
                      Microsoft Partner Awards
                    </Text>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {["2024", "2023", "2022"].map((year) => {
                      const awards = story.content[`awards_${year}`];
                      if (
                        awards &&
                        awards.trim() !== "N/A" &&
                        awards.trim() !== "-"
                      ) {
                        return (
                          <Box key={year} style={{ marginBottom: "10px" }}>
                            <Text fw={500}>{year}</Text>
                            <ul
                              style={{
                                listStyleType: "disc",
                                paddingLeft: "20px",
                                margin: 0,
                              }}
                            >
                              {awards.split(",").map((award: string) => (
                                <li>
                                  <Tooltip
                                    label={award.trim()}
                                    key={award.trim()}
                                  >
                                    <Text>{award.trim()}</Text>
                                  </Tooltip>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        );
                      }
                      return null;
                    })}
                  </div>
                </CardSection>
                <CardSection
                  p="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ThemeIcon variant="light">
                      <IconCertificate
                        style={{ width: "70%", height: "70%" }}
                      />
                    </ThemeIcon>
                    <Text
                      c="#000000B2"
                      fw={500}
                      // tt="uppercase"
                      style={{ marginLeft: "10px" }}
                      component="h1"
                    >
                      Microsoft Specializations
                    </Text>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <ul
                      style={{
                        listStyleType: "disc",
                        paddingLeft: "20px",
                        margin: 0,
                      }}
                    >
                      {story.content.specializations
                        .split(",")
                        .map((specialization: string) => (
                          <li
                            key={specialization.trim()}
                            style={{ marginBottom: "5px" }}
                          >
                            <Tooltip label={specialization.trim()}>
                              <Text fw={500} truncate>
                                {specialization.trim()}
                              </Text>
                            </Tooltip>
                          </li>
                        ))}
                    </ul>
                  </div>
                </CardSection>

                <CardSection
                  p="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                  }}
                >
                  <Image
                    src="/images/glassdoor.png"
                    alt="Glassdoor"
                    w={125}
                    h="auto"
                    fit="contain"
                    mb="xs"
                    style={{ maxWidth: "125px" }}
                  />
                  <Group gap={0} align="center">
                    <RatingComponent rating={rating} />
                    <Text fw={500} ml={2} mb={5}>| {reviewCount} reviews</Text>
                  </Group>
                </CardSection>
              </Card>

              <Container px={0} py="xl" hiddenFrom="sm">
                <Title
                  ta="left"
                  order={1}
                  pb="md"
                  className={SFProRounded.className}
                  component="h2"
                >
                  Available positions
                </Title>
                <SimpleGrid cols={1}>
                  {jobs && jobs.length > 0 ? (
                    <SimpleGrid cols={1}>
                      {jobs.map((job) => (
                        <GridCol span={12} p={0} key={job.id}>
                          <Link
                            href={`/jobs/${job.id}`}
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <JobCardSmall job={job} />
                          </Link>
                        </GridCol>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text>No available positions found.</Text>
                  )}
                </SimpleGrid>
              </Container>

              <CardAICTA />
              <CardContentCTA />
            </GridCol>
          </Grid>
        </main>
      </Container>
    </>
  );
}
