'use client'

import { Text } from "@mantine/core";
import { useRouter } from "next/navigation";

export const ViewAllButton = () => {
  const router = useRouter();
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
      }}
      onClick={() => router.push('/my-jobs')}
    >
      <Text size="lg" fw={600} c="#00000099">
        View All
      </Text>
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 5H15M15 5L11 9M15 5L11 1"
          stroke="black"
          stroke-opacity="0.6"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
