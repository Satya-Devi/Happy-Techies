"use client";

import { Container, Pagination, Select, Text } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMediaQuery } from "@mantine/hooks";

type PaginatedSearchProps = {
  total: number;
  itemsPerPage: number;
  countOptions?: string[];
  showJobsText?: boolean;
};

export default function PaginatedSearch({
  total,
  itemsPerPage,
  countOptions=["10", "25", "50"],
  showJobsText = true,
}: PaginatedSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [activePage, setActivePage] = useState(1);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setActivePage(page);
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCountChange = useDebouncedCallback((count: any) => {
    const params = new URLSearchParams(searchParams);
    if (count > 10) {
      params.set("count", count.toString());
    } else {
      params.delete("count");
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const totalPages = Math.max(Math.ceil(total / itemsPerPage), 1);

  const visiblePages = () => {
    // if (isMobile) {
    //   return [1, 2, totalPages];
    // }

    const startPages = [1, 2, 3, 4];
    const endPages = [totalPages - 1, totalPages];
    return totalPages > 6 ? [...startPages, "...", ...endPages] : [...startPages, ...endPages];
  };

  return (
    <Container
      display="flex"
      style={{
        justifyContent: "space-between",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
      }}
      p={0}
      mt="xl"
    >
      <Container
        display="flex"
        ml="0"
        style={{
          alignItems: "center",
          marginBottom: isMobile ? "1rem" : 0,
        }}
      >
        <Text>Show</Text>
        <Select
          w="68"
          mx={4}
          defaultValue={
            countOptions.includes(searchParams.get("count")||"")?
            searchParams.get("count"): countOptions[0]
          }
          data={countOptions}
          comboboxProps={{ withinPortal: false }}
          onChange={(event) => {
            handleCountChange(parseInt(event || ""));
          }}
        />
        {showJobsText && <Text>Jobs</Text>}
      </Container>

      <Pagination
        total={totalPages}
        value={activePage}
        onChange={(page) => {
          setActivePage(page);
          handleSearch(page);
        }}
        siblings={0} 
        boundaries={1} 
        withControls 
        style={{
          alignSelf: isMobile ? "center" : "flex-end",
          width: isMobile ? "100%" : "auto",
          whiteSpace: "nowrap", 
        }}
        getItemProps={(page) => ({
          style: {
            display:
              visiblePages().includes(page) || page === activePage
                ? "inline-block"
                : "none",
            fontSize: "14px"
          },
        })}
      />
    </Container>
  );
}



