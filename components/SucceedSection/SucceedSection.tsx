"use client";

import { SFProRounded } from "@/app/layout";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./SucceedSection.module.css";

export default function SucceedSection() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const icon = <IconChevronRight size={14} />;

  return (
    <Container
      fluid
      mt="xl"
      mx={isMobile?"xs":"xl"}
      bg="linear-gradient(to top, #3badff, #0281ff)"
      style={{
        borderRadius: "10px",
        padding: isMobile ? "20px 20px 0" : "60px 60px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        backgroundBlendMode: "linear-dodge, normal",
      }}
    >
      <Text className={classes.subtitle}>Skip the scroll - find your new job today.</Text>
      <Title className={SFProRounded.className + " " + classes.title} pb="xl">
      We want you to be a <strong>happy techie.</strong>
      </Title>

      <Text className={classes.text}>
      Happy Techies is your personal career cheerleader, and we're here to help you get the job you deserve!
      </Text>

      <Group
        justify="center"
        style={{ paddingBottom: "40px", paddingTop: "40px" }}
      >
        <Button
          color="#004a93"
          rightSection={icon}
          radius="md"
          onClick={() => router.push("/login")}
        >
          Sign up for free
        </Button>

        <Button
          className={classes.button}
          c=" #004a93"
          rightSection={icon}
          radius="md"
          onClick={() => router.push("/jobs")}
        >
          Explore curated jobs
        </Button>
      </Group>
    </Container>
  );
}
