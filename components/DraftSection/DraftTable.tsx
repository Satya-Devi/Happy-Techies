"use client";
import { useState, useEffect } from "react";
import { SFProRounded } from "@/app/layout";
import {
  Button,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  FileInput,
  Group,
  Box,
  Table,
  Menu,
  Grid,
  Modal,
  Text,
  Title,
  TagsInput,
  Pagination,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { usePagination } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { redirect } from "next/navigation";
import * as Yup from "yup";

const renderStatus = (
  deadline: string
): { text: string; color: string; icon: JSX.Element } => {
  const currentDate = new Date();
  const deadlineDate = new Date(deadline);

  return currentDate <= deadlineDate
    ? {
        text: "Active",
        color: "#34B04F",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L9 12L13 8M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604C15.5282 2.80031 14.5361 2.13738 13.4442 1.68508C12.3522 1.23279 11.1819 1 10 1C8.8181 1 7.64778 1.23279 6.55585 1.68508C5.46392 2.13738 4.47177 2.80031 3.63604 3.63604C2.80031 4.47177 2.13738 5.46392 1.68508 6.55585C1.23279 7.64778 1 8.8181 1 10Z"
              stroke="#34B04F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      }
    : {
        text: "Inactive",
        color: "#FF4D4F",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 8L12.5 12M12.5 8L8.5 12M1.5 10C1.5 11.1819 1.73279 12.3522 2.18508 13.4442C2.63738 14.5361 3.30031 15.5282 4.13604 16.364C4.97177 17.1997 5.96392 17.8626 7.05585 18.3149C8.14778 18.7672 9.3181 19 10.5 19C11.6819 19 12.8522 18.7672 13.9442 18.3149C15.0361 17.8626 16.0282 17.1997 16.864 16.364C17.6997 15.5282 18.3626 14.5361 18.8149 13.4442C19.2672 12.3522 19.5 11.1819 19.5 10C19.5 8.8181 19.2672 7.64778 18.8149 6.55585C18.3626 5.46392 17.6997 4.47177 16.864 3.63604C16.0282 2.80031 15.0361 2.13738 13.9442 1.68508C12.8522 1.23279 11.6819 1 10.5 1C9.3181 1 8.14778 1.23279 7.05585 1.68508C5.96392 2.13738 4.97177 2.80031 4.13604 3.63604C3.30031 4.47177 2.63738 5.46392 2.18508 6.55585C1.73279 7.64778 1.5 8.8181 1.5 10Z"
              stroke="#FF4D4F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      };
};

type Props = {
  searchParams: {
    message?: string;
  };

  onSubmit: (data: any) => {};
  data: any;
  showPagination?: boolean;
};

const DraftTable = ({ searchParams, onSubmit, data, showPagination }: Props) => {
  console.log(data);
  const router = useRouter();
  const redirectToEditJob = (jobId?: string) => {
    console.log("jobId", jobId);
    redirect(`/edit-job?jobId=${jobId}`);
  };
  const rows = data.map(
    (
      job: {
        job_title: string;
        employment_type: string;
        job_location: string;
        created_at: string;
        title: string;
      },
      index: number
    ) => (
      <Table.Tr key={index}>
        <Table.Td
          style={{
            textAlign: "center",
            color: "#718096",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          {index + 1}
        </Table.Td>
        <Table.Td>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
            >
              {job?.job_title?
                .split(" ")
                .map((word) => {
                 
                  if (word.startsWith("(") && word.endsWith(")")) {
                    return word.toUpperCase();
                  }
                 
                  return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  );
                })
                .join(" ")}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#718096",
              }}
            >
              <div>{job.employment_type}</div>
              {job.job_location && job.employment_type && (
                <div
                  style={{
                    width: "1.5px",
                    height: "15px",
                    backgroundColor: "#718096",
                  }}
                ></div>
              )}
              <div>
                {job.job_location}
              </div>
            </div>
          </div>
        </Table.Td>
        <Table.Td
          style={{
            textAlign: "center",
            color: "#718096",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          {job.created_at
            ? new Date(job.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })
            : "-"}
        </Table.Td>
        <Table.Td style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              color: "#718096",
            }}
          >
            <div>
              <Button
                size="xs"
                style={{
                  backgroundColor: "#DDF0FD",
                  color: "#004A93",
                  margin: "0 auto",
                  display: "block",
                }}
              >
                Discard Draft
              </Button>
            </div>
            <div>
              <Button
                size="xs"
                style={{
                  backgroundColor: "#DDF0FD",
                  color: "#004A93",
                  margin: "0 auto",
                  display: "block",
                }}
              >
                Resume Draft
              </Button>
            </div>
            <div>
              <Button
                size="xs"
                style={{
                  backgroundColor: "#DDF0FD",
                  color: "#004A93",
                  margin: "0 auto",
                  display: "block",
                }}
              >
                Make Payment
              </Button>
            </div>
          </div>
        </Table.Td>
      </Table.Tr>
    )
  );
  return (
    <Box mx="auto" p="lg" style={{ maxWidth: "89%" }}>
      <div
        style={{
          overflowX: "auto",
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            /* Chrome, Safari and Opera */ display: "none",
          },
        }}
      >
        <Table verticalSpacing="sm">
          <Table.Thead
            style={{
              backgroundColor: "#DDF0FD",
              color: "#004A93",
              height: "30px",
            }}
          >
            <Table.Tr>
              <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                S.No
              </Table.Th>
              <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                JOBS
              </Table.Th>
              <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                POSTING DATE
              </Table.Th>
              <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                ACTIONS
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
      {showPagination !== false && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <Pagination total={5} boundaries={1} defaultValue={1} />
        </div>
      )}
    </Box>
  );
};

export default DraftTable;
