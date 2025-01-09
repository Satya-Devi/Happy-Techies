"use client";

import { saveJob } from "@/app/jobs/[id]/actions";
import { JobData } from "@/utils/interface";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBookmark } from "@tabler/icons-react";

type SaveJobButtonProps = {
  userId: string;
  job: JobData;
};

export default function SaveJobButton({ userId, job }: SaveJobButtonProps) {
  const handleSaveJob = async () => {
    try {
      const jobData: JobData = {
        id: job.id, // Use the id from Job for JobData id
        company_name: job.company_name,
        job_listing_source_url: job.job_listing_source_url,
        job_title: job.job_title,
        job_location: job.job_location,
        job_description: job.job_description,
        skills: job.skills,
        created_at: new Date().toISOString(), // Set created_at to the current date
        employer_logo: job.employer_logo,
        job_id: job.id, // Use the id as job_id, or set it to null if it's not available
      };
      await saveJob(userId, jobData);
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

  return (
    <Button
      fullWidth
      size="lg"
      bg="white"
      variant="outline"
      leftSection={<IconBookmark style = {{color: '#489BE7', width:"15.16px",height:"18px", border:"1.89px"}}/>}
      style={{
        width: '100%',     
        height: '58px',      
        padding: '16px 24px',
        borderRadius: '6px 0 0 0',
        border: '1px solid transparent',
        backgroundColor: '#fff',
        gap:"8px"
      }}
      fz="md"
      onClick={handleSaveJob}
    >
      Save Job
    </Button>
  );
}
