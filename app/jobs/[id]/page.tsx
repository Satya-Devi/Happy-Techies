import { SFProRounded } from "@/app/layout";
import { CardAICTA } from "@/components/CardAICTA/CardAICTA";
import { CardContentCTA } from "@/components/CardContentCTA/CardContentCTA";
import { CardImage } from "@/components/CardImage/CardImage";
import { ContainedNav } from "@/components/ContainedNav/ContainedNav";
import { Job } from "@/components/Job/Job";
import SaveJobButton from "@/components/SaveJobButton";
import { capitalize } from "@/utils/supabase/dto";
import { createClient } from "@/utils/supabase/server";
import {
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Container,
  Grid,
  GridCol,
  Group,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconBriefcase,
  IconCalendarBolt,
  IconCash,
  IconCode,
  IconMapPin,
  IconGolf,
  IconBookmark,
  IconCoin,
  IconMail,
  IconBrandLinkedin,
  IconX,
  IconBrandFacebook,
} from "@tabler/icons-react";
import { FaUserShield } from "react-icons/fa";
import Link from "next/link";
import CardCompany from "@/components/cardCompany/cardCompany";
import BackButton from "@/components/BackButton/BackButton";
import JobCardSmall from "@/components/JobCardSmall/JobCardSmall";
import classes from "../jobs.module.css";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .select()
    .eq("id", params.id)
    .single();

  if (error || job === null) return <div>Job not found.</div>;

  let { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select()
    .neq("id", job.id)
    .overlaps("skills", job.skills || [])
    .limit(100);

  if (jobsError || jobs === null) return <div>Similar jobs not found.</div>;

  jobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 3);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let jobIsSaved = false;
  if (user) {
    const { data: savedJob, error } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", job.id)
      .maybeSingle();

    if (error) console.error("Error fetching the saved job", error);
    else jobIsSaved = savedJob !== null;
  }

  const SaveButton = () => {
    if (!user) {
      return (
        <Button
          component="a"
          size="sm"
          bg="white"
          variant="outline"
          href="/login"
          fz="md"
          leftSection={
            <IconBookmark
              style={{
                color: "#489BE7",
                width: "15.16px",
                height: "18px",
                border: "1.89px",
              }}
            />
          }
          style={{
            width: "100%", // Fixed width
            height: "58px", // Fixed height
            padding: "16px 24px", // Custom padding
            borderRadius: "6px 0 0 0",
            border: "1px solid transparent",
            backgroundColor: "#fff",
            color: "#489BE7",
          }}
        >
          Save job
        </Button>
      );
    }

    if (jobIsSaved) {
      return (
        <Button
          component="a"
          fullWidth
          size="sm"
          bg="white"
          variant="outline"
          href="/tracker"
          disabled
          leftSection={
            <IconBookmark
              style={{
                color: "#489BE7",
                width: "15.16px",
                height: "18px",
                border: "1.89px",
              }}
            />
          }
          style={{
            width: "100%",
            height: "58px",
            padding: "16px 24px",
            borderRadius: "6px 0 0 0",
            border: "1px solid transparent",
            backgroundColor: "#fff",
            color: "#489BE7",
          }}
          fz="md"
        >
          Saved
        </Button>
      );
    }

    return (
      <SaveJobButton
        userId={user.id}
        job={{ ...job, created_at: job.created_at || "" }}
      />
    );
  };

  return (
    <>
    <head>
        <title>{job.job_title}</title>
        <meta
          name="description"
          content={job.job_description}
        />
      </head>
      <ContainedNav />
      <Container size="xl">
        <main>
          <Grid>
            <GridCol span={{ base: 12, md: 8 }}>
              <Container>
                {/* <CardImage employer_logo={job.employer_logo || ""} /> */}

                {/* <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "32px",
                    textAlign: "left",
                    color: "#000000B2",
                  }}
                  py="xs"
                  size="xl"
                >
                  Job detail
                </Text> */}
                <BackButton
                  BackButtonStyles={{
                    marginLeft: "-10px",
                  }}
                />
                <Group justify="space-between">
                  <Title
                    ta="left"
                    order={1}
                    c="#004a93"
                    className={`${SFProRounded.className} ${classes.TitleHeader}`}
                    style={{
                      // fontFamily: "Author-Variable.ttf",
                      Name: "XXDisplay",
                      // fontSize: "3rem",
                      fontWeight: 700,
                      // lineHeight: "73.2px",
                      textAlign: "left",
                      color: "#004A93",
                      wordBreak:"break-all"
                    }}
                  >
                    {job.job_title}
                  </Title>
                </Group>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaUserShield
                    size={24}
                    color={"#489BE7"}
                    style={{ marginRight: "8px" }}
                  />
                  <span
                    className={SFProRounded.className}
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      gap: "4px",
                      height: "25.6px",
                      color: "#000000B2",
                    }}
                  >
                    Role: Team Lead
                  </span>

                  <IconGolf
                    size={24}
                    strokeWidth={2}
                    color={"#489BE7"}
                    style={{ marginRight: "8px" }}
                  />
                  <span
                    className={SFProRounded.className}
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      gap: "4px",
                      height: "25.6px",
                      color: "#000000B2",
                    }}
                  >
                    Company: {job.company_name}
                  </span>
                </div>

                <Box pt="xl">
                  <Title
                    order={2}
                    fw={700}
                    pb="xs"
                    className={SFProRounded.className}
                  >
                    Job description
                  </Title>
                  <Text
                    mr="lg"
                    style={{
                      whiteSpace: "pre-line",
                      // fontName: "Inter Display",
                      lineHeight: "32px",
                    }}
                    className={SFProRounded.className}
                  >
                    {job.job_description}
                  </Text>
                </Box>

                <Box pt="lg">
                  <Title
                    order={2}
                    fw={700}
                    pb="xs"
                    className={SFProRounded.className}
                  >
                    Requirements
                  </Title>

                  <Container pr="xl">
                    {job.requirements && job.requirements.length > 0 ? (
                      job.requirements.map(
                        (requirement: string, index: number) => (
                          <div
                            key={requirement}
                            style={{
                              whiteSpace: "pre-line",
                              lineHeight: "32px",
                              paddingBottom: "xs",
                              marginLeft: "-16px",
                            }}
                            className={SFProRounded.className}
                          >
                            &bull; {requirement.trim()}
                          </div>
                        )
                      )
                    ) : (
                      <span>
                        No explicit requirements were found for this role.
                      </span>
                    )}
                  </Container>
                </Box>

                {/* <Button
                  mt="xl"
                  component="a"
                  size="lg"
                  color="#004a93"
                  href={job.job_listing_source_url?.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply now
                </Button> */}

                <Container px={0} py="xl">
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginRight: "20px",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      SHARE THIS OPENING
                    </Text>

                    <Box
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <a
                        href="mailto:?subject=Check out this job opening!"
                        title="Share via Email"
                      >
                        <img
                          src="/images/email.png"
                          alt="Email"
                          width="42px"
                          height="42px"
                        />
                      </a>
                      <a
                        href="https://www.linkedin.com/shareArticle"
                        target="_blank"
                        title="Share on LinkedIn"
                      >
                        <img
                          src="/images/linked.png"
                          alt="LinkedIn"
                          width="42px"
                          height="42px"
                        />
                      </a>
                      <a
                        href="https://twitter.com/intent/tweet"
                        target="_blank"
                        title="Share on X (formerly Twitter)"
                      >
                        <img
                          src="/images/x.png"
                          alt="X"
                          width="42px"
                          height="42px"
                        />
                      </a>
                      <a
                        href="https://www.facebook.com/sharer/sharer.php"
                        target="_blank"
                        title="Share on Facebook"
                      >
                        <img
                          src="/images/facebook.png"
                          alt="Facebook"
                          width="42px"
                          height="42px"
                        />
                      </a>
                    </Box>
                  </Box>
                </Container>

                <Container px={0} py="xl" visibleFrom="sm">
                  <Title
                    ta="left"
                    order={1}
                    pb="md"
                    className={SFProRounded.className}
                  >
                    Similar jobs
                  </Title>
                  {jobs.length > 0 ? (
                    <SimpleGrid cols={1}>
                      {jobs.map((job) => (
                        <Container
                          px={0}
                          my="sm"
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
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text>
                      No similar jobs were found with a matching skill set for
                      this role.
                    </Text>
                  )}
                </Container>
              </Container>
            </GridCol>

            <GridCol span={{ base: 12, md: 4 }}>
              <Grid visibleFrom="sm" gutter="sm">
                <GridCol span={{ base: 12, md: 6 }}>
                  <SaveButton />
                </GridCol>
                <GridCol span={{ base: 12, md: 6 }}>
                  <Button
                    component="a"
                    fullWidth
                    size="lg"
                    fz={"md"}
                    color="#004a93"
                    href={job.job_listing_source_url?.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={
                      <IconArrowUpRight
                        style={{
                          width: "13.75px",
                          height: "13.75px",
                          color: "#FFFFFF",
                        }}
                      />
                    }
                    style={{
                      width: "100%",
                      height: "58px",
                      padding: "16px 24px",
                      borderRadius: "0px",
                      border: "1px solid transparent",
                      backgroundColor: "#004a93",
                    }}
                  >
                    Apply now
                  </Button>
                </GridCol>
              </Grid>

              <Card p="lg" my="md" radius="md">
                <CardSection
                  // p="lg"
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "auto",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconBriefcase style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Job Type
                  </Text>
                  <Text
                    fw={500}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                    className={SFProRounded.className}
                  >
                    {job.employment_type
                      ? capitalize(job.employment_type.toLowerCase()) + " role"
                      : "Fulltime role"}{" "}
                  </Text>
                </CardSection>

                <CardSection
                  // p="lg"
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    // height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconCode style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                      width: "50%",
                    }}
                    className={SFProRounded.className}
                  >
                    Skills required
                  </Text>

                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      // position: "absolute",
                      // right: "28px",
                      width: "50%",
                      textAlign: "right",
                      marginRight: "-12px",
                    }}
                  >
                    {!job.skills || job.skills.length === 0
                      ? "No particular skills mentioned."
                      : job.skills.join(", ")}
                  </Text>
                </CardSection>

                <CardSection
                  // p="lg"
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconMapPin style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Location
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                  >
                    {job.job_location === "null, null"
                      ? "Location not specified"
                      : job.job_location}
                  </Text>
                </CardSection>

                <CardSection
                  // p="lg"
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconCoin style={{ width: "16px", height: "16px" }} />
                    <IconCoin style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                      width: "50%",
                    }}
                    className={SFProRounded.className}
                  >
                    Salary
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      width: "50%",
                      textAlign: "right",
                      marginRight: "-12px",
                    }}
                  >
                    {job.salary_range
                      ? job.salary_range.replace(/\b(\d+)\b/g, (match:any) =>
                          parseInt(match, 10).toLocaleString()
                        )
                      : "No salary information was found."}
                  </Text>
                </CardSection>

                <CardSection
                  // p="lg"
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconCalendarBolt
                      style={{ width: "16px", height: "16px" }}
                    />
                    <IconCalendarBolt
                      style={{ width: "16px", height: "16px" }}
                    />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                      width: "50%",
                    }}
                    className={SFProRounded.className}
                  >
                    Date Posted
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      width: "50%",
                      textAlign: "right",
                      marginRight: "-12px",
                    }}
                  >
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No date posted"}
                  </Text>
                </CardSection>
              </Card>

              <Group gap="xs" hiddenFrom="sm" my="lg">
                <SaveButton />
                <Button
                  component="a"
                  fullWidth
                  fz={"md"}
                  size="lg"
                  color="#004a93"
                  href={job.job_listing_source_url?.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftSection={<IconArrowUpRight size={20} />}
                >
                  Apply now
                </Button>
              </Group>

              <Container px={0} py="xl" hiddenFrom="sm">
                <Title
                  ta="left"
                  order={1}
                  pb="md"
                  className={SFProRounded.className}
                >
                  Similar jobs
                </Title>
                {jobs.length > 0 ? (
                  <SimpleGrid cols={1}>
                    {jobs.map((job) => (
                      <Container
                        px={0}
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
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>
                    No similar jobs were found with a matching skill set for
                    this role.
                  </Text>
                )}
              </Container>

              {/* <CardAICTA /> */}
              <CardCompany
                id={job.id}
                companyLogo={job.employer_logo}
                companyName={job.company_name}
                companyDescription={job.brief_summary}
              />
              <CardContentCTA />
            </GridCol>
          </Grid>
        </main>
      </Container>
    </>
  );
}
