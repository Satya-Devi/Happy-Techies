"use client";

import { fetchAllLocations } from "@/app/actions";
import { Autocomplete, Text, OptionsFilter } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import Fuse from 'fuse.js';

type SearchLocationProps = {
  location: string;
  setLocation: (company: string) => void;
};
export default function SearchLocation({ location, setLocation }: SearchLocationProps) {
  const [locations, setLocations] = useState<string[]>([]);

  const fuse = useMemo(() => {
    return new Fuse(locations, {
      includeScore: true,
      threshold: 0.4,
    });
  }, [locations]);

  useEffect(() => {
    fetchAllLocations()
      .then((data) => {
        setLocations(data as string[]);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      })
  }, []);


  const handleChange = (term: string) => {
    setLocation(term);
  }

  const handleClear = () => {
    setLocation("");
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
      value={location || ""}
      data={locations}
      filter={optionsFilter}
      onChange={(text) => handleChange(text)}
      rightSection={
        location ? (
          <IconX size={20} cursor='pointer' onClick={handleClear} />
        ) : null
      }
    />
  );
}
