import {
  Modal,
  TextInput,
  Button,
  Stack,
  ActionIcon,
  Group,
  Box,
  Divider,
} from "@mantine/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { IconX } from "@tabler/icons-react";

interface EmailModalProps {
  opened: boolean;
  onClose: () => void;
  recipients: { name: string; email: string }[];
  onSend: (emailData: { subject: string; message: string }) => void;
}

export function EmailModal({
  opened,
  onClose,
  recipients,
  onSend,
}: EmailModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await onSend({ subject, message });
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      size="lg"
      overlayProps={{ opacity: 0 }}
      styles={{
        content: {
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "8px",
          boxShadow: "0 1px 5px rgba(0,0,0,0.3)",
          border: "1px solid #dadce0",
          padding: 0,
          width: "600px",
        },
      }}
    >
      <Box>
        <Group
          justify="space-between"
          style={{
            backgroundColor: "#f2f3f5",
            padding: "8px 12px",
            borderBottom: "1px solid #dadce0",
          }}
        >
          <span style={{ fontWeight: 500, color: "#202124" }}>New Message</span>
          <ActionIcon
            size="sm"
            style={{ color: "", backgroundColor: "#004A93" }}
            onClick={onClose}
          >
            <IconX size={14} />
          </ActionIcon>
        </Group>

        <Stack gap={0} style={{ padding: "8px 12px" }}>
          <Group justify="space-between" align="center">
            <TextInput
              placeholder="To"
              value={recipients.map((r) => r.email).join(", ")}
              readOnly
              styles={{
                input: {
                  border: "none",
                  padding: "4px 0",
                  fontSize: "14px",
                },
              }}
            />
            <span
              style={{ color: "#004A93", fontSize: "12px", cursor: "pointer" }}
            >
              Cc
            </span>
          </Group>
          <Divider style={{ margin: "4px 0" }} />

          <TextInput
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            styles={{
              input: {
                border: "none",
                padding: "4px 0",
                fontSize: "14px",
              },
            }}
          />
          <Divider style={{ margin: "4px 0" }} />

          <ReactQuill
            theme="snow"
            value={message}
            onChange={setMessage}
            modules={modules}
            style={{ height: "200px" }}
          />
        </Stack>

        <Group
          justify="space-between"
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #dadce0",
            padding: "4px 8px",
            marginTop: "40px",
          }}
        >
          <Button
            size="sm"
            style={{
              backgroundColor: "#004A93",
              fontWeight: 500,
              borderRadius: "16px",
              padding: "4px 16px",
              color: "#fff",
            }}
            onClick={handleSend}
            disabled={!subject || !message || isLoading}
          >
            {isLoading ? "Sending..." : " Send"}
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
