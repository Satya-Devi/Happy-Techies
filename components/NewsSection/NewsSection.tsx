"use client";
import { Container,Box, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import NewsCard from "../NewsCard/NewsCard";
import Slider from "react-slick";
import { SFProRounded } from "@/app/layout";
import { useEffect, useState } from "react";
import { fetchTopNews } from "@/app/actions";
import newsData from "@/static-news.json";
 
const settings = {
  dots: true,
  infinite: true,
  arrows:false,
  swipeToSlide: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  autoplay:true,
  responsive: [
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};
 
const NewsSection = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
   const [news,setNews]=useState(newsData);
 
    useEffect(() => {
        fetchTopNews().then((res) => { setNews(res.data) } )
        .catch((err) => { console.log(err) });
    }, []);
    return (
        <Container
            fluid
            mt="4.5rem"
            mx={{xs:"xs",md:"xl"}}
            bg="linear-gradient(180deg, #0281FF 0%, #3BADFF 100%),radial-gradient(50.76% 134.05% at 50% 100%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)"
            // p={{xs:"80px 80px 80px 80px",md:"2.5rem 100px"}}
            p={isMobile ? "30px 22px 40px 22px" : "2.5rem 30px"}
            style={{
                borderRadius: "10px",
                overflow: "hidden",
                backgroundBlendMode: "linear-dodge, normal",
            }}
        >
            <Title
              ta='center'
              c='white'
              fs='40px'
              mb='2rem'
              className={SFProRounded.className}
            >
                Latest Microsoft Technology News
            </Title>
            <Box maw={1200} mx='auto'>
            <Slider  {...settings}>
               {news && news.map((item:any,index)=>(
                 <NewsCard
                  key={index}
                  title={item?.title}
                  description={item?.snippet}
                  image={item?.photo_url}
                  url={item?.link}
                  published_datetime_utc={item?.published_datetime_utc}
                />
               ))}
            </Slider>
            </Box>
        </Container>
    )
}
 
export default NewsSection;