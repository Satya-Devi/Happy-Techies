import DedicationSection from "@/components/DedicationSection/DedicationSection";
import ExploreSolutionAreas from "@/components/ExploreSolutionAreas/ExploreSolutionAreas";
import { Hero } from "@/components/Hero/Hero";
import JobHero from "@/components/JobHero/JobHero";
import NewsSection from "@/components/NewsSection/NewsSection";
import PartnerCarousel from "@/components/PartnerCarousel/PartnerCarousel";
import SucceedSection from "@/components/SucceedSection/SucceedSection";
import Testimonials from "@/components/Testimonials/Testimonials";
import { createClient } from "@/utils/supabase/server";
import Head from "next/head";

export default async function Landing() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <head>
        <title>
          HappyTechies – Your Gateway to Microsoft Tech Careers
        </title>
        <meta
          name="description"
          content="HappyTechies connects tech talent with Microsoft job opportunities. Explore top careers in Microsoft technologies. Start your journey today!"
        />
      </head>
      <Hero
        title="Explore all job openings"
        subtitle="Home"
        align="center"
        isHome
      />
      <JobHero/>
      <Testimonials />
      <ExploreSolutionAreas userId={user?.id}/>
      <PartnerCarousel />
      <NewsSection />
      <DedicationSection />
      <SucceedSection />
    </>
  );
}
