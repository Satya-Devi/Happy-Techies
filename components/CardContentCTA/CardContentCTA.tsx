import { SFProRounded } from "@/app/layout";
import { Button, Paper, Title } from "@mantine/core";
import styles from "./CardContentCTA.module.css";
import { IconArrowUpRight } from "@tabler/icons-react";

export function CardContentCTA() {
  return (
    <Paper
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
        Grow your career with our tailored content for Microsoft techies
      </Title>
      <Button
        variant="white"
        color="dark"
        component="a"
        href="/roles"
        style={{ position: "relative", zIndex: 1, width:"142px",height:"42px"}}
        rightSection={
          <IconArrowUpRight
            style={{
              width: "13.75px",
              height: "13.75px",
              color: "#000000",
            }}
          />
        }
      >
        Learn more
      </Button>
    </Paper>
  );
}
