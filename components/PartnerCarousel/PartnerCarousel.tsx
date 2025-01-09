"use client";

import React, { useEffect } from "react";
import { Container, Text,Image, Box, Button} from "@mantine/core";
import classes from "./PartnerCarousel.module.css";
import Slider from "react-slick";
import partnerData from '@/partners.json';
import { SFProRounded } from "@/app/layout";
import { IconChevronRight } from "@tabler/icons-react";

const settings = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    variableWidth: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
  };

const PartnerCarousel =() => {
    const handleClick=()=>{
        window.location.href="/jobs";
    }
    return (
        <Container className={classes.container} fluid>
            <Text className={classes.text1 + " " + SFProRounded.className}>
                At our core, we're all about Microsoft technology.
            </Text>
            <Text component="h1" className={classes.text2 + " " + SFProRounded.className}>
            A job platform <strong color="#000000">by and for </strong>Microsoft technology professionals.
            </Text>
            <Text component="h2" className={classes.text3}>
            We understand the struggle of the job hunt because <strong style={{color:"#000000"}}>we've been there</strong>. From startups to tech giants, we built a platform built with the jobs you wish you'd see on other job boards.
            </Text>
            <Container  fluid mt={'4rem'}>
                <Slider {...settings}>
                    {partnerData.filter((partner:any)=>partner?.content?.logo?.filename).map((partner:any,index) => (
                        <Box p={2} key={index} style={{justifyContent:'center',alignItems:'center',pointerEvents:'none'}} mx={15} w={120} h={90}>
                        <Image className={classes.partner_image} src={partner?.content?.logo?.filename} alt={partner.name} />
                        </Box>
                    ))}
                </Slider>
            </Container>

            <Button onClick={handleClick} className={classes.button}>
               Explore curated jobs <IconChevronRight/>
            </Button>
        </Container>
    )
}

export default PartnerCarousel;