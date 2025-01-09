"use client";

import { Checkbox } from "@mantine/core";

type SearchRemoteProps = {
  remote: boolean;
  setRemote: (company: boolean) => void;
};

export default function SearchRemote({remote,setRemote}:SearchRemoteProps) {
  const handleChange=(term:boolean)=>setRemote(term);
  
  return (
    <>
      <Checkbox
        label="Remote only"
        pt="md"
        color="#004a93"
        checked={remote}
        onChange={(event) => {
          handleChange(event.currentTarget.checked);
        }}
      />
    </>
  );
}
