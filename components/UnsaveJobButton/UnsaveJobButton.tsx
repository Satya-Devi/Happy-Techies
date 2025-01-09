"use client";

import { unsaveJob } from "@/app/jobs/[id]/actions";
import { ActionIcon, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import classes from "./UnsaveJobButton.module.css";
import React from "react";

type UnsaveJobButtonProps = {
  userId: string;
  jobId: string;
  onUnsave: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function UnsaveJobButton({
  userId,
  jobId,
  onUnsave,
}: UnsaveJobButtonProps) {
  
  const handleUnsaveJob = async (event:React.MouseEvent<HTMLElement>) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      await unsaveJob(userId, jobId);
      notifications.show({
        title: "Job removed.",
        message: "The job is no longer being tracked to your saved jobs.",
        color: "green",
      });
      onUnsave(event);
    } catch (err) {
      notifications.show({
        title: "Oops...",
        message: "Unable to remove the job. Please try again later.",
        color: "red",
      });
    }
  };

  return (
    <Button
      disabled={jobId === ""}
      variant="default"
      radius="md"
      p={0} mih={30} h={30} w={30}
      ml={8}
      onClick={handleUnsaveJob}
      style={{cursor:'pointer'}}
    >
      <IconTrash className={classes.delete} stroke={1.5} />
    </Button>
  );
}
