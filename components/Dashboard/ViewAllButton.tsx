'use client'

import { Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import styles from "./ViewAllButton.module.css";

type Props = {
  redirectUrl?: string | undefined;
};

export const ViewAllButton = ({ redirectUrl }: Props) => {
  const router = useRouter();

  return (
    <div
      className={styles.viewAllContainer}
      onClick={() => router.push(`${redirectUrl}`)}
    >
      <Text className={styles.viewAllText}>View All</Text>
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.viewAllArrow}
      >
        <path
          d="M1 5H15M15 5L11 9M15 5L11 1"
          stroke="black"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
