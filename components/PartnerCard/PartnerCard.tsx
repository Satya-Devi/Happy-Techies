import {
  Box,
  Card,
  CardSection,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCertificate,
  IconPinned,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { CardImage } from "../CardImage/CardImage";

interface PartnerCardProps {
  slug: string;
  name: string;
  brief: string;
  logo: string;
  location: string;
  awards_2024: string;
  awards_2023: string;
  awards_2022: string;
  specializations: string;
  employees: string;
}

export function PartnerCard({
  slug,
  name,
  brief,
  logo,
  location,
  awards_2024,
  awards_2023,
  awards_2022,
  specializations,
  employees,
}: PartnerCardProps) {
  const calculateTotalAwards = () => {
    const years = [awards_2024, awards_2023, awards_2022];
    return years.reduce((total, year) => {
      if (year && year !== "N/A"   && year.trim() !== "-") {
        return total + year.split(",").length;
      }
      return total;
    }, 0);
  };

  const specializationCount =
    specializations && specializations !== "N/A"
      ? specializations.split(",").length
      : 0;

  const totalAwards = calculateTotalAwards();

  return (
    <Box style={{ height: "100%" }}>
      <Link
        href={`/partners/${slug}`}
        style={{ textDecoration: "none", height: "100%", display: "block" }}
      >
        <Card
          withBorder
          padding="lg"
          radius="md"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Group justify="space-between" mb="xs" align="flex-start">
            <CardImage employer_logo={logo} />
          </Group>

          <Text fz="lg" fw={600} mt="md" mb="xs">
            {name}
          </Text>

          <Text fz="sm" lineClamp={2}>
            {brief}
          </Text>

          <CardSection inheritPadding pt="md" mt="auto" pb="lg">
            <Stack gap="xs">
              <Group
                align="center"
                style={{ display: "flex", alignItems: "center" }}
              >
                <ThemeIcon variant="light" radius="xl">
                  <IconTrophy style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Text fz="xs" tt="uppercase" c="dimmed" fw={500}>
                  {totalAwards} awards
                </Text>
              </Group>

              <Group
                align="center"
                style={{ display: "flex", alignItems: "center" }}
              >
                <ThemeIcon variant="light" radius="xl">
                  <IconCertificate style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Text fz="xs" tt="uppercase" c="dimmed" fw={500}>
                  {specializationCount} specializations
                </Text>
              </Group>

              <Group
                align="center"
                style={{ display: "flex", alignItems: "center" }}
              >
                <ThemeIcon variant="light" radius="xl">
                  <IconUsers style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Text fz="xs" tt="uppercase" c="dimmed" fw={500}>
                  {employees} employees
                </Text>
              </Group>

              <Group
                align="center"
                style={{ display: "flex", alignItems: "center" }}
              >
                <ThemeIcon variant="light" radius="xl">
                  <IconPinned style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Text fz="xs" tt="uppercase" c="dimmed" fw={500}>
                  {location}
                </Text>
              </Group>
            </Stack>
          </CardSection>
        </Card>
      </Link>
    </Box>
  );
}
