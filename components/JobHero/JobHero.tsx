"use client"
import { useMediaQuery } from "@mantine/hooks";
import {
    Container,
    Grid,
    GridCol,
    Stack,
    Title,
    Image
  } from "@mantine/core";
import classes from "./JobHero.module.css";
import { CrossfadeCarousel } from "../Carousel";
import HeroAnimatedSearch from "@/components/HeroAnimatedSearch/HeroAnimatedSearch";
import { SFProRounded } from "@/app/layout";

const JobHero = ()=>{
    const isMobile = useMediaQuery("(max-width: 576px)",true,{
        getInitialValueInEffect: true,
      });
    return(
        <div
        //   fluid
          className={classes.container}
        >
            <Grid py="xl" align="center" justify="space-around">
                <GridCol span={{ base: 12, md: 6 }} px={isMobile ? "xs" : "xl"}>
                    <Stack justify="center">
                        <Title
                            ta={isMobile ? "center" : "left"}
                            className={classes.title + " " + SFProRounded.className}
                        >
                            The only job platform for <br /> Microsoft technologies
                        </Title>
                        <Title
                            order={2}
                            c="#004a93"
                            ta={isMobile ? "center" : "left"}
                            className={SFProRounded.className +" "+ classes.about}
                            // style={{ fontSize: isMobile ? "16px" : "48px" , fontWeight: "700"}}
                        >
                            Learn. Connect. Grow.
                        </Title>
                        <HeroAnimatedSearch/>
                    </Stack>
                </GridCol>
                <GridCol span={{ base: 12, md: 6 }} mt={isMobile?"xs":""} px={isMobile ? "xl" : "xl"}>
                    <Stack justify="center">
                        <CrossfadeCarousel/>
                    </Stack>
                </GridCol>
            </Grid>
        </div>
    )
}

export default JobHero;