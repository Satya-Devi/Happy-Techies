"use client";

import { Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchLocation() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("location", term);
    } else {
      params.delete("location");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextInput
      label={
        <Text size="sm" c="#000000b3" fw={700} tt="uppercase" pb="xs">
          Location
        </Text>
      }
      size="md"
      radius="md"
      variant="filled"
      leftSection={<IconSearch size={20} />}
      placeholder="Search by location"
      defaultValue={searchParams.get("location")?.toString()}
      onChange={(event) => handleSearch(event.currentTarget.value)}
    />
  );
}
