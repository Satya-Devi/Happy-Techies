import { Card, CardSection, Group, Text } from "@mantine/core";
import Link from "next/link";
import { CardImage } from "../CardImage/CardImage";

interface CertificationCardProps {
  title: string;
  icon_url: string;
  url: string;
}

export function CertificationCard({
  title,
  icon_url,
  url,
}: CertificationCardProps) {
  return (
    <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
      <Card withBorder padding="lg" radius="md" style={{ height: "100%" }}>
        <CardSection inheritPadding pt="md">
          <Group align="start">
            <CardImage employer_logo={icon_url || ""} />
          </Group>
        </CardSection>

        <CardSection inheritPadding py="lg">
          <Text fz="xs" tt="uppercase" c="dimmed" fw={500}>
            Certification
          </Text>
          <Text fz="md" fw={600} mt="sm" lineClamp={2}>
            {title}
          </Text>
        </CardSection>
      </Card>
    </Link>
  );
}
