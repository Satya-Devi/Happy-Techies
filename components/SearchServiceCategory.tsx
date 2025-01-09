"use client";

import { Select } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchServiceCategory() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState<string | null>("");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("careerServiceCategory", term);
    } else {
      params.delete("careerServiceCategory");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const uniqueCategories = ["Resume", "Interview", "Courses", "Job Matching", "Tools","Microsoft Recruiters","Tech Recruiters","Certifications & Training"];
  const categoryOptions = uniqueCategories.map((label) => ({
    value: label.toLowerCase(),
    label,
  }));

  return (
    <Select
      placeholder="Select a category"
      data={categoryOptions}
      value={value}
      defaultValue={value}
      onChange={(selectedValue) => {
        setValue(selectedValue);
        handleSearch(selectedValue ?? "");
      }}
    />
  );
}
