"use client";

import { fetchAllCompanies } from "@/app/actions";
import { Autocomplete, OptionsFilter } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import Fuse from 'fuse.js';

type SearchProps = {
  placeholder: string;
  company: string;
  setCompany: (company: string) => void;
};

export default function SearchCompany({ placeholder, company, setCompany }: SearchProps) {
  const [companyList, setCompanyList] = useState<string[]>([]);

  const fuse = useMemo(() => {
    return new Fuse(companyList, {
      includeScore: true,
      threshold: 0.4,
    });
  }, [companyList]);

  useEffect(() => {
    fetchAllCompanies()
      .then((data) => {
        setCompanyList(data);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, []);

  const handleSearch = (term: string) => {
    setCompany(term);
  }
  const handleClear = () => {
    setCompany("");
  }

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    if (search) {
      const result = fuse.search(search);
      return result.map((r) => ({ label: r.item, value: r.item }))
    } else {
      return options
    }
  }

  return (
    <Autocomplete
      size="md"
      radius="md"
      variant="filled"
      leftSection={<IconSearch size={20} />}
      placeholder={placeholder}
      onChange={(value) => handleSearch(value)}
      value={company}
      data={companyList}
      filter={optionsFilter}
      rightSection={
        company ? (
          <IconX size={20} cursor='pointer' onClick={handleClear} />
        ) : null
      }
    />
  );
}
