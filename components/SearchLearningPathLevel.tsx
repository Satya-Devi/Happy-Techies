"use client";

import { Select } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchLearningPathLevel() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState<string | null>("");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("learningPathLevel", term);
    } else {
      params.delete("learningPathLevel");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Select
      placeholder="Select a learning path level"
      data={[
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
      ]}
      value={value}
      defaultValue={value}
      onChange={(selectedValue) => {
        setValue(selectedValue);
        handleSearch(selectedValue ?? "");
      }}
    />
  );
}
