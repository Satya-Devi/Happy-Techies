// import { Modal, TextInput, Textarea, Button, Stack } from '@mantine/core';
// import { useState } from 'react';

// interface EmailModalProps {
//   opened: boolean;
//   onClose: () => void;
//   recipients: { name: string; email: string }[];
//   onSend: (emailData: {subject: string; message: string}) => void;
// }

// export function EmailModal({ opened, onClose, recipients, onSend }: EmailModalProps) {
//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title="Compose Email"
//       size="lg"
//     >
//       <Stack>
//         <TextInput
//           label="To"
//           value={recipients.map(r => r.email).join(', ')}
//           readOnly
//         />

//         <TextInput
//           label="Subject"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           placeholder="Enter email subject"
//         />

//         <Textarea
//           label="Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message here"
//           minRows={10}
//         />

//         <Button
//           onClick={() => onSend({ subject, message })}
//           disabled={!subject || !message}
//         >
//           Send Email
//         </Button>
//       </Stack>
//     </Modal>
//   );
// }

// import { Modal, TextInput, Textarea, Button, Stack, ActionIcon, Group, Box } from '@mantine/core';
// import { useState } from 'react';
// import { IconBold, IconItalic, IconUnderline, IconLink, IconPhoto, IconPaperclip } from '@tabler/icons-react';

// interface EmailModalProps {
//   opened: boolean;
//   onClose: () => void;
//   recipients: { name: string; email: string }[];
//   onSend: (emailData: {subject: string; message: string}) => void;
// }

// export function EmailModal({ opened, onClose, recipients, onSend }: EmailModalProps) {
//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title="New Message"
//       size="xl"
//       styles={{
//         title: {
//           backgroundColor: '#404040',
//           color: 'white',
//           padding: '10px 15px',
//           width: '100%',
//           margin: -16,
//           marginBottom: 16
//         },
//         body: {
//           padding: 0
//         }
//       }}
//     >
//       <Box p="md">
//         <Stack>
//           <TextInput
//             placeholder="Recipients"
//             value={recipients.map(r => r.email).join(', ')}
//             readOnly
//             styles={{
//               input: {
//                 border: 'none',
//                 borderBottom: '1px solid #e0e0e0'
//               }
//             }}
//           />

//           <TextInput
//             placeholder="Subject"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             styles={{
//               input: {
//                 border: 'none',
//                 borderBottom: '1px solid #e0e0e0'
//               }
//             }}
//           />

//           <Group p="xs">
//             <ActionIcon><IconBold size={18} /></ActionIcon>
//             <ActionIcon><IconItalic size={18} /></ActionIcon>
//             <ActionIcon><IconUnderline size={18} /></ActionIcon>
//             <ActionIcon><IconLink size={18} /></ActionIcon>
//             <ActionIcon><IconPhoto size={18} /></ActionIcon>
//             <ActionIcon><IconPaperclip size={18} /></ActionIcon>
//           </Group>

//           <Textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type your message here"
//             minRows={15}
//             styles={{
//               input: {
//                 border: 'none',
//                 fontSize: '14px'
//               }
//             }}
//           />

//           <Group p="xs" style={{ borderTop: '1px solid #e0e0e0' }}>
//             <Button
//               onClick={() => onSend({ subject, message })}
//               disabled={!subject || !message}
//               size="md"
//               style={{ backgroundColor: '#0b57d0' }}
//             >
//               Send
//             </Button>
//           </Group>
//         </Stack>
//       </Box>
//     </Modal>
//   );
// }

import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  ActionIcon,
  Group,
  Box,
  Divider,
} from "@mantine/core";
import { useState } from "react";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconLink,
  IconPhoto,
  IconPaperclip,
  IconX,
  IconMinimize,
  IconChevronDown,
} from "@tabler/icons-react";

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
        {/* Header */}
        <Group
          justify="space-between"
          style={{
            backgroundColor: "#f2f3f5",
            padding: "8px 12px",
            borderBottom: "1px solid #dadce0",
          }}
        >
          <span style={{ fontWeight: 500, color: "#202124" }}>New Message</span>
          <Group gap="xs">
            {/* <ActionIcon size="sm" style={{ color: '' }}><IconMinimize size={14} /></ActionIcon> */}
            <ActionIcon
              size="sm"
              style={{ color: "", backgroundColor: "#004A93" }}
              onClick={onClose}
            >
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Group>

        <Stack gap={0} style={{ padding: "8px 12px" }}>
          {/* To field */}
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

          {/* Subject field */}
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

          {/* Message Area */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
            minRows={10}
            styles={{
              input: {
                border: "none",
                fontSize: "14px",
                padding: "8px 0",
                minHeight: "300px",
              },
            }}
          />
        </Stack>

        {/* Formatting Toolbar */}
        <Group
          justify="space-between"
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #dadce0",
            padding: "4px 8px",
          }}
        >
          <Group gap="xs">
            <Button
              size="sm"
              style={{
                backgroundColor: "#004A93",
                fontWeight: 500,
                borderRadius: "16px",
                padding: "4px 16px",
                color: "#fff",
              }}
              onClick={() => onSend({ subject, message })}
              disabled={!subject || !message}
            >
              Send
            </Button>
            {/* <ActionIcon size="sm" style={{ color: '' }}><IconChevronDown size={14} /></ActionIcon> */}
          </Group>

          <Group gap="xs">
            <ActionIcon
              size="sm"
              style={{ color: "", backgroundColor: "#004A93" }}
            >
              <IconBold size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              style={{ color: "", backgroundColor: "#004A93" }}
            >
              <IconItalic size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              style={{ color: "", backgroundColor: "#004A93" }}
            >
              <IconUnderline size={14} />
            </ActionIcon>
            {/* <ActionIcon
              size="sm"
              style={{ color: "", backgroundColor: "#004A93" }}
            >
              <IconLink size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              style={{ color: "", backgroundColor: "#004A93" }}
            >
              <IconPhoto size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              style={{ color: "", backgroundColor: "#004A93" }}
            >
              <IconPaperclip size={14} />
            </ActionIcon> */}
          </Group>
        </Group>
      </Box>
    </Modal>
  );
}
