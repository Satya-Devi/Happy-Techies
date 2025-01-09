"use client";

import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type SearchPartnerProps = {
  placeholder: string;
};

export default function SearchPartner({ placeholder }: SearchPartnerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("partner", term);
    } else {
      params.delete("partner");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextInput
      size="md"
      radius="md"
      leftSection={<IconSearch size={20} />}
      placeholder={placeholder}
      defaultValue={searchParams.get("partner")?.toString()}
      onChange={(event) => handleSearch(event.currentTarget.value)}
    />
  );
}
