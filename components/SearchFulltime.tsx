"use client";

import { Checkbox } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchFulltime() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [fullTime, setFullTime] = useState(true);

  const handleSearch = useDebouncedCallback((isChecked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (isChecked === false) {
      params.set("includeFulltime", "false");
    } else {
      params.delete("includeFulltime");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <Checkbox
        label="Fulltime"
        pt="md"
        color="#004a93"
        checked={fullTime}
        onChange={(event) => {
          const isChecked = event.currentTarget.checked;
          setFullTime(isChecked);
          handleSearch(isChecked);
        }}
      />
    </>
  );
}
