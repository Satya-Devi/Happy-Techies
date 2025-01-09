"use client";

import { roleCategories } from "@/utils/helpers";
import { Select } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchRoleCategory() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState<string | null>("");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("roleCategory", term);
    } else {
      params.delete("roleCategory");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const uniqueCategories = Array.from(new Set(Object.values(roleCategories)));
  const categoryOptions = uniqueCategories
    .filter(
      (label) =>
        !["Education", "Networking", "Support", "Writing"].includes(label)
    )
    .map((label) => ({
      value: label.toLowerCase().replace(/\s+/g, "-"),
      label,
    }));

  return (
    <Select
      placeholder="Select a role category"
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
