import { Hero } from "@/components/Hero/Hero";
import { PartnerCard } from "@/components/PartnerCard/PartnerCard";
import SearchPartner from "@/components/SearchPartner";
import {
  Anchor,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { fetchPartners } from "../actions";
import { SFProRounded } from "../layout";
import classes from "./partner.module.css";
import PaginatedSearch from "@/components/PaginatedSearch";
import Head from "next/head";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    partner?: string;
    page?: string;
    count?: string;
  };
}) {
  const searchParamsKey = searchParams?.partner;
  const { partners, total, perPage } = await fetchPartners(
    searchParams?.page,
    searchParams?.count,
    searchParamsKey
  );

  let filteredPartners = searchParamsKey
    ? partners.filter((partner) =>
        partner.name.toLowerCase().includes(searchParamsKey)
      )
    : partners;

  if (filteredPartners.length === 0) {
    filteredPartners = partners;
  }

  return (
    <>
      <head>
        <title>Explore Microsoft Partners</title>
        <meta
          name="description"
          content="Discover Microsoft Partner companies and their job openings. Connect with leading organizations and find your next career move with HappyTechies."
        />
      </head>
      <div className={SFProRounded.className}>
        <Hero
          title="Microsoft's Trusted Partners"
          subtitle="Learn about the top employers and explore associated jobs"
          titleStyles={{
            marginLeft: "10px",
          }}
          subtitleStyles={{
            marginLeft: "10px",
          }}
          align="center"
          backButtonStyles={{ marginLeft: "5px" }}
        />
        <Container size="xl" style={{ marginLeft: "10px" }}>
          <main>
            <Group align="center" justify="space-between" pb="lg">
              <SearchPartner placeholder="Search by name" />
            </Group>

            <SimpleGrid
              cols={{ base: 1, md: 2, lg: 3 }}
              verticalSpacing="lg"
              spacing="lg"
            >
              {filteredPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  slug={partner.slug}
                  name={partner.name}
                  brief={partner.content.brief}
                  logo={partner.content.logo?.filename}
                  location={partner.content.location}
                  employees={partner.content.employees}
                  awards_2024={partner.content.awards_2024}
                  awards_2023={partner.content.awards_2023}
                  awards_2022={partner.content.awards_2022}
                  specializations={partner.content.specializations}
                />
              ))}
            </SimpleGrid>
            <PaginatedSearch
              total={total}
              itemsPerPage={perPage}
              countOptions={["15", "30", "60"]}
              showJobsText={false}
            />
            <Text
              size="md"
              ta="center"
              fw={500}
              style={{
                backgroundColor: "var(--mantine-color-blue-0)",
                padding: "1rem",
                borderRadius: "var(--mantine-radius-md)",
                width: "fit-content",
                margin: "0 auto",
                marginTop: "2rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
              }}
            >
              Want to be listed here? Send us an email at{" "}
              <Anchor href="mailto:info@happytechies.com">
                info@happytechies.com
              </Anchor>
            </Text>
          </main>
        </Container>
      </div>
    </>
  );
}
