"use client";
import { Autocomplete, OptionsFilter } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import Fuse from 'fuse.js';
import FilterData from "@/utils/constants/FilterData";
import { useEffect, useMemo, useState } from "react";
import { fetchTopRoles } from "@/app/actions";

type SearchProps = {
  placeholder: string;
  query: string;
  setQuery: (query: string) => void;
};



export default function Search({ placeholder, query, setQuery }: SearchProps) {
  const [suggestion,setSuggestion] = useState<string[]>(FilterData.Query);

  useEffect(()=>{
    fetchTopRoles()
    .then((data) => {
      setSuggestion(data);
    })
    .catch((error) => {
      console.error(error);
    });
  },[])

  const fuse=useMemo(()=>{
    return new Fuse(suggestion, {
      includeScore: true,
      threshold: 0.4,  // Adjust this to match misspelled terms better
    });
  },[suggestion])
  
  const handleChange = (term: string) => {
    setQuery(term);
  }

  const handleClear = () => {
    setQuery("");
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
      value={query}
      data={suggestion}
      filter={optionsFilter}
      rightSection={
        query ? (
          <IconX cursor='pointer' size={20} onClick={handleClear} />
        ) : null
      }
      onChange={(value) => handleChange(value)}
    />
  );
}
