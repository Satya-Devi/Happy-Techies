import { Container, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import Script from "next/script";
import { Dots } from "./Dots";
import classes from "./Waitlist.module.css";

export function Waitlist() {
  return (
    <Container className={classes.wrapper} fluid>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="md">
          <Title className={classes.title} pt="xl" mt="xl" ta="left">
          "Say goodbye to the endless job scroll of doom. Join our waitlist for exclusive access when we launch!
          </Title>

          <Container
            p="xl"
            mt="lg"
            size={600}
            style={{
              background:
                "linear-gradient(to right, rgba(224, 242, 255, 0.7), rgba(179, 229, 252, 0.7))",
              backdropFilter: "blur(20px)",
              borderRadius: 20,
            }}
          >
            <Paper shadow="sm" withBorder p="lg" radius="lg">
              <Title fw={500} order={2} ta="center" c="#489BE7">
                Join the waitlist
              </Title>

              <Text size="md" c="dark" my="md" ta="center">
              "Custom recommendations to develop/expand/enhance your skills?" Not mentioning latest news and blogs.
               "Catch up on the latest industry news."
              </Text>

              <div
                className="launchlist-widget"
                data-key-id="DdHujG"
                data-height="120px"
              ></div>

              <Script
                src="https://getlaunchlist.com/js/widget.js"
                type="text/javascript"
                defer
              />
            </Paper>
          </Container>
        </SimpleGrid>
      </div>
    </Container>
  );
}
