"use client";
import { useEffect, useState } from "react";
import { FilterData } from "@/utils/interface";
import { Card, CardSection, Group, Text, Badge } from "@mantine/core";
import ClearFiltersButton from "./ClearFiltersButton";
import Search from "@/components/JobFilter/Search";
import SearchCompany from "@/components/JobFilter/SearchCompany";
import SearchContract from "@/components/JobFilter/SearchContract";
import SearchFulltime from "@/components/JobFilter/SearchFulltime";
import SearchLocation from "@/components/JobFilter/SearchLocation";
import SearchRemote from "@/components/JobFilter/SearchRemote";
import SearchSpeciality from "@/components/JobFilter/SearchSpeciality";
import ApplyFiltersButton from "@/components/JobFilter/ApplyFilterButton";
import { useSearchParams } from "next/navigation";
import { SFProRounded } from "@/app/layout";

export default function SearchFilters() {
  const [filterData, setFilterData] = useState<FilterData>({
    speciality: "",
    company: "",
    query: "",
    location: "",
    remote: false,
    includeFulltime: true,
    includeContractor: true,
  });
  const searchParams=useSearchParams();
  const [appliedFilters, setAppliedFilters] = useState<FilterData>(filterData);

  const setQuery = (query: string) =>
    setFilterData((prev) => ({ ...prev, query }));
  const setLocation = (location: string) =>
    setFilterData((prev) => ({ ...prev, location }));
  const setSpeciality = (speciality: string) =>
    setFilterData((prev) => ({
      ...prev,
      speciality: prev.speciality === speciality ? "" : speciality,
    }));
  const setCompany = (company: string) =>
    setFilterData((prev) => ({ ...prev, company }));
  const setRemote = (remote: boolean) =>
    setFilterData((prev) => ({ ...prev, remote }));
  const setIncludeFullTime = (includeFulltime: boolean) =>
    setFilterData((prev) => ({ ...prev, includeFulltime }));
  const setIncludeContractor = (includeContractor: boolean) =>
    setFilterData((prev) => ({ ...prev, includeContractor }));

  useEffect(() => {
    if(searchParams.get("speciality")){
      setFilterData((prev) => ({ ...prev, speciality: searchParams.get("speciality") || "" }));
    }
    if(searchParams.get("company")){
      setFilterData((prev) => ({ ...prev, company: searchParams.get("company") || "" }));
    }
    if(searchParams.get("location")){
      setFilterData((prev) => ({ ...prev, location: searchParams.get("location") || "" }));
    }
  }, [searchParams]);


  return (
    <div >
      {/* <div style={{ position: 'relative' }}>
        <Card
          p="xs"
          my="xs"
          radius="md"
          style={{
            maxWidth: 450,
            top: '-35px', // Adjust this value to move the card up or down
            left: 0,
            right: 0,
            backgroundColor: "transparent"
          }}
        >
          <CardSection
            p="md"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
            }}
          >
            <Text size="sm" c="#000000b3" fw={700} tt="uppercase" mb="sm">
              Applied Filters
            </Text>
            <Group  style={{ flexWrap: "wrap" }}>
              {appliedFilters?.query && (
                <Badge
                  color="gray"
                  radius="xl"
                  style={{
                    borderColor: "#000000b3",
                    color: "#000000b3",
                    backgroundColor: "transparent",
                    marginBottom: "4px"
                  }}
                >
                  {appliedFilters?.query}
                </Badge>
              )}
              {appliedFilters?.company && (
                <Badge
                  color="gray"
                  radius="xl"
                  style={{
                    borderColor: "#000000b3",
                    color: "#000000b3",
                    backgroundColor: "transparent",
                    marginBottom: "4px"
                  }}
                >
                  {appliedFilters?.company}
                </Badge>
              )}
              {appliedFilters?.location && (
                <Badge
                  color="gray"
                  radius="xl"
                  style={{
                    borderColor: "#000000b3",
                    color: "#000000b3",
                    backgroundColor: "transparent",
                    marginBottom: "4px",
                  }}
                >
                  {appliedFilters?.location}
                </Badge>
              )}
              {appliedFilters?.speciality && (
                <Badge
                  color="gray"
                  radius="xl"
                  style={{
                    borderColor: "#000000b3",
                    color: "#000000b3",
                    backgroundColor: "transparent",
                    marginBottom: "4px",
                  }}
                >
                  {appliedFilters?.speciality}
                </Badge>
              )}
              {appliedFilters?.remote && (
                <Badge
                  color="gray"
                  radius="xl"
                  style={{
                    borderColor: "#000000b3",
                    color: "#000000b3",
                    backgroundColor: "transparent",
                    marginBottom: "4px"
                  }}
                >
                  Remote
                </Badge>
              )}
              {appliedFilters?.includeFulltime && (
                <Badge
                  color="gray"
                  radius="xl"
                  style={{
                    borderColor: "#000000b3",
                    color: "#000000b3",
                    backgroundColor: "transparent",
                    marginBottom: "4px"
                  }}
                >
                  Full-Time
                </Badge>
              )}
              {appliedFilters?.includeContractor && (
                <Badge
                  color="gray"
                  radius="xl"
                  style={{
                    borderColor: "#000000b3",
                    color: "#000000b3",
                    backgroundColor: "transparent",
                    marginBottom: "4px"
                  }}
                >
                  Freelance/Contract
                </Badge>
              )}
            </Group>
          </CardSection>
        </Card>
      </div> */}


      {/* Search Filters Card */}
      <div className={SFProRounded.className} style={{ marginTop: "-29px" ,marginBottom:10}}>
        <Card className="hide-mobile" display={{xs:'none',md:'flex'}} p="lg" my="md" radius="md">
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
            <Search
              placeholder="Search by role"
              query={filterData.query}
              setQuery={setQuery}
            />
          </CardSection>
          <CardSection
            p="lg"
            style={{
              borderBottom: "1px solid #E0E0E0",
              margin: "0 2px",
              position: "relative"
            }}
          >
            <Text className={SFProRounded.className} size="sm" mb={4} c="#000000b3" fw={700} tt="uppercase">
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
            <SearchRemote remote={filterData.remote} setRemote={setRemote} />
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
            <Group
              style={{ display: "flex", gap: 5, flexDirection: "row" }}
              justify="space-between"
            >
              <ApplyFiltersButton
                filterData={filterData}
                setFilterData={setFilterData}
                setAppliedFilters={setAppliedFilters}
              />
              <ClearFiltersButton />
            </Group>
          </CardSection>
        </Card>
      </div>
    </div>
  );
}
