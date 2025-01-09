import ChatHero from "@/components/ChatHero/ChatHero";
import DedicationSection from "@/components/DedicationSection/DedicationSection";
import ExploreSolutionAreas from "@/components/ExploreSolutionAreas/ExploreSolutionAreas";
import { Hero } from "@/components/Hero/Hero";
import PartnerRescueSection from "@/components/PartnerRescueSection/PartnerRescueSection";
import SucceedSection from "@/components/SucceedSection/SucceedSection";
import Testimonials from "@/components/Testimonials/Testimonials";

export default async function Page() {
  return (
    <>
      <Hero
        title="Explore all job openings"
        subtitle="Home"
        align="center"
        isHome
      />
      <ChatHero />
      <Testimonials />
      <ExploreSolutionAreas />
      <DedicationSection />
      <PartnerRescueSection />
      <SucceedSection />
    </>
  );
}
