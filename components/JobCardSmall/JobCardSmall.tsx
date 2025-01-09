"use client";
import { JobData } from "@/utils/interface";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Text,
} from "@mantine/core";
import classes from "./JobCardSmall.module.css";
import {
  IconMapPin,
  IconBookmark,
  IconBookmarkFilled,
} from "@tabler/icons-react";
import TimeAgo from "react-timeago";
import moment from "moment";
import { saveJob, unsaveJob } from "@/app/jobs/[id]/actions";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import UnsaveJobButton from "../UnsaveJobButton/UnsaveJobButton";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image"; //mantine images are not working on firefox so keep this
import JobCardSmallMobile from "./JobCardSmallMobile";
import { useRouter } from "next/navigation";
import { CardImage } from "../CardImage/CardImage";

interface JobCardSmallProps {
  job?: JobData;
  userId?: string;
  isTracker?: boolean;
  onUnsaveJob?: (jobId: string) => void;
}
const temp: JobData = {
  job_title: "Data & AI",
  employer_logo: "/images/job-role-card/company-logo.png",
  job_description:
    "Lorem ipsum dolor sit amet consectetur. Nibh leo eget bibendum arcu mauris at. Arcu venenatis amet arcu eget risus habitant mauris amet a. Tempus et sodales purus amet quis nisl purus mi posuere.",
  job_location: "San Francisco, CA",
  company_name: "Microsoft",
  id: "1",
  skills: ["Data & AI"],
  created_at: new Date(),
  job_listing_source_url: "https://www.microsoft.com",
  job_id: "1",
  solution_area: "Data & AI",
  brief_summary: "",
};

const JobCardSmall = ({
  job = temp,
  userId,
  isTracker = false,
}: JobCardSmallProps) => {
  const [company_logo, setCompanyLogo] = useState(job.employer_logo);
  const [isSaved, setIsSaved] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const router=useRouter();

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (savedJobs.includes(job.id)) {
      setIsSaved(true);
    }
  }, [job.id]);

  // const handleClick = () => {
  //   window.location.href = "/jobs/" + job.id;
  // };

  const isHotJob = () => {
    let skils = [
      "Data and AI",
      "Security",
      "Modern Work",
      "Infrastructure",
      "Business Applications",
      "Digital and App Innovation",
    ];
    if (
      job.solution_area &&
      skils.includes(job.solution_area) &&
      moment().diff(moment(job.created_at), "days") <= 8
    ) {
      return true;
    }
    return false;
  };

  const handleSaveJob = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      if (!userId) {
        return (window.location.href = "/login");
      }
      await saveJob(userId, job);
      setIsSaved(true);
      const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      localStorage.setItem("savedJobs", JSON.stringify([...savedJobs, job.id]));
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
  };


  const handleUnsaveJob = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      if (!userId) {
        return (window.location.href = "/login");
      }
      await unsaveJob(userId, job.id);
      setIsSaved(false);

      const savedJobs = JSON.parse(
        localStorage.getItem("savedJobs") || "[]"
      ).filter((id: string) => id !== job.id);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));

      notifications.show({
        title: "Job removed",
        message: "The job has been removed from your saved jobs.",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Oops...",
        message: "Unable to remove the job. Please try again later.",
        color: "red",
      });
    }
  };

  const handleJobClick = () => {
    router.push(`/jobs/${job.id}`);
  }
  return (
    <>
      {isMobile ? (
          <JobCardSmallMobile  job={job} userId={userId} isTracker={isTracker} />
      ) : (
          <Card onClick={handleJobClick} className={classes.container}>
            <Group className={classes.top_area}>
              {/* <Box style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}> */}
              <Box className={classes.img_wrapper}>
                <Image
                  className={classes.img}
                  onError={() => setCompanyLogo(null)}
                  src={company_logo || "/images/company_placeholder.png"}
                  alt={job.job_title || ""}
                  width={56}
                  height={56}
                />
              </Box>
              <Text className={classes.job_title}>{job.job_title}</Text>
              <Box style={{ width: 13, height: 17 }}>
                {!isMobile && isHotJob() && (
                  <Image
                    src={"/images/hot.png"}
                    className={classes.hot_badge}
                    alt="hot-job-icon"
                    // fill
                    width={13}
                    height={17}
                  />
                )}
              </Box>
              {/* </Box> */}
              <Box className={classes.time_save_wrapper}>
                <Text className={classes.time_text}>
                  <TimeAgo date={job.created_at} />
                </Text>
                {isTracker ? (
                  userId ? (
                    <UnsaveJobButton
                      userId={userId}
                      jobId={job.id ? job.id : ""}
                      onUnsave={handleUnsaveJob}
                    />
                  ) : null
                ) : (
                  <Button
                    ml={"17px"}
                    onClick={isSaved ? handleUnsaveJob : handleSaveJob}
                    p={0}
                    mih={30}
                    h={30}
                    w={30}
                    radius={"lg"}
                    bg="#DDF0FD"
                  >
                    {/* <IconBookmarkFilled size={20} color={isSaved ? "#22BBE6" : "#004A93"} /> */}
                    {isSaved ? (
                      <IconBookmarkFilled size={20} color="#004A93" />
                    ) : (
                      <IconBookmark size={20} color="#004A93" />
                    )}
                  </Button>
                )}
                {isMobile && isHotJob() && (
                  <Image
                    src={"/images/hot.png"}
                    className={`${classes.hot_badge} ${classes.hot_badge_mobile}`}
                    alt="hot-job-icon"
                    width={13}
                    height={17}
                  />
                )}
              </Box>
            </Group>

            <Group mt="16px" align="center" justify="space-between">
              <Group>
                <Text className={classes.company_info_text}>
                  {job.company_name}
                  {!job.job_location?.includes("null") ? (
                    <>
                      <IconMapPin
                        style={{
                          marginRight: "2.6px",
                          marginLeft: "11px",
                          marginTop: "0px",
                          marginBottom: "0px",
                        }}
                        color="#2C3E50"
                        size={14}
                      />
                      {job.job_location}
                    </>
                  ) : null}
                </Text>
              </Group>
              <Container className={classes.badge_wrapper}>
                {job.skills?.slice(0, 3)?.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    size="md"
                    mx={4}
                    color="#004A93"
                  >
                    {skill}
                  </Badge>
                ))}
              </Container>
            </Group>
            <Text className={classes.description}>
              {job.brief_summary || job.job_description}
            </Text>
          </Card>
      )}
    </>
  );
};

export default JobCardSmall;
