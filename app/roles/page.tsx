import { Hero } from "@/components/Hero/Hero";
import { RoleCard } from "@/components/RoleCard/RoleCard";
import SearchRoleCategory from "@/components/SearchRoleCategory";
import {
  categoryIcons,
  countCertifications,
  countRoles,
  excludedRoles,
  roleCategories,
} from "@/utils/helpers";
import { Container, Group, SimpleGrid, Title } from "@mantine/core";
import fs from "fs/promises";
import path from "path";
import { SFProRounded } from "../layout";
import { fetchJobs } from "../actions";
import classes from "./roles.module.css";
import Head from "next/head";

const trendingRolesList = [
  "AI Engineer",
  "Data Engineer",
  "Data Analyst",
  "Data Scientist",
  "Developer",
  "DevOps Engineer",
  "Functional Consultant",
  "Security Engineer",
  "Administrator",
];

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    roleCategory?: string;
  };
}) {
  //   const response = await fetch("https://learn.microsoft.com/api/catalog/");
  //   const data = await response.json();
  //   const roles: { id: keyof typeof roleCategories; name: string }[] = data.roles;

  //   console.log(data);

  const filePath = path.join(process.cwd(), "api_catalog.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(fileContents);
  const roles: { id: keyof typeof roleCategories; name: string }[] = data.roles;
  const totalCounts = countRoles(data.learningPaths);
  const totalCertifications = countCertifications(data.certifications);

  const search =
    searchParams?.roleCategory?.toLowerCase().replace("-", " ") || "";

  const trendingRoles = roles.filter((role) =>
    trendingRolesList.includes(role.name)
  );
  const otherRoles = roles.filter(
    (role) =>
      !excludedRoles.includes(role.id) && !trendingRolesList.includes(role.name)
  );

  async function getJobCountForRole(roleName: string) {
    const { count } = await fetchJobs({
      query: roleName,
      location: "",
      company: "",
      remote: "",
      includeFulltime: "true",
      includeContractor: "true",
      speciality: "",
      page: 1,
      itemsPerPage: 1, // Fetch only count, not the full job list
      filter: "",
      tab: "lastest-jobs",
    });
    return count;
  }
  const trendingRolesWithCounts = await Promise.all(
    trendingRoles.map(async (role) => {
      const jobCount = await getJobCountForRole(role.name);
      return { ...role, jobCount };
    })
  );
  const otherRolesWithCounts = await Promise.all(
    otherRoles.map(async (role) => {
      const jobCount = await getJobCountForRole(role.name);
      return { ...role, jobCount };
    })
  );
  return (
    <>
      <head>
        <title>Microsoft Roles – Explore Career Paths and Certifications</title>
        <meta
          name="description"
          content="Find your ideal Microsoft role with relevant certifications and learning paths. Advance your career in Azure, Power BI, Dynamics, and more."
        />
      </head>
      <Hero
        title="Roles in Microsoft Technologies"
        subtitle="Level Up your skills. Get certified. Find relevant jobs."
        align="center"
        // titleStyles={{
        //   marginLeft: "30px",
        // }}
        // subtitleStyles={{
        //   marginLeft: "30px",
        // }}
        // backButtonStyles={{marginLeft:"20px"}}
      />
      <Container
        size="xl"
        className={`${SFProRounded.className} ${classes.container}`}
      >
        <Group align="center" justify="space-between" pb="lg">
          <Title
            order={1}
            fw={600}
            className={SFProRounded.className}
            style={{
              fontSize: "28.02px",
              fontWeight: 600,
              lineHeight: "44.2px",
              align: "left",
              color: "#000000",
            }}
          >
            Trending Roles
          </Title>
          <SearchRoleCategory />
        </Group>

        <main>
          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            verticalSpacing="lg"
            spacing="lg"
          >
            {trendingRolesWithCounts
              .filter((role) => !excludedRoles.includes(role.id))
              .filter(
                (role) =>
                  search === "" ||
                  roleCategories[role.id].toLowerCase() === search
              )
              .map(
                (role: {
                  id: keyof typeof roleCategories;
                  name: string;
                  jobCount: number;
                }) => {
                  const category = roleCategories[role.id] || "General";
                  const IconComponent =
                    categoryIcons[category as keyof typeof categoryIcons];
                  if (!IconComponent) return null;
                  return (
                    <RoleCard
                      key={role.id}
                      id={role.id}
                      title={role.name}
                      category={category}
                      count={totalCounts[role.id] || 0}
                      certificationsCount={totalCertifications[role.id] || 0}
                      IconComponent={IconComponent}
                      jobCount={role.jobCount}
                    />
                  );
                }
              )}
          </SimpleGrid>
          <Group align="center" justify="space-between" pb="lg" pt="xl">
            <Title
              order={1}
              fw={600}
              className={SFProRounded.className}
              style={{
                fontSize: "28.02px",
                fontWeight: 600,
                lineHeight: "44.2px",
                align: "left",
                color: "#000000",
              }}
            >
              All Other Roles
            </Title>
          </Group>

          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            verticalSpacing="lg"
            spacing="lg"
          >
            {otherRolesWithCounts
              .filter(
                (role) =>
                  search === "" ||
                  roleCategories[role.id].toLowerCase() === search
              )
              .map(
                (role: {
                  id: keyof typeof roleCategories;
                  name: string;
                  jobCount: number;
                }) => {
                  const category = roleCategories[role.id] || "General";
                  const IconComponent =
                    categoryIcons[category as keyof typeof categoryIcons];
                  if (!IconComponent) return null;
                  return (
                    <RoleCard
                      key={role.id}
                      id={role.id}
                      title={role.name}
                      category={category}
                      count={totalCounts[role.id] || 0}
                      IconComponent={IconComponent}
                      certificationsCount={totalCertifications[role.id] || 0}
                      jobCount={role.jobCount}
                    />
                  );
                }
              )}
          </SimpleGrid>
        </main>
      </Container>
    </>
  );
}
