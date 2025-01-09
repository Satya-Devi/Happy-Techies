// pages/page.tsx
import { Hero } from "@/components/Hero/Hero";
import GridComponent from "@/components/GridComponent/GridComponent";
import { Title } from "@mantine/core";
import Styles from "./about-us.module.css"

export default async function Page() {
  return (
    <>
       <Hero
        title="About us"
        subtitle=" Happy Techies is a dedicated online platform connecting Microsoft enthusiasts with exciting
        career opportunities. We are passionate about Microsoft Technologies and committed to helping you find your dream job."
        align="center"
        titleStyles={{
          marginLeft: "30px",
        }}
        subtitleStyles={{
          marginLeft: "30px",
        }}
        backButtonStyles={{marginLeft:"20px"}}
      />
      <GridComponent />
    </>
  );
}

