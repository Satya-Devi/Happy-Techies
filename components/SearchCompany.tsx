"use client";

import { TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SFProRounded } from "@/app/layout";

type SearchProps = {
  placeholder: string;
};

export default function SearchCompany({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const debounceTime = isMobile ? 800 : 300;

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("company", term);
    } else {
      params.delete("company");
    }
    replace(`${pathname}?${params.toString()}`);
  }, debounceTime);

  return (
    <TextInput
      size="md"
      radius="md"
      className={SFProRounded.className}
      variant="filled"
      leftSection={<IconSearch size={20} />}
      placeholder={placeholder}
      defaultValue={searchParams.get("company")?.toString()}
      onChange={(event) => handleSearch(event.currentTarget.value)}
    />
  );
}
