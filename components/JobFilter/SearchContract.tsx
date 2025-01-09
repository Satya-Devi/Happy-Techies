"use client";

import { Checkbox } from "@mantine/core";

type SearchRoleTypeProps = {
  includeContractor: boolean;
  setIncludeContractor: (includeContractor: boolean) => void;
};

export default function SearchRoleType({includeContractor,setIncludeContractor}:SearchRoleTypeProps) {

  const handleChange = (isChecked: boolean) => {
    setIncludeContractor(isChecked);
  }

  return (
    <>
      <Checkbox
        label="Freelance/Contract"
        pt="md"
        color="#004a93"
        checked={includeContractor}
        onChange={(event) => {
          const isChecked = event.currentTarget.checked;
          handleChange(isChecked);
        }}
      />
    </>
  );
}
