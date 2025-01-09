import { SFProRounded } from "@/app/layout";
import { Button, Paper, Title } from "@mantine/core";
import styles from "./CardAICTA.module.css";

export function CardAICTA() {
  return (
    <Paper
      shadow="md"
      p="xl"
      my="md"
      radius="md"
      className={styles.card}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className={styles.overlay}></div>
      <Title
        order={2}
        c="white"
        className={SFProRounded.className}
        style={{ position: "relative", zIndex: 1 }}
      >
        Use our AI assistant to find the perfect solution for you
      </Title>
      <Button
        variant="white"
        color="dark"
        component="a"
        href="/"
        style={{ position: "relative", zIndex: 1 }}
      >
        Search jobs
      </Button>
    </Paper>
  );
}
