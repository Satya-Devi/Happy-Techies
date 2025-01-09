import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import Link from "next/link";
import { CardImage } from "../CardImage/CardImage";
import { SFProRounded } from "@/app/layout";

interface ServiceCardProps {
  category: string;
  name: string;
  description: string;
  image: string;
  link: string | null;
}

export function ServiceCard({
  category,
  name,
  description,
  image,
  link,
}: ServiceCardProps) {
  return (
    <Box style={{ height: "100%" }} className={SFProRounded.className}>
      <Link
        href={link ?? "/"}
        style={{ textDecoration: "none", height: "100%", display: "block" }}
        target="_blank"
      >
        <Card
          withBorder
          padding="lg"
          radius="md"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Group justify="space-between" mb="xs" align-items="center">
            <CardImage employer_logo={image} />
            <Badge
              variant="outline"
              size="md"
              mt="xs"
              style={{
                position: "absolute",
                marginLeft: "65px",
              }}
            >
              {category}
            </Badge>
            <Button
              style={{
                width: "55px",
                height: "20px",
                padding: "1px 11px",
                borderRadius: "4px 0px 0px 0px",
                backgroundColor: "#004A93",
              }}
            >
              <Text
                style={{
                  // fontFamily: "Inter, sans-serif",
                  fontSize: "10.48px",
                  fontWeight: 700,
                  lineHeight: "18px",
                  letterSpacing: "0.25px",
                  textAlign: "center",
                  color: "#ffffff", // Adjust if needed
                }}
              >
                FREE
              </Text>
            </Button>
          </Group>

          <Text fz="lg" fw={600} mt="md" mb="xs">
            {name}
          </Text>
          <Text fz="sm">{description}</Text>
        </Card>
      </Link>
    </Box>
  );
}
