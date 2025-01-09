// "use client"
import { Hero } from "@/components/Hero/Hero";
import SearchServiceCategory from "@/components/SearchServiceCategory";
import { ServiceCard } from "@/components/ServiceCard/ServiceCard";
import { createClient } from "@/utils/supabase/server";
import {
  Anchor,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { SFProRounded } from "../layout";
import classes from "./career.module.css";
import Head from "next/head";
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    careerServiceCategory?: string;
  };
}) {
  const supabase = createClient();

  const search = searchParams?.careerServiceCategory;
  const { data: services, error } = await supabase.from("services").select("*");

  if (error || !services) console.error(error);
  if (!services) return <div>No career services found.</div>;

  return (
    <>
      <head>
        <title>Professional Resources – Grow Your Career with HappyTechies</title>
        <meta
          name="description"
          content="Access a curated directory of resources to enhance your professional skills. Learn, grow, and succeed in the world of Microsoft technologies."
        />
      </head>
      <Hero
        title="Career Growth Resources"
        subtitle="We have created a list of helpful resources to empower you in growing your career"
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
        <main>
          <Group align="center" justify="space-between" pb="lg">
            <Title
              order={1}
              fw={600}
              className={SFProRounded.className}
              style={{
                fontSize: "26.96px",
                lineHeight: "44.2px",
                color: "#000000",
                marginBottom: "20px",
              }}
            >
              All services
            </Title>
            <SearchServiceCategory />
          </Group>

          <SimpleGrid
            cols={{ base: 1, md: 2, lg: 3 }}
            verticalSpacing="lg"
            spacing="lg"
          >
            {services
              .filter(
                (service) =>
                  !search ||
                  service.category.toLowerCase().trim() === search.toLowerCase()
              )
              .map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  category={service.category}
                  description={service.description}
                  image={service.image_url}
                  link={service.link}
                />
              ))}
          </SimpleGrid>

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
            className={SFProRounded.className}
          >
            Want to see your service listed here? Send us an email at{" "}
            <Anchor
              className={SFProRounded.className}
              href="mailto:info@happytechies.com"
            >
              info@happytechies.com
            </Anchor>
          </Text>
          <Text
            className={SFProRounded.className}
            style={{
              textAlign: "left",
              fontWeight: "500",
              color: "#727272",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "#000000" }}>Disclaimer: </strong> Happy
            Techies is not responsible for the creation, maintenance, or any
            communications entailed by the use of these services. These are
            curated career services that our team recommends for Microsoft
            technology experts who want to improve the effectiveness of their
            applications.
          </Text>
        </main>
      </Container>
    </>
  );
}
