"use client";

import { SFProRounded } from "@/app/layout";
import { Container, Image, SimpleGrid, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./DedicationSection.module.css";

export default function DedicationSection() {


  return (
    <Container
      fluid
      mt="xl"
      mx="xl"
      p={{ xs: "20px 20px 0", md: "60px 60px 0"}}
      style={{
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text className={classes.subtitle}>The <strong style={{color:"#000000"}}>only </strong>job board</Text>
      <Title className={SFProRounded.className + " " + classes.title+" "+SFProRounded.className} pb="xl">
         by and for Microsoft technology experts
      </Title>

      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="xl"
        py="xl"
        style={{ paddingBottom: "80px" }}
      >
        <Container p={{xs: "md" ,md: "0"}}>
          <Image
            className={classes.icon}
            src="/images/icon1.svg"
            alt="community"
          />
          <Title order={2} className={classes.title + " " + SFProRounded.className}>
          Find the job that fits your skills
          </Title>
          <Text className={classes.text}>
          Filter to see only the jobs that are relevant to your experience, carefully curated by our team.
          </Text>
        </Container>
        <Container p={{xs: "md" ,md: "0"}}>
          <Image
            className={classes.icon}
            src="/images/icon2.svg"
            alt="community"
          />
          <Title order={2} className={classes.title + " " + SFProRounded.className}>
            Find a community that wants to see you succeed.
          </Title>
          <Text className={classes.text}>
          Hone your skills with the latest news, analysis, and tools you need to level-up and grow your career with a smile.
          </Text>
        </Container>
        <Container p={{xs: "md" ,md: "0"}}>
          <Image
            className={classes.icon}
            src="/images/icon3.svg"
            alt="community"
          />
          <Title order={2} className={classes.title + " " + SFProRounded.className}>
            Land your next role
          </Title>
          <Text className={classes.text}>
          Use AI assistance to apply smarter - and find your next forever job.
          </Text>
        </Container>
      </SimpleGrid>
    </Container>
  );
}
