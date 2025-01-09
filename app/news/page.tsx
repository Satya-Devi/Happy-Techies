import { Hero } from "@/components/Hero/Hero";
import {
  Card,
  CardSection,
  Container,
  Group,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import Head from "next/head";
import { fetchNews } from "../actions";
import { SFProRounded } from "../layout";
import classes from "./news.module.css";
import staticNewsData from '@/news.json'; 

export default async function Page() {
  let { data: news } = await fetchNews();

  if(!news) {
    news = staticNewsData;
  }
  
  const sortedNews = news?.sort(
    (a: any, b: any) =>
      new Date(b.published_datetime_utc).getTime() -
      new Date(a.published_datetime_utc).getTime()
  );

  if (!sortedNews) {
    return <p>News not found.</p>;
  }

  return (
    <>
      <head>
        <title>Microsoft Tech News</title>
        <meta name="description" content="Get the latest updates and news from the world of Microsoft. Explore key developments, product launches, and tech advancements." />
      </head>
      <Hero
        title="Stay Ahead of the curve"
        subtitle="Microsoft Technologies News"
        // titleStyles={{
        //   marginLeft: "30px",
        // }}
        // subtitleStyles={{
        //   marginLeft: "30px",
        // }}
        align="center"
        // backButtonStyles={{marginLeft:"20px"}}
      />
      <Container
        size="xl"
        className={`${SFProRounded.className} ${classes.container}`}
      >
        <main>
          <Title order={1} fw={600} className={SFProRounded.className} pb="lg">
            What's Happening
          </Title>

          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            verticalSpacing="lg"
            spacing="lg"
          >
            {sortedNews
              .filter((post: any) => post.photo_url && post.link)
              .map((post: any) => (
                <Card padding="lg" radius="md" key={post.title} withBorder>
                  <Link
                    href={post.link}
                    style={{ textDecoration: "none" }}
                    target="_blank"
                  >
                    <CardSection>
                      <Image
                        src={post.photo_url}
                        height={240}
                        alt={post.source_name}
                        loading="lazy"
                        fit="cover"
                      />
                    </CardSection>

                    <Text
                      c="dimmed"
                      size="xs"
                      tt="uppercase"
                      fw={600}
                      mt="md"
                      mb="xs"
                      className={SFProRounded.className}
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      {new Date(post.published_datetime_utc).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short", // "Mon" through "Sun"
                          year: "numeric", // Numeric year
                          month: "short", // "Jan" through "Dec"
                          day: "numeric", // Numeric day
                        }
                      )}
                    </Text>

                    <Group justify="space-between" mb="xs">
                      <Title
                        order={3}
                        fw={600}
                        c="dark"
                        className={SFProRounded.className}
                      >
                        {post.title}
                      </Title>
                    </Group>

                    {/*                   
                    <Text
                      mt="xs"
                      size="sm"
                      c="#004a93"
                      style={{ letterSpacing: "-0.05em" }}
                      className={SFProRounded.className}
                    >
                      Read more
                    </Text> */}
                  </Link>
                </Card>
              ))}
          </SimpleGrid>
        </main>
      </Container>
    </>
  );
}
