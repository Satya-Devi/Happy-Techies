import { Card, CardSection, Group, Text, ThemeIcon } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import Link from "next/link";
import { CardImage } from "../CardImage/CardImage";

interface LearningPathCardProps {
  title: string;
  duration_in_minutes: number;
  subjects: string[];
  icon_url: string;
  levels: string[];
  url: string;
}

export function LearningPathCard({
  title,
  duration_in_minutes,
  subjects,
  icon_url,
  levels,
  url,
}: LearningPathCardProps) {
  return (
    <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
      <Card
        withBorder
        padding="lg"
        radius="md"
        style={{
          height: "320px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardSection inheritPadding pt="md">
          <Group align="start">
            <CardImage employer_logo={icon_url || ""} />
          </Group>
        </CardSection>

        <CardSection inheritPadding pt="md">
          <Text fz="xs" tt="uppercase" c="dimmed" fw={500}>
            Learning Path
          </Text>
          <Text fz="md" fw={600} mt="sm" lineClamp={2}>
            {title}
          </Text>
        </CardSection>

        <CardSection inheritPadding pt="md" mt="auto">
          <Group
            align="center"
            mt="auto"
            style={{ display: "flex", alignItems: "center" }}
          >
            <ThemeIcon variant="light" radius="xl">
              <IconClock style={{ width: "70%", height: "70%" }} />
            </ThemeIcon>
            <Text fz="xs" tt="uppercase" c="dimmed" fw={500}>
              {Math.floor(duration_in_minutes / 60)}{" "}
              {Math.floor(duration_in_minutes / 60) === 1 ? "hour" : "hours"}
            </Text>
          </Group>
        </CardSection>

        <CardSection inheritPadding py="lg">
          <Text fz="xs" c="dimmed" tt="capitalize" fw={500}>
            {levels.join(" · ")}
          </Text>

          <Text fz="xs" c="dimmed" fw={500}>
            {subjects && subjects.length > 0
              ? subjects
                  .slice(0, 2)
                  .map((subject) =>
                    subject
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())
                  )
                  .join(" · ")
              : "No core subjects"}
          </Text>
        </CardSection>
      </Card>
    </Link>
  );
}
