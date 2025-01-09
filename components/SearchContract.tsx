"use client";

import { Checkbox } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchRoleType() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [contract, setContract] = useState(true);

  const handleSearch = useDebouncedCallback((isChecked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (isChecked === false) {
      params.set("includeContractor", "false");
    } else {
      params.delete("includeContractor");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <Checkbox
        label="Freelance/Contract"
        pt="md"
        color="#004a93"
        checked={contract}
        onChange={(event) => {
          const isChecked = event.currentTarget.checked;
          setContract(isChecked);
          handleSearch(isChecked);
        }}
      />
    </>
  );
}
