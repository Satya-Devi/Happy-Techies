import { Hero } from "@/components/Hero/Hero";
import SearchBlogs from "@/components/SearchBlogs/SearchBlogs";
import {
  Card,
  CardSection,
  Group,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { fetchPosts } from "../actions";
import { author } from "../layout";
import Search from "@/components/Search";
import BlogCard from "@/components/BlogCard/BlogCard";
import { SFProRounded } from "../layout";
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";
import localFont from "next/font/local";
("../");

export const dynamic = "force-dynamic";

const myFont = localFont({
  src: "../../public/fonts/SF-Pro-Rounded-Regular.otf",
});

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    blogs?: string;
    query?: string;
  };
}) {
  const posts = await fetchPosts();

  let filteredPosts = searchParams?.blogs
    ? posts.filter(
        (post) =>
          post.content.category && post.content.category === searchParams.blogs
      )
    : posts;

  filteredPosts = searchParams?.query
    ? filteredPosts.filter(
        (post) =>
          post.content.title
            .toLowerCase()
            .includes(searchParams.query?.toLowerCase()) ||
          post.content.description
            .toLowerCase()
            .includes(searchParams.query?.toLowerCase())
      )
    : filteredPosts;

  //const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts;

  return (
    <>
      <head>
        <title>Perspectives – Career Insights and Microsoft Tech Trends</title>
        <meta name="description" content="Dive into expert insights, career tips, and the latest trends in Microsoft technologies. Stay ahead with curated content from HappyTechies." />
      </head>
      <div className={SFProRounded.className}>
        <Hero
          title="Perspectives "
          subtitle="Expert Perspectives on Thriving in the Microsoft Technology Ecosystem"
          align="center"
          //   titleStyles={{
          //   marginLeft: "30px",
          // }}
          // subtitleStyles={{
          //   marginLeft: "30px",
          // }}
          // backButtonStyles={{marginLeft:"20px"}}
        />
        <Stack>
          <Group>
            {/* <Title
            order={2}
            fw={600}
            style={{
              // fontFamily: "Inter",
              // fontFamily: "Author-Variable.ttf",
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "38.4px",
              color: "#14142B",
              top: "362px",
              marginLeft: "48px",
            }}
            className={SFProRounded.className}
          >
            All Blogs
          </Title> */}
            <div
              style={{
                width: "506.48px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                borderRadius: "2px",
                marginLeft: "30px",
              }}
            >
              <Search placeholder="Search" />
            </div>
          </Group>

          {/* <SearchBlogs /> */}
          {otherPosts.length === 0 ? (
            <Title size="22px" ta={"center"} w={"100%"} my={"100px"}>
              No Blogs Found
            </Title>
          ) : null}
          <SimpleGrid
            cols={{ base: 1, md: 2 }}
            mt={20}
            spacing="16px"
            p={{ base: "0px 10px", md: "0px 32px" }}
          >
            {otherPosts.map((post: any) => (
              <>
                <BlogCard key={post.slug} post={post} />
                {/*<Card
                radius="md"
                withBorder
                style={{
                  width: "100%",
                  height: "213px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <CardSection
                  style={{ width: "25%", height: "155px", margin: "10px" }}
                >
                  {" "}
                  <Image
                    src={post.content.image.filename}
                    height="100%"
                    width="100%"
                    style={{ objectFit: "cover" }}
                  />
                </CardSection>

                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px",
                    marginLeft: "10px",
                  }}
                >
                   <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px", 
                    cursor: "pointer",
                  }}
                  // onClick={() => {}} 
                >
                  <span
                    style={{
                      display: "block",
                      height: "4px",
                      width: "4px",
                      backgroundColor: "#757575",
                      borderRadius: "50%",
                      margin: "2px",
                    }}
                  ></span>
                  <span
                    style={{
                      display: "block",
                      height: "4px",
                      width: "4px",
                      backgroundColor: "#757575",
                      borderRadius: "50%",
                      margin: "2px",
                    }}
                  ></span>
                  <span
                    style={{
                      display: "block",
                      height: "4px",
                      width: "4px",
                      backgroundColor: "#757575",
                      borderRadius: "50%",
                      margin: "2px",
                    }}
                  ></span>
                </div> 

                  <Group justify="space-between">
                    <Title
                      order={3}
                      fw={600}
                      className={SFProRounded.className}
                      style={{ marginBottom: "0px", marginTop: "-24px" }}
                    >
                      {post.content.title}
                    </Title>
                  </Group>

                  <Text size="sm" lineClamp={3}>
                    {post.content.description}
                  </Text>

                  <Link
                    href={`/perspectives/${post.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Text
                      mt="xs"
                      size="sm"
                      c="#004a93"
                      style={{ letterSpacing: "-0.05em" }}
                    >
                      Read more
                    </Text>
                  </Link>

                  <Text
                    c="dimmed"
                    size="xs"
                    tt="uppercase"
                    fw={600}
                    style={{ marginTop: "16px" }}
                  >
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </div>
              </Card>*/}
              </>
            ))}
          </SimpleGrid>
        </Stack>
      </div>
    </>
  );
}

function FeaturedPost({ post }: { post: any }) {
  return (
    <Card
      padding="lg"
      radius="md"
      key={post.id}
      style={{ height: "100%" }}
      withBorder
    >
      <CardSection>
        <Image src={post.content.image.filename} height={240} alt="Image" />
      </CardSection>

      <Text
        c="dimmed"
        size="xs"
        tt="uppercase"
        fw={600}
        mt="md"
        mb="xs"
        style={{ letterSpacing: "-0.03em" }}
      >
        {new Date(post.created_at).toLocaleDateString("en-US", {
          weekday: "short", // "Mon" through "Sun"
          year: "numeric", // Numeric year
          month: "short", // "Jan" through "Dec"
          day: "numeric", // Numeric day
        })}
      </Text>

      <Group justify="space-between" mb="xs">
        <Title order={1} fw={600} className={SFProRounded.className}>
          {post.content.title}
        </Title>
      </Group>

      <Text size="sm" lineClamp={3}>
        {post.content.description}
      </Text>

      <Link href={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
        <Text
          mt="xs"
          size="sm"
          c="#004a93"
          style={{ letterSpacing: "-0.05em" }}
        >
          Read more
        </Text>
      </Link>
    </Card>
  );
}
