import React, { useEffect } from "react";
import Slider from "react-slick";
import { Box, Image } from "@mantine/core";


export const CrossfadeCarousel = () => {
  const [images,setImages] = React.useState(['/images/hero/1-light.jpg']);
  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    width: '100%',
  };

  useEffect(() => {
    const handleLoadEvent = () => {
      setImages([
        '/images/hero/2.jpg',
        '/images/hero/4.jpg',
        '/images/hero/5.jpg',
        '/images/hero/6.jpg',
      ]);
    };
     if (document.readyState === 'complete') {
      handleLoadEvent();
    } else {
      window.addEventListener('load', handleLoadEvent);
    }
    return () => {
      window.removeEventListener('load', handleLoadEvent);
    };
  }, [])
  return (
    <Slider className=""  {...settings}>
      {images.map((image, index) => (
        <Box key={index} >
          <Image radius='md' style={{ filter: "brightness(0.8)" }} width='100%' key={index} src={image} alt="Tech professionals exploring Microsoft job opportunities on HappyTechies platform."/>
        </Box>
      ))}
    </Slider>
  );
}

