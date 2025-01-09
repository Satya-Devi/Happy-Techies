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
import { IconBookmark, IconPinned } from "@tabler/icons-react";
import { CardImage } from "../CardImage/CardImage";
import UnsaveJobButton from "../UnsaveJobButton/UnsaveJobButton";
import classes from "./MobileJob.module.css";
import { JobData } from "@/utils/interface";
import { saveJob } from "@/app/jobs/[id]/actions";
import { notifications } from "@mantine/notifications";


type MobileJobProps = {
  job: JobData;
  userId: string | null;
  isTrackedPage?: boolean;
};

export function MobileJob({ userId, job, isTrackedPage }: MobileJobProps) {
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

  const link = `/jobs/${job.id}`;

  const handleCardClick = () => {
    window.location.href = link;
  };

  const formattedTitle =
    job.job_title?.length && job.job_title?.length > 50
      ? job.job_title?.substring(0, 50) + "..."
      : job.job_title;

  const Buttons = ({ userId }: { userId: string | null }) => {
    // if (!userId) return null;
    const handleSaveJob = async (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      try {
        if (!userId) {
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

    const handleApply = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      window.open(job.job_listing_source_url || "/");
    }
    return (
      <Group gap="xs" className={classes.buttonGroup}>
          <Button radius="md" style={{cursor:'pointer'}} onClick={handleSaveJob}>
            <IconBookmark style = {{color: '#fff', width:"15.16px",height:"18px", border:"1.89px"}}/>
          </Button>
        <Button
          radius="md"
          color="#004a93"
          onClick={handleApply}
          style={{cursor:'pointer'}}
        >
          Apply
        </Button>
      </Group>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Group align="start">
          <CardImage employer_logo={job.employer_logo || ""} />
        </Group>
        <Group align="start">
          <Container style={{ flexGrow: 1 }} px="xs" py="md">
            <Stack align="stretch" justify="center" gap="xs">
              <Group justify="space-between">
                <Text fz="xl" fw={500}>
                  {formattedTitle}
                </Text>
                <Buttons userId={userId} />
              </Group>

              <Text fz="md">{job.company_name}</Text>

              <Group gap="xs">
                <ThemeIcon variant="white">
                  <IconPinned style={{ width: "70%", height: "70%" }} />
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
                  {job.job_location === "null, null"
                    ? "Not specified"
                    : job.job_location}
                </Text>
              </Group>

              <Group gap={7} mt={5}>
                {features && features.length > 0 ? (
                  features
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
          </Container>
        </Group>
      </Card>
    </div>
  );
}
