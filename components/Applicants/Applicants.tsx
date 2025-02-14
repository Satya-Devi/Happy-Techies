"use client";
import {
  fetchApplicantsData,
  saveApplicants,
  archiveApplicants,
} from "@/app/applicants-preview/action";
import {
  Avatar,
  Badge,
  Card,
  Group,
  Text,
  Box,
  Grid,
  Button,
  Table,
  Menu,
  ActionIcon,
  Tooltip,
  Checkbox,
  Pagination,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconArchive,
  IconBookmark,
  IconDownload,
  IconMail,
} from "@tabler/icons-react";
import Loading from "@/app/loading";
import { notifications } from "@mantine/notifications";
import { EmailModal } from "../EmailModal/EmailModal";

interface JobData {
  id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  employement_type: string;
  applicants?: Array<{
    id: string;
    name: string;
    email: string;
    resume_url?: string;
    avatar_url?: string;
    application_date: string;

    status: "pending" | "reviewed" | "rejected" | "accepted";
  }>;
  solution_area?: string;
  status: boolean;
  created_at: string;
  application_deadline: string;
}

interface ApplicantsProps {
  data: JobData;
  jobId: string;
}

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

const Applicants = ({ data }: ApplicantsProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "saved" | "archived">(
    "all"
  );
  const router = useRouter();
  const filteredApplicants = activeTab === "all" ? data.applicants : [];

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [applicantData, setApplicantData] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    getData(activePage);
  }, [activePage]);
  const getData = (page: number | undefined) => {
    console.log("DDDEEEVVVIII", data);
    setIsLoading(true);
    fetchApplicantsData({
      limit: 20,
      step: page,
      job_id: data?.id,
    })
      .then((result) => {
        if (result && result.data) setApplicantData(result.data);
        setCount(result.count ?? 0);
      })
      .catch((error) => {
        console.error(error); // Handle any errors here if necessary
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // const handleSendEmails = async () => {
  //   const selectedApplicants = applicantData.filter((applicant) =>
  //     selectedRows.includes(applicant.id)
  //   );

  //   if (selectedApplicants.length === 0) {
  //     notifications.show({
  //       title: "No Selection",
  //       message: "Please select applicants to send emails",
  //       color: "blue",
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/send-email", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ selectedApplicants }),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       notifications.show({
  //         title: "Success",
  //         message: "Emails sent successfully",
  //         color: "green",
  //       });
  //     } else {
  //       throw new Error("Failed to send emails");
  //     }
  //   } catch (error) {
  //     notifications.show({
  //       title: "Error",
  //       message: "Failed to send emails",
  //       color: "red",
  //     });
  //   }
  // };

  //  const handleMarkInactive = (jobId: any) => {
  //     markJobInactive(jobId)
  //       .then(() => {
  //         // Refresh the jobs data
  //         getData(activePage);
  //       })
  //       .catch((error) => {
  //         console.error("Error marking job as inactive:", error);
  //       });
  //   };

  const [emailModalOpened, setEmailModalOpened] = useState(false);
  const [validApplicants, setValidApplicants] = useState<
    Array<{ name: string; email: string }>
  >([]);

  // const handleSendEmails = async () => {
  //   const selectedApplicants = applicantData.filter((applicant) =>
  //     selectedRows.includes(applicant.id)
  //   );

  //   console.log("Selected Applicants:", selectedApplicants);
  //   console.log(
  //     "Selected Applicants for Email:",
  //     selectedApplicants.map((applicant) => ({
  //       name: applicant.full_name,
  //       email: applicant.email,
  //       jobTitle: data.job_title,
  //       applicationDate: new Date(applicant.created_at).toLocaleDateString(),
  //     }))
  //   );

  //   if (selectedApplicants.length === 0) {
  //     console.log("No applicants selected for emails");
  //     notifications.show({
  //       title: "Select Applicants",
  //       message: "Please select applicants to send emails",
  //       color: "blue",
  //     });
  //     return;
  //   }

  //   if (selectedApplicants.length === 0) {
  //     notifications.show({
  //       title: "Select Applicants",
  //       message: "Please select applicants to send emails",
  //       color: "blue",
  //     });
  //     return;
  //   }

  //   const validApplicants = applicantData.filter(
  //     (applicant) =>
  //       selectedRows.includes(applicant.id) &&
  //       applicant.email &&
  //       applicant.full_name
  //   );

  //   try {
  //     const response = await fetch("/api/send-email", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         selectedApplicants: validApplicants,
  //         jobTitle: data.job_title,
  //       }),
  //     });

  //     const result = await response.json();
  //     if (result.success) {
  //       notifications.show({
  //         title: "Success",
  //         message: `Emails sent to ${validApplicants.length} applicants`,
  //         color: "green",
  //       });
  //     }
  //   } catch (error) {
  //     notifications.show({
  //       title: "Error",
  //       message: "Failed to send emails",
  //       color: "red",
  //     });
  //   }
  // };

  // const handleEmailClick = () => {
  //   const validApplicants = applicantData.filter(applicant =>
  //     selectedRows.includes(applicant.id) &&
  //     applicant.email &&
  //     applicant.full_name
  //   );

  //   if (validApplicants.length === 0) {
  //     notifications.show({
  //       title: 'Select Recipients',
  //       message: 'Please select applicants with valid email addresses',
  //       color: 'blue'
  //     });
  //     return;
  //   }

  //   setEmailModalOpened(true);
  // };

  const handleEmailClick = () => {
    const filtered = applicantData
      .filter(
        (applicant) =>
          selectedRows.includes(applicant.id) &&
          applicant.email &&
          applicant.full_name
      )
      .map((applicant) => ({
        name: applicant.full_name,
        email: applicant.email,
      }));

    if (filtered.length === 0) {
      notifications.show({
        title: "Select Recipients",
        message: "Please select applicants with valid email addresses",
        color: "blue",
      });
      return;
    }

    setValidApplicants(filtered);
    setEmailModalOpened(true);
  };

  // const handleSendEmail = async (emailData: {
  //   subject: string;
  //   message: string;
  // }) => {
  //   // API call to send email
  //   setEmailModalOpened(false);
  //   notifications.show({
  //     title: "Success",
  //     message: "Email sent successfully",
  //     color: "green",
  //   });
  // };
  const handleSendEmail = async (emailData: {
    subject: string;
    message: string;
  }) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: validApplicants,
          subject: emailData.subject,
          message: emailData.message,
          jobTitle: data.job_title,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to send emails");
      }

      setEmailModalOpened(false);
      setValidApplicants([]);
      setSelectedRows([]);
      notifications.show({
        title: "Success",
        message: `Emails sent to ${validApplicants.length} applicants`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to send emails. Please try again.",
        color: "red",
      });
      // Keep modal open with entered data
      return false; // Prevent modal from closing
    }
  };

  const halfLength = Math.ceil(applicantData.length / 2);
  const firstHalf = applicantData.slice(0, halfLength);
  const secondHalf = applicantData.slice(halfLength);

  const firstRows = firstHalf.map((applicant) => (
    <Table.Tr
      key={applicant.id}
      bg={
        selectedRows.includes(applicant.id)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
    >
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(applicant.id)}
          onChange={(event) => {
            const newSelectedRows = event.currentTarget.checked
              ? [...selectedRows, applicant.id]
              : selectedRows.filter((id) => id !== applicant.id);
            setSelectedRows(newSelectedRows);
            setSelectedApplicantIds(newSelectedRows);
            console.log("Selected Applicant IDs:", newSelectedRows);
          }}
        />
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Group>
          <Box visibleFrom="md">
            <Avatar size={40} radius={40} />
          </Box>
          <div>
            <Text fw={500}>{applicant.full_name}</Text>
            <Text size="sm" c="#718096">
              {data.job_title}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Text c="#718096">{applicant.experience} yrs </Text>
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Text c="#718096">
          {applicant.created_at
            ? new Date(applicant.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </Text>
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        {" "}
        <Menu withArrow>
          <Menu.Target>
            <Button
              variant="subtle"
              p={10}
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "none",
              }}
            >
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
            </Button>
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
              onClick={() => {
                router.push(`/application-form?id=${applicant?.id}`);
              }}
            >
              View Details
            </Menu.Item>
            <Menu.Item
              style={{
                fontSize: "15px",
                fontWeight: 500,
                textAlign: "start",
                color: "#004A93",
                padding: "8px 16px",
              }}
            >
              Approve
            </Menu.Item>
            <Menu.Item
              style={{
                fontSize: "15px",
                fontWeight: 500,
                textAlign: "start",
                color: "#004A93",
                padding: "8px 16px",
              }}
            >
              Reject
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  const secondRows = secondHalf.map((applicant) => (
    <Table.Tr
      key={applicant.id}
      bg={
        selectedRows.includes(applicant.id)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
    >
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(applicant.id)}
          onChange={(event) => {
            const newSelectedRows = event.currentTarget.checked
              ? [...selectedRows, applicant.id]
              : selectedRows.filter((id) => id !== applicant.id);
            setSelectedRows(newSelectedRows);
            setSelectedApplicantIds(newSelectedRows);
            console.log("Selected Applicant IDs:", newSelectedRows);
          }}
        />
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Group>
          <Box visibleFrom="md">
            <Avatar size={40} radius={40} />
          </Box>
          <div>
            <Text fw={500}>{applicant.full_name}</Text>
            <Text size="sm" c="#718096">
              {data.job_title}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Text c="#718096">{applicant.experience} yrs </Text>
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        <Text c="#718096">
          {applicant.created_at
            ? new Date(applicant.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </Text>
      </Table.Td>
      <Table.Td style={{ whiteSpace: "nowrap" }}>
        {" "}
        <Button
          variant="subtle"
          p={10}
          style={{
            cursor: "pointer",
            background: "transparent",
            border: "none",
          }}
        >
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
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>(
    []
  );

  const handleSelectAll = () => {
    if (selectedRows.length === applicantData.length) {
      setSelectedRows([]);
      console.log("Deselected all - Selected IDs:", []);
    } else {
      const allIds = applicantData.map((applicant) => applicant.id);
      setSelectedRows(allIds);
      console.log("Selected all - Selected IDs:", allIds);
    }
  };

  const getArchivedData = (page: number | undefined) => {
    setIsLoading(true);

    fetchApplicantsData({
      limit: 20,
      step: page,
      job_id: data?.id,
      applicant_type: "archived",
    })
      .then((result) => {
        if (result && result.data) setApplicantData(result.data);
        setCount(result.count ?? 0);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const savedData = (page: number | undefined) => {
    setIsLoading(true);

    fetchApplicantsData({
      limit: 20,
      step: page,
      job_id: data?.id,
      applicant_type: "saved",
    })
      .then((result) => {
        if (result && result.data) setApplicantData(result.data);
        setCount(result.count ?? 0);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleArchive = () => {
    console.log(
      "Selected Applicant called arechhive IDs:",
      selectedApplicantIds
    );
    const pageData = {
      applicant_ids: selectedApplicantIds,
      job_id: data.id,
    };

    archiveApplicants(pageData)
      .then((result) => {
        if (result === true) {
          getData(activePage);
          setSelectedRows([]);
          notifications.show({
            title: "Success",
            message: "Selected applicants have been archived",
            color: "green",
          });
        } else {
          throw new Error("Archive operation failed");
        }
      })
      .catch((error) => {
        console.error("Archive error:", error);
        notifications.show({
          title: "Error",
          message: "Failed to archive selected applicants",
          color: "red",
        });
      });
  };

  const handleSavedApplicants = () => {
    console.log("Selected Applicant handle save IDs:", selectedApplicantIds);
    const pageData = {
      applicant_ids: selectedApplicantIds,
      job_id: data.id,
    };

    saveApplicants(pageData)
      .then((result) => {
        if (result === true) {
          getData(activePage);
          setSelectedRows([]);
          notifications.show({
            title: "Success",
            message: "Selected applicants have been saved",
            color: "green",
          });
        } else {
          throw new Error("Saving operation failed");
        }
      })
      .catch((error) => {
        console.error("Saving error:", error);
        notifications.show({
          title: "Error",
          message: "Failed to save selected applicants",
          color: "red",
        });
      });
  };

  return (
    <Box mx="auto" p="lg" style={{ maxWidth: "89%" }}>
      <div className="scrollbar_hidden">
        <Table
          verticalSpacing="sm"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px 8px 0 0",
            borderBottom: "2px solid #DDF0FD",
            marginBottom: "20px",
          }}
        >
          <Table.Thead
            style={{
              backgroundColor: "#DDF0FD",
              color: "#004A93",
              height: "30px",
            }}
          >
            <Table.Tr>
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
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                    }}
                  >
                    {data?.job_title &&
                      data.job_title
                        .split(" ")
                        .map((word: any) => {
                          if (word.startsWith("(") && word.endsWith(")")) {
                            return word.toUpperCase();
                          }
                          // Handle regular words
                          return (
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
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
                    <div>{data?.employement_type}</div>
                    {data?.job_location && data?.employement_type && (
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
                      {data.job_location}
                    </div>
                  </div>
                </div>
              </Table.Td>
              <Table.Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "3px",
                    color: renderStatus(data.application_deadline).color,
                  }}
                >
                  {renderStatus(data.application_deadline).icon}
                  {renderStatus(data.application_deadline).text}
                </div>
              </Table.Td>
              <Table.Td
                style={{
                  textAlign: "center",
                  color: "#718096",
                  fontWeight: 500,
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {data.solution_area || "-"}
              </Table.Td>
              <Table.Td
                style={{
                  textAlign: "center",
                  color: "#718096",
                  fontWeight: 500,
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {/* {new Date(job.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })} */}
                {data.created_at
                  ? new Date(data.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })
                  : "-"}
              </Table.Td>
              <Table.Td
                style={{
                  textAlign: "center",
                  color: "#718096",
                  fontWeight: 500,
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {/* {new Date(job.application_deadline).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })} */}
                {data.application_deadline
                  ? new Date(data.application_deadline).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )
                  : "-"}
              </Table.Td>
              <Table.Td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        router.push(`/applicants-preview?id=${data.id}`)
                      }
                    >
                      0 Applicants
                    </div>
                  </div>
                  <Button
                    size="xs"
                    style={{
                      backgroundColor: "#DDF0FD",
                      color: "#004A93",
                      margin: "0 auto",
                      display: "block",
                    }}
                    onClick={() => router.push(`/job-preview?id=${data.id}`)}
                  >
                    View
                  </Button>
                </div>
              </Table.Td>
              <Table.Td
                style={{ textAlign: "center", whiteSpace: "nowrap" }}
                // onClick={() => redirectToEditJob(job.id)}
              >
                <Menu withArrow>
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      p={10}
                      style={{
                        cursor: "pointer",
                        background: "transparent",
                        border: "none",
                      }}
                    >
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
                    </Button>
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
                        router.push(`/edit-job?id=${data.id}&edit=false`)
                      }
                    >
                      Edit Details
                    </Menu.Item>
                    <Menu.Item
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        textAlign: "start",
                        color: "#004A93",
                        padding: "8px 16px",
                      }}
                    >
                      Mark as Inactive
                    </Menu.Item>
                    <Menu.Item
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        textAlign: "start",
                        color: "#004A93",
                        padding: "8px 16px",
                      }}
                    >
                      Mark as Expired
                    </Menu.Item>
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
                          `/payment?jobId=${data.id}&jobTitle=${data.job_title}`
                        )
                      }
                    >
                      Promote Job
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <div
        style={{
          backgroundColor: "#EAF4FF",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "15px",
          overflowX: "auto",
        }}
        className="scrollbar_hidden"
      >
        <Group
          wrap="nowrap"
          style={{
            minWidth: "max-content",
          }}
        >
          {/* Primary Action Buttons */}
          <Group wrap="wrap" gap="xs">
            <Button
              size="sm"
              color={activeTab === "all" ? "blue" : "#004A93"}
              variant={activeTab === "all" ? "filled" : "outline"}
              radius="xl"
              onClick={() => {
                setActiveTab("all");
                getData(1);
              }}
            >
              All Applicants
            </Button>

            <Button
              size="sm"
              color={activeTab === "saved" ? "blue" : "#004A93"}
              variant={activeTab === "saved" ? "filled" : "outline"}
              radius="xl"
              onClick={() => {
                setActiveTab("saved");
                savedData(1);
              }}
            >
              Saved Candidates
            </Button>

            <Button
              size="sm"
              color={activeTab === "archived" ? "blue" : "#004A93"}
              variant={activeTab === "archived" ? "filled" : "outline"}
              radius="xl"
              onClick={() => {
                setActiveTab("archived");
                getArchivedData(1);
              }}
            >
              Archived Candidates
            </Button>
          </Group>

          <div style={{ flexGrow: 1 }} />

          {/* Action Buttons Group */}
          <Group gap="xs" wrap="nowrap">
            <Button
              size="sm"
              color="#004A93"
              variant="filled"
              radius="md"
              onClick={handleSelectAll}
            >
              {selectedRows.length === applicantData.length
                ? "Deselect All"
                : "Select All"}
            </Button>

            <Group gap="xs" wrap="nowrap">
              <Tooltip label="Bookmark" withArrow>
                <ActionIcon
                  color="#718096"
                  variant="transparent"
                  onClick={handleSavedApplicants}
                >
                  <IconBookmark size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Download" withArrow>
                <ActionIcon color="#718096" variant="transparent">
                  <IconDownload size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Archive" withArrow>
                <ActionIcon
                  color="#718096"
                  variant="transparent"
                  onClick={handleArchive}
                >
                  <IconArchive size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Mail" withArrow>
                <ActionIcon
                  color="#718096"
                  variant="transparent"
                  onClick={handleEmailClick}
                >
                  <IconMail size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Group>
      </div>

      <div
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
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

        applicantData.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#718096",
              fontSize: "16px",
            }}
          >
            No Data found.
          </div>
        ) : (
          <Grid className="scrollbar_hidden">
            <Grid.Col span={{ xs: 12, sm: 6 }}>
              <Table
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  border: "1px solid #EAF4FF",
                  whiteSpace: "nowrap",
                }}
              >
                <Table.Thead bg={"#EAF4FF"} c="#004A93">
                  <Table.Tr>
                    <Table.Th />
                    <Table.Th>APPLICANTS</Table.Th>
                    <Table.Th>EXPERIENCE</Table.Th>
                    <Table.Th>APPLIED ON</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{firstRows}</Table.Tbody>
              </Table>
            </Grid.Col>

            <Grid.Col span={{ xs: 12, sm: 6 }}>
              <Table
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  border: "1px solid #EAF4FF",
                  whiteSpace: "nowrap",
                }}
              >
                <Table.Thead bg={"#EAF4FF"} c="#004A93">
                  <Table.Tr>
                    <Table.Th />
                    <Table.Th>APPLICANTS</Table.Th>
                    <Table.Th>EXPERIENCE</Table.Th>
                    <Table.Th>APPLIED ON</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{secondRows}</Table.Tbody>
              </Table>
            </Grid.Col>
          </Grid>
        )}
      </div>
      {count && count >= 1 && (
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
            Total {count} Jobs
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
      <EmailModal
        opened={emailModalOpened}
        onClose={() => setEmailModalOpened(false)}
        recipients={validApplicants}
        onSend={handleSendEmail}
      />
    </Box>
  );
};
export default Applicants;
