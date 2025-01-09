"use client";

import { SFProRounded } from "@/app/layout";
import {
  Button,
  Center,
  Container,
  Grid,
  GridCol,
  Paper,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronRight, IconWand } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./ChatHero.module.css";

export default function ChatHero() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [value, setValue] = useState("");

  const handleClick = async () => {
    try {
      if (!value.trim()) {
        alert("Please enter a query before searching.");
        return;
      }
      router.push(`/ai?query=${encodeURIComponent(value.trim())}`);
    } catch (error) {
      console.error("Error in handleClick:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container
      fluid
      mx="xl"
      style={{
        borderRadius: "10px",
        backgroundImage: "url('/images/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center right",
        padding: isMobile ? "20px 20px" : "60px 60px",
      }}
    >
      <Grid py="xl" align="center" justify="space-around">
        <GridCol span={{ base: 12, md: 6 }} px={isMobile ? "xs" : "xl"}>
          <Stack justify="center">
            <Title
              ta={isMobile ? "center" : "left"}
              className={classes.title + " " + SFProRounded.className}
            >
              Find your next dream job <br /> in Microsoft technologies
            </Title>
            <Title
              order={2}
              c="#004a93"
              ta={isMobile ? "center" : "left"}
              className={SFProRounded.className}
              style={{ fontSize: isMobile ? "22px" : "48px" }}
            >
              Learn. Connect. Grow.
            </Title>
          </Stack>
        </GridCol>

        <GridCol
          span={{ base: 12, md: 6 }}
          px={isMobile ? "xs" : "xl"}
          mt={isMobile ? "lg" : 0}
        >
          <Paper
            p="sm"
            radius="md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Textarea
              size="lg"
              radius="md"
              rows={8}
              placeholder="I'm a Power Bi Developer looking for a job in..."
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
            <Button
              leftSection={<IconWand size={14} />}
              fullWidth
              mt="xs"
              radius="md"
              size="lg"
              color="#004a93"
              onClick={handleClick}
            >
              Search with AI
            </Button>
          </Paper>
        </GridCol>
      </Grid>

      <Center mt="xl">
        <Button
          className={classes.button}
          variant="white"
          c="#004a93"
          radius="md"
          rightSection={<IconChevronRight size={14} />}
          size="lg"
          onClick={() => {
            router.push("/jobs");
          }}
        >
          Browse our curated list of Microsoft technology jobs.
        </Button>
      </Center>
    </Container>
  );
}
