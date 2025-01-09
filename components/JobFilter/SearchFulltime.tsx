"use client";

import { Checkbox } from "@mantine/core";


type SearchFulltimeProps = {
  includeFulltime: boolean;
  setIncludeFullTime: (company: boolean) => void;
};

export default function SearchFulltime({ includeFulltime, setIncludeFullTime }: SearchFulltimeProps) {

  const handleSearch = (isChecked: boolean) => {
    setIncludeFullTime(isChecked);
  }

  return (
    <>
      <Checkbox
        label="Fulltime"
        pt="md"
        color="#004a93"
        checked={includeFulltime}
        onChange={(event) => {
          const isChecked = event.currentTarget.checked;
          handleSearch(isChecked);
        }}
      />
    </>
  );
}
