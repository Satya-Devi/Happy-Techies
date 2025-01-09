"use client";

import { Checkbox } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchRemote() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [checked, setChecked] = useState(false);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("remote", term);
    } else {
      params.delete("remote");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <Checkbox
        label="Remote only"
        pt="md"
        color="#004a93"
        checked={checked}
        onChange={(event) => {
          setChecked(event.currentTarget.checked);
          handleSearch(event.currentTarget.checked ? "true" : "");
        }}
      />
    </>
  );
}
