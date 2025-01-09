"use client";

import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowUpRight, IconHeartFilled, IconPinned } from "@tabler/icons-react";
import { CardImage } from "../CardImage/CardImage";
import { MobileJob } from "../MobileJob/MobileJob";
import classes from "./Job.module.css";
import { saveJob } from "@/app/jobs/[id]/actions";
import { notifications } from "@mantine/notifications";
import { JobData } from "@/utils/interface";
import React from "react";

type JobProps = {
  job: JobData;
  userId: string | null;
  isTrackedPage?: boolean;
};

const pinnedIconStyle = { width: "70%", height: "70%" };

export function Job({ userId, job,isTrackedPage=false }: JobProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (isMobile) return <MobileJob isTrackedPage={isTrackedPage} userId={userId} job={job} />;

  const features = job.skills?.map((skill: any) => (
    <Badge variant="outline" size="lg" key={skill} color="#004a93">
      <span
        style={{
          letterSpacing: 1,
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        {skill}
      </span>
    </Badge>
  ));

  const formattedTitle =
    job.job_title?.length && job.job_title?.length > 50
      ? job.job_title?.substring(0, 50) + "..."
      : job.job_title;



  const Buttons = ({ userId }: { userId: string | null }) => {
    // if (!userId) return null;
    const handleSaveJob = async (event:React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      try {
        if(!userId) {
         return window.location.href = "/login";
        }
        await saveJob(userId, job);
        notifications.show({
          title: "Job saved!",
          message: "The job has been saved successfully!",
          color: "green",
        });
      } catch (err) {
        notifications.show({
          title: "Oops...",
          message: "Unable to save the job. Please try again later.",
          color: "red",
        });
      }
    }
    const handleApply=(event:React.MouseEvent<HTMLElement>)=>{
      event.stopPropagation();
      event.preventDefault();
      window.open(job.job_listing_source_url || "/");
    }
    return (
      <Group gap="xs" className={classes.buttonGroup}>
         <Button fullWidth variant="outline" radius="md" style={{cursor:'pointer'}} onClick={handleSaveJob}>
          <IconHeartFilled size={20} style={{marginRight:5}} /> Save job
        </Button>
        <Button
          radius="md"
          fullWidth
          color="#004a93"
          onClick={handleApply}
          style={{cursor:'pointer'}}
        >
          <IconArrowUpRight size={20} style={{marginRight:5}}/>
          Apply Now
        </Button>
      </Group>
    );
  };

  return (
    <Card withBorder radius="sm" p="md"  className={classes.card}>
      <Group align="center">
        <CardImage employer_logo={job.employer_logo || ""} />

        <Container style={{ flexGrow: 1 ,display:'flex',justifyContent:'space-between'}}>
          <Stack align="stretch" flex={1} justify="center" gap="xs">
            <Group justify="space-between">
              <Text fz="xl" fw={500} tt="capitalize">
                {formattedTitle}
              </Text>
            </Group>

            <Text fz="md">{job.company_name}</Text>

            <Group gap="xs">
              <ThemeIcon variant="white">
                <IconPinned style={pinnedIconStyle} />
              </ThemeIcon>
              <Text
                fz="xs"
                tt="uppercase"
                c="#000000b3"
                fw={600}
                style={{
                  letterSpacing: 0.65,
                }}
              >
                {!job.job_location || job.job_location.includes("null")
                  ? "Not specified"
                  : job.job_location}
              </Text>
            </Group>

            <Group gap={7} mt={5}>
              {features && features.length > 0 ? (
                <>
                  {features.slice(0, 4).map((feature) => feature)}
                  {features.length > 4 && (
                    <Badge variant="outline" size="lg" color="#004a93">
                      <span
                        style={{
                          letterSpacing: 1,
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        +{features.length - 4} more
                      </span>
                    </Badge>
                  )}
                </>
              ) : (
                <Badge
                  variant="outline"
                  size="lg"
                  key="default"
                  color="#004a93"
                >
                  <span
                    style={{
                      letterSpacing: 1,
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    Microsoft
                  </span>
                </Badge>
              )}
            </Group>
          </Stack>
          <Container style={{height:'100%',right:5,top:-1,position:'absolute',alignItems:'center',display:'flex'}}>
           <Buttons userId={userId} />
          </Container>
        </Container>
      </Group>
    </Card>
  );
}
