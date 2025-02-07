"use client";
import {
  fetchJobsData,
  markJobInactive,
  deleteJob,
} from "@/app/my-jobs/action";
import { useState, useEffect } from "react";
import { SFProRounded } from "@/app/layout";
import { Loader } from "@mantine/core";
import Loading from "@/app/loading";

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
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

type Props = {
  showPagination?: boolean;
  pagename?: string;
};
interface JobRowData {
  id?: string;
  application_deadline?: string | undefined;
  job_status?: string | undefined;
  job_title?: string | undefined;
  employment_type?: string;
  solution_area?: string;
  job_location?: string;
  created_at?: string;
  title?: string;
  is_archived?: boolean;
  applicants_count?: number;
  company_name?: string;
}
const renderStatus = (
  deadline: string | undefined,
  status: string | undefined
): { text: string; color: string; icon: JSX.Element } => {
  const currentDate = new Date();
  const deadlineDate = new Date(deadline || "");

  return status !== "inactive"
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

const MyJobs = ({ showPagination, pagename }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [activePage, setActivePage] = useState(1);
  const [data, setData] = useState<JobRowData[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("oooooo", pagename);
    getData(activePage);
  }, [activePage]);
  const handleMarkInactive = (jobId: any) => {
    markJobInactive(jobId)
      .then(() => {
        // Refresh the jobs data
        getData(activePage);
      })
      .catch((error) => {
        console.error("Error marking job as inactive:", error);
      });
  };
  // const handleMarkInactive = async (jobId: any) => {
  //   try {
  //     await markJobInactive(jobId);
  //     // Refresh the jobs data
  //     getData(activePage);
  //   } catch (error) {
  //     console.error("Error marking job as inactive:", error);
  //   }
  // };
  // const deleteInactiveJob = async (jobId: any) => {
  //   try {
  //     await deleteJob(jobId);
  //     // Refresh the jobs data
  //     getData(activePage);
  //   } catch (error) {
  //     console.error("Error marking job as inactive:", error);
  //   }
  // };
  const [seletedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteInactiveJob = (jobId: any) => {
    setSelectedJobId(jobId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (seletedJobId) {
      deleteJob(seletedJobId)
        .then(() => {
          getData(activePage);
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error marking job as inactive:", error);
        });
    }
  };

  // const deleteInactiveJob = (jobId: any) => {
  //   deleteJob(jobId)
  //     .then(() => {
  //       // Refresh the jobs data
  //       getData(activePage);
  //     })
  //     .catch((error) => {
  //       console.error("Error marking job as inactive:", error);
  //     });
  // };
  // const getData = async (page: any | undefined) => {
  //   try {
  //     setIsLoading(true);
  //     const result = await fetchJobsData({
  //       limit: 20,
  //       step: page,
  //       pagename: pagename,
  //     });
  //     if (result && result.data) setData(result.data);
  //     setCount(result.count ?? 0);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const getData = (page: any | undefined) => {
    setIsLoading(true);
    fetchJobsData({
      limit: 20,
      step: page,
      pagename: pagename,
    })
      .then((result) => {
        if (result && result.data) setData(result.data);
        setCount(result.count ?? 0);
      })
      .catch((error) => {
        console.error(error); // Handle any errors here if necessary
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const rows =
    data &&
    data.map((job: JobRowData, index: number) => (
      <Table.Tr key={index}>
        <Table.Td
          style={{
            textAlign: "center",
            color: "#718096",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          {/* {index + 1} */}
          {((activePage - 1) * data.length) + (index + 1)}
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
              {job?.job_title &&
                job.job_title
                  .split(" ")
                  .map((word: any) => {
                    // Keep acronyms in parentheses uppercase
                    if (word.startsWith("(") && word.endsWith(")")) {
                      return word.toUpperCase();
                    }
                    // Handle regular words
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
                {/* {job.job_location.charAt(0).toUpperCase() +
                job.job_location.slice(1)} */}
                {job.job_location}
              </div>
            </div>
          </div>
        </Table.Td>
        <Table.Td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              color: renderStatus(job.application_deadline, job.job_status)
                .color,
            }}
          >
            {renderStatus(job.application_deadline, job.job_status).icon}
            {renderStatus(job.application_deadline, job.job_status).text}
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
          {job.solution_area || "-"}
        </Table.Td>
        <Table.Td
          style={{
            textAlign: "center",
            color: "#718096",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          {/* {new Date(job.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })} */}
          {job.created_at
            ? new Date(job.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </Table.Td>
        <Table.Td
          style={{
            textAlign: "center",
            color: "#718096",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          {/* {new Date(job.application_deadline).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })} */}
          {job.application_deadline
            ? new Date(job.application_deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 19V17C1 15.9391 1.42143 14.9217 2.17157 14.1716C2.92172 13.4214 3.93913 13 5 13H9C10.0609 13 11.0783 13.4214 11.8284 14.1716C12.5786 14.9217 13 15.9391 13 17V19M14 1.12988C14.8604 1.35018 15.623 1.85058 16.1676 2.55219C16.7122 3.2538 17.0078 4.11671 17.0078 5.00488C17.0078 5.89305 16.7122 6.75596 16.1676 7.45757C15.623 8.15918 14.8604 8.65958 14 8.87988M19 18.9999V16.9999C18.9949 16.1171 18.6979 15.2607 18.1553 14.5643C17.6126 13.8679 16.8548 13.3706 16 13.1499M3 5C3 6.06087 3.42143 7.07828 4.17157 7.82843C4.92172 8.57857 5.93913 9 7 9C8.06087 9 9.07828 8.57857 9.82843 7.82843C10.5786 7.07828 11 6.06087 11 5C11 3.93913 10.5786 2.92172 9.82843 2.17157C9.07828 1.42143 8.06087 1 7 1C5.93913 1 4.92172 1.42143 4.17157 2.17157C3.42143 2.92172 3 3.93913 3 5Z"
                  stroke="black"
                  stroke-opacity="0.4"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              style={{ fontWeight: 500, fontSize: "16px", cursor: "pointer" }}
              onClick={() => router.push(`/applicants-preview?id=${job.id}`)}
            >
              {" "}
              {job?.applicants_count ? job?.applicants_count:0 } Applicants
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
                onClick={() => router.push(`/applicants-preview?id=${job.id}`)}
              >
                View
              </Button>
            </div>
          </div>
        </Table.Td>
        <Table.Td
          style={{ textAlign: "center" }}
          // onClick={() => redirectToEditJob(job.id)}
        >
          <Menu withArrow>
            <Menu.Target>
              <svg
                width="4"
                height="18"
                viewBox="0 0 4 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9C1 9.26522 1.10536 9.51957 1.29289 9.70711C1.48043 9.89464 1.73478 10 2 10C2.26522 10 2.51957 9.89464 2.70711 9.70711C2.89464 9.51957 3 9.26522 3 9C3 8.73478 2.89464 8.48043 2.70711 8.29289C2.51957 8.10536 2.26522 8 2 8C1.73478 8 1.48043 8.10536 1.29289 8.29289C1.10536 8.48043 1 8.73478 1 9Z"
                  stroke="black"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 16C1 16.2652 1.10536 16.5196 1.29289 16.7071C1.48043 16.8946 1.73478 17 2 17C2.26522 17 2.51957 16.8946 2.70711 16.7071C2.89464 16.5196 3 16.2652 3 16C3 15.7348 2.89464 15.4804 2.70711 15.2929C2.51957 15.1054 2.26522 15 2 15C1.73478 15 1.48043 15.1054 1.29289 15.2929C1.10536 15.4804 1 15.7348 1 16Z"
                  stroke="black"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 2C1 2.26522 1.10536 2.51957 1.29289 2.70711C1.48043 2.89464 1.73478 3 2 3C2.26522 3 2.51957 2.89464 2.70711 2.70711C2.89464 2.51957 3 2.26522 3 2C3 1.73478 2.89464 1.48043 2.70711 1.29289C2.51957 1.10536 2.26522 1 2 1C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2Z"
                  stroke="black"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Menu.Item
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  textAlign: "start",
                  color: "#004A93",
                  padding: "8px 16px",
                }}
                onClick={() =>
                  router.push(`/edit-job?id=${job.id}&actions=view`)
                }
              >
                View Details
              </Menu.Item>
              {(job?.job_status === null || job?.job_status === undefined) && (
                <Menu.Item
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    textAlign: "start",
                    color: "#004A93",
                    padding: "8px 16px",
                  }}
                  onClick={() => router.push(`/edit-job?id=${job.id}`)}
                >
                  Edit Details
                </Menu.Item>
              )}
              {job?.job_status === "inactive" && (
                <Menu.Item
                  onClick={() => deleteInactiveJob(job.id)}
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    textAlign: "start",
                    color: "#004A93",
                    padding: "8px 16px",
                  }}
                >
                  Delete Job
                </Menu.Item>
              )}
              {(job?.job_status === null || job?.job_status === undefined) && (
                <Menu.Item
                  onClick={() => handleMarkInactive(job.id)}
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    textAlign: "start",
                    color: "#004A93",
                    padding: "8px 16px",
                  }}
                >
                  Mark as Inactive{job?.job_status}
                </Menu.Item>
              )}
              {(job?.job_status === null || job?.job_status === undefined) && (
                <Menu.Item
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    textAlign: "start",
                    color: "#004A93",
                    padding: "8px 16px",
                  }}
                  onClick={() =>
                    router.push(
                      `/payment?jobId=${job.id}&jobTitle=${job.job_title}&companyName=${job.company_name}`
                    )
                  }
                >
                  Promote Job
                </Menu.Item>
              )}
              <Menu.Item
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  textAlign: "start",
                  color: "#004A93",
                  padding: "8px 16px",
                }}
                onClick={() => router.push(`/job-preview?id=${job.id}`)}
              >
                Preview
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <Box mx="auto" p="lg" style={{ maxWidth: "89%" }}>
      <div className="scrollbar_hidden">
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh", // This ensures vertical centering
              width: "100%",
            }}
          >
            <Loading />
          </div>
        ) : // In the render section:
        //  <Loading />  // rest of the code

        data.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#718096",
              fontSize: "16px",
            }}
          >
            No jobs found. Start by posting your first job.
          </div>
        ) : (
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
                  #
                </Table.Th>
                <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  JOBS
                </Table.Th>
                <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  STATUS
                </Table.Th>
                <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  SOLUTION AREA
                </Table.Th>
                <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  POSTING DATE
                </Table.Th>
                <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  EXPIRY DATE
                </Table.Th>
                <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  APPLICATIONS
                </Table.Th>
                <Table.Th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </div>
      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        centered
      >
        <Text size="sm">Are you sure you want to delete this job?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="#004A93" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      {showPagination && count && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 500,
              color: "#000",
            }}
          >
            Total {count || 0} Jobs
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Pagination
              total={Math.ceil((count || 0) / 20)}
              value={activePage}
              onChange={(page) => {
                setActivePage(page);
                // router.push(`/post-job?page=${page}`);
              }}
              boundaries={1}
            />
          </div>
          {/* <Pagination total={1} boundaries={1} defaultValue={1} /> */}
        </div>
      )}
    </Box>
  );
};

export default MyJobs;
