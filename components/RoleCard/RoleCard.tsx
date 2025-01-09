import { Badge, Box, Card, Flex, Group, Text, ThemeIcon } from "@mantine/core";
import Link from "next/link";
import React from "react";
import styles from "./Rolecard.module.css";
import { SFProRounded } from "@/app/layout";

interface RoleCardProps {
  id: string;
  title: string;
  category: string;
  count: number;
  certificationsCount: number;
  jobCount: number;
  IconComponent: React.ComponentType;
}

export function RoleCard({
  id,
  title,
  category,
  count,
  certificationsCount,
  IconComponent,
  jobCount,
}: RoleCardProps) {
  return (
    <Link href={`/roles/${id}`} style={{ textDecoration: "none" }}>
      <Card
        withBorder
        padding="lg"
        radius="md"
        className={styles.card}
      >
        <Flex justify="space-between" align="stretch">
          <Box style={{ width: "70%", height: "59px", gap: "8px", opacity: 1 }}>
            <Flex align="center" mb="xs">
              <ThemeIcon variant="white" color="gray" size={28} mr="sm">
                <IconComponent />
              </ThemeIcon>
              {/* <div className={styles.title}> */}
              <Text fw={500} size="md" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {title}
              </Text>
              {/* </div> */}
            </Flex>
            <Flex justify="space-between" align="center" ml={2} mb="16px">
              <Text fz="xs" c="dimmed" style={{ marginRight: "8px"} }>
                {count} learning paths
              </Text>
              <Text fz="xs" c="dimmed" style={{ marginRight: "8px"}}>
                {certificationsCount} certifications
              </Text>
            </Flex>
          </Box>

          <Flex
            direction="column"
            justify="space-between"
            align="center"
            className={styles.badgeContainer}
            style={{
              width: "40%",
              height: "60px",
              gap: "8px",
              opacity: 1,
              marginLeft: "-16px",
            }}
          >
            <Badge
              variant="outline"
              size="sm"
              className={styles.categoryBadge}
              style={{
                display: "inline-flex", 
                alignItems: "center",
                justifyContent: "center",
                height: "24px", 
                // padding: "0 8px", 
                margin: "0 auto", 
              }}
            >
              {category}
            </Badge>
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "81px",
                height: "24px",
                padding: "0px 8px",
                gap: "10px",
                borderRadius: "4px 0px 0px 0px",
                backgroundColor: "#FFCFCC",
              }}
            > */}
            <div className={styles.jobCountContainer}>
              <Text fz="14px" c="#004A93" fw={800}>
                {jobCount} jobs
              </Text>
            </div>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}