"use client";

import { SFProRounded } from "@/app/layout";
import {
  Button,
  Container,
  Group,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./PartnerRescueSection.module.css";

export default function PartnerRescueSection() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 48em)");
  const isTablet = useMediaQuery("(max-width: 62em)");
  const icon = <IconChevronRight size={14} />;

  const iconNames = [
    "layers",
    "sisyphus",
    "capsule",
    "catalog",
    "spherule",
    "polymath",
    "luminous",
    "focal-point",
    "segment",
    "feather-dev",
    "acme-corp",
    "galileo",
  ];

  return (
    <Container
      fluid
      mt="xl"
      pb="xl"
      mx="xl"
      bg="white"
      style={{
        borderRadius: "10px",
        padding: isMobile ? "20px 20px 0" : "60px 60px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text className={classes.subtitle}>
        At our core, we&apos;re all about Microsoft technology.
      </Text>
      <Title className={SFProRounded.className + " " + classes.title}>
        Microsoft Partners to the rescue
      </Title>

      <Container size="36rem">
        <Text className={classes.text} py="xl">
        We understand the struggle of the job hunt because <strong style={{color:"#000000"}}>we've been there.</strong> From startups to tech giants, we built a platform built with the jobs you wish you'd see on other job boards.
        </Text>

        <SimpleGrid
          cols={isMobile ? 2 : isTablet ? 3 : 4}
          spacing={isMobile ? "md" : "xl"}
          p={isMobile ? "md" : "xl"}
        >
          {iconNames.map((name) => (
            <div key={name} className={classes.iconWrapper}>
              <Image
                className={classes.icon}
                src={`/images/icons/${name}.svg`}
                alt={name}
              />
            </div>
          ))}
        </SimpleGrid>

        <Group justify="center" py="xl">
          <Button
            color="#004a93"
            rightSection={icon}
            radius="md"
            onClick={() => router.push("/jobs")}
          >
            Explore curated jobs
          </Button>

          <Button
            color="#004a9319"
            c=" #004a93"
            rightSection={icon}
            radius="md"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Search with AI
          </Button>
        </Group>
      </Container>
    </Container>
  );
}
