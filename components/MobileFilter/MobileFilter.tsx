"use client";
import { useState } from "react";
import {
  Card,
  CardSection,
  Drawer,
  Group,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FilterData } from "@/utils/interface";
import { IconFilter } from "@tabler/icons-react";
import ClearFiltersButton from "@/components/ClearFiltersButton";
import Search from "@/components/JobFilter/Search";
import SearchCompany from "@/components/JobFilter/SearchCompany";
import SearchContract from "@/components/JobFilter/SearchContract";
import SearchFulltime from "@/components/JobFilter/SearchFulltime";
import SearchLocation from "@/components/JobFilter/SearchLocation";
import SearchRemote from "@/components/JobFilter/SearchRemote";
import SearchSpeciality from "@/components/JobFilter/SearchSpeciality";
import ApplyFiltersButton from "@/components/JobFilter/ApplyFilterButton";
import { SFProRounded } from "@/app/layout";

export default function MobileFilter() {
  const [opened, { open, close }] = useDisclosure(false);
  const [filterData, setFilterData] = useState<FilterData>({
    speciality: "",
    company: "",
    query: "",
    location: "",
    remote: false,
    includeFulltime: true,
    includeContractor: true,
  });


  const setQuery=(query: string)=>setFilterData(prev=>({...prev,query}));
  const setLocation = (location: string) => setFilterData(prev=>({ ...prev, location }));
  const setSpeciality = (speciality: string) => setFilterData(prev=>({ ...prev, speciality }));
  const setCompany = (company: string) => setFilterData(prev=>({ ...prev, company }));
  const setRemote = (remote: boolean) => setFilterData(prev=>({ ...prev, remote }));
  const setIncludeFullTime = (includeFulltime: boolean) => setFilterData(prev=>({ ...prev, includeFulltime }));
  const setIncludeContractor = (includeContractor: boolean) => setFilterData(prev=>({ ...prev, includeContractor }));
  const [appliedFilters, setAppliedFilters] = useState<FilterData>(filterData);

  return (
    <>
      <Drawer className={SFProRounded.className} opened={opened} onClose={close}>
        <Card p="md" my="md" radius="md">
          <CardSection
            p="lg"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
            }}
          >
            <Text size="sm" c="#000000b3" fw={700} tt="uppercase" pb="xs">
              Search
            </Text>
            <Search placeholder="Search by role" query={filterData.query} setQuery={setQuery}/>
          </CardSection>
          <CardSection
            p="lg"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
              position: "relative",
            }}
          >
            <Text size="sm" c="#000000b3" fw={700} tt="uppercase">
              Key Technologies
            </Text>
            <SearchSpeciality 
              setSpeciality={setSpeciality} 
              speciality={filterData.speciality}
            />
          </CardSection>
          <CardSection
            p="lg"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
            }}
          >
            <Text size="sm" c="#000000b3" fw={700} tt="uppercase" pb="xs">
              Company
            </Text>
            <SearchCompany 
               placeholder="Search by company" 
               company={filterData.company}
               setCompany={setCompany}
            />
          </CardSection>
          <CardSection
            p="lg"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
            }}
          >
            <SearchLocation 
              location={filterData.location}
              setLocation={setLocation}
            />
            <SearchRemote 
              remote={filterData.remote}
              setRemote={setRemote}
            />
          </CardSection>
          <CardSection
            p="lg"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
            }}
          >
            <Text size="sm" c="#000000b3" fw={700} tt="uppercase">
              Type
            </Text>
            <SearchFulltime 
               includeFulltime={filterData.includeFulltime}
               setIncludeFullTime={setIncludeFullTime}
            />
            <SearchContract 
                includeContractor={filterData.includeContractor}
                setIncludeContractor={setIncludeContractor}
            />
          </CardSection>
          <CardSection
            p="lg"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
            }}
          >
            <Group justify="space-between">
              <ApplyFiltersButton filterData={filterData} setAppliedFilters={setAppliedFilters} setFilterData={setFilterData}/>
              <ClearFiltersButton />
            </Group>
          </CardSection>
        </Card>
      </Drawer>

      <ThemeIcon
        variant="default"
        size="xl"
        radius="md"
        color="gray"
        hiddenFrom="md"
        onClick={open}
      >
        <IconFilter style={{ width: "70%", height: "70%" }} />
      </ThemeIcon>
    </>
  );
}
