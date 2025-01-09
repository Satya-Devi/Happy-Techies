import { BlogContainer } from "@/components/BlogContainer/BlogContainer";
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
import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import classes from './perspectives.module.css'
import BlogCard from "@/components/BlogCard/BlogCard";

const fetchPost = async (slug: string) => {
  const client = getStoryblokApi();
  const response = await client.get(`cdn/stories/articles/${slug}`, {
    version: "published",
  });

  const recommended_response = await client.get("cdn/stories/", {
    starts_with: "articles/",
    excluding_slugs: "articles/" + response.data.story.slug,
    filter_query: {
      category: { in: response.data.story.content.category },
      published_at: { not_in: null },
    },
    per_page: 5,
  });

  return {
    story: response.data.story,
    recommendations: recommended_response.data.stories,
  };
};

export default async function Page({ params }: { params: { slug: string } }) {
  const { story, recommendations } = await fetchPost(params.slug);

  return (
    <>
    <head>
        <title>{story.content.title}</title>
        <meta name="description" content={story.content.description} />
      </head>
      <Hero
        title={story.content.title}
        subtitle="Perspectives"
        align="center"
      />
      <Container size="xl">
        <BlogContainer>
          <StoryblokStory story={story} />
        </BlogContainer>
      </Container>
      <Container mt={50}>
        {recommendations.length ? (
          <>
            <Title ta="left" order={1} pb="md">
              Similar Perspectives
            </Title>
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              verticalSpacing="lg"
              spacing="lg"
            >
              {recommendations.map((post: any) => (
          //       <Card
          //         padding="lg"
          //         radius="md"
          //         key={post.id}
          //         withBorder
          //         component="a"
          //         href={`/perspectives/${post.slug}`}
          //         className={classes.container}
          //       >
          //         <CardSection>
          //           <Image
          //             src={post.content.image.filename}
          //             height={240}
          //             alt="Image"
          //             loading="lazy"
          //           />
          //         </CardSection>

          //         <Text
          //           c="dimmed"
          //           size="xs"
          //           tt="uppercase"
          //           fw={600}
          //           mt="md"
          //           mb="xs"
          //           style={{ letterSpacing: "-0.03em" }}
          //         >
          //           {new Date(post.created_at).toLocaleDateString("en-US", {
          //             weekday: "short", // "Mon" through "Sun"
          //             year: "numeric", // Numeric year
          //             month: "short", // "Jan" through "Dec"
          //             day: "numeric", // Numeric day
          //           })}
          //         </Text>

          //         <Group justify="space-between" mb="xs">
          //           <Title order={3} fw={600}>
          //             {post.content.title}
          //           </Title>
          //         </Group>

          //         <Text size="sm" lineClamp={3}>
          //           {post.content.description}
          //         </Text>

          //         <Link
          //    href={`/perspectives/${post.slug}`}
          //    style={{ textDecoration: "none" }}
          //  >
          //    <Text
          //      mt="xs"
          //      size="sm"
          //      c="#004a93"
          //      style={{ letterSpacing: "-0.05em" }}
          //    >
          //      Read more
          //    </Text>
          //  </Link>
          //       </Card>
                <BlogCard key={post.slug} post={post}/>
              ))}
            </SimpleGrid>
          </>
        ) : null}
      </Container>
    </>
  );
}
