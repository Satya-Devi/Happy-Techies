"use client";

import { Button } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function ExploreJobsButton({ searchTerm }: { searchTerm: string }) {
  const router = useRouter();
  return (
    <Button
      variant="light"
      c="#004a93"
      radius="md"
      rightSection={<IconChevronRight size={14} />}
      size="md"
      onClick={() => {
        const encodedSearchTerm = searchTerm.replace(/\s+/g, "+");
        router.push(`/jobs?query=${encodedSearchTerm}`);
      }}
    >
      Explore jobs
    </Button>
  );
}
