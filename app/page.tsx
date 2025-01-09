import { Waitlist } from "@/components/Waitlist/Waitlist";
import { Container } from "@mantine/core";
import Landing from "@/app/_landing/page";

export default async function Index() {
  return (
    <>
      {/* <Hero
        title="Explore all job openings"
        subtitle="Home"
        align="center"
        isHome
      /> */}
      {/* <ChatHero /> */}
      {/* <Container size="xl">
        <main>
          <Waitlist />
        </main>
      </Container> */}
      <Landing />
    </>
  );
}
