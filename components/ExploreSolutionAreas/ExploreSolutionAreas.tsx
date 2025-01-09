"use client";

import { SFProRounded } from "@/app/layout";
import { Button, Container, Grid, GridCol, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./ExploreSolutionAreas.module.css";
import JobRoleCard from "../JobRoleCard/JobRoleCard";
import { useEffect, useRef, useState } from "react";
import JobCardSmall from "../JobCardSmall/JobCardSmall";
import Slider from "react-slick";
import { fetchJobsByKeywords } from "@/app/actions";
import StaticJobs from "@/static-jobs.json";
import CustomSliderDots from "../CustomSliderDots/CustomSliderDots";

const roles = [
  {
    role: "Data & AI",
    rotate: 9,
    circleImg: "/images/job-role-card/circle-1.png",
  },
  {
    role: "Security",
    rotate: -9,
    circleImg: "/images/job-role-card/circle-2.png",
  },
  {
    role: "Modern Workplace and Surface",
    rotate: 6,
    circleImg: "/images/job-role-card/circle-3.png",
  },
  {
    role: "Infrastructure",
    rotate: -9,
    circleImg: "/images/job-role-card/circle-4.png",
  },
  {
    role: "Business Applications",
    rotate: 6,
    circleImg: "/images/job-role-card/circle-5.png",
  },
  {
    role: "Digital & Application Innovation",
    rotate: -15,
    circleImg: "/images/job-role-card/circle-6.png",
  },
];

type Props = {
  userId?: string;
};
export default function ExploreSolutionAreas({ userId }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const icon = <IconChevronRight size={14} />;
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const [jobs, setJobs] = useState<any>(StaticJobs);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  useEffect(() => {
    fetchJobsByKeywords().then((jobs) => {
      if (jobs) {
        setJobs(jobs);
      }
    });
  }, []);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    sliderRef?.current?.slickGoTo(index); // Navigate the slider to the selected index
  };

  // console.log(jobs, "jobsconsole")

  const handleClick = () => {
    window.location.href = "/jobs?query=" + roles[activeIndex].role;
  };
  return (
    <Container
      fluid
      mt="xl"
      className={classes.container}
      bg="linear-gradient(180deg, #0281FF 0%, #3BADFF 100%),radial-gradient(50.76% 134.05% at 50% 100%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)"
      style={{
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        backgroundBlendMode: "linear-dodge, normal",
      }}
    >
      <Title
        ta="center"
        c="white"
        className={SFProRounded.className + " " + classes.title}
      >
        Explore by top solution areas
      </Title>

      <Button color="#004a93" mt={"md"} rightSection={icon} radius="md">
        Explore Jobs By Solution Areas
      </Button>

      <Grid justify="center" align="center" className={classes.card_wrapper}>
        {roles.map((role, index) => (
          <JobRoleCard
            key={role.role}
            circleImg={role.circleImg}
            active={index == activeIndex}
            role={role.role}
            rotate={role.rotate}
            onClick={() => {
              setActiveIndex(index)
              sliderRef?.current?.slickGoTo(index);
            }}
          />
        ))}
      </Grid>

      <Grid py={30} display={{ sm: "none", xs: "block" }} mx={12} mt={15}>
        {roles.map((role, index) => (
          <GridCol key={index} pb={index < 3 ? 35 : 5} span={{ base: 4 }}>
            <JobRoleCard
              key={role.role}
              circleImg={role.circleImg}
              active={index == activeIndex}
              role={role.role}
              rotate={role.rotate}
              onClick={() => {
                setActiveIndex(index)
                sliderRef?.current?.slickGoTo(index);
              }}
            />
          </GridCol>
        ))}
      </Grid>
      <CustomSliderDots
        totalSlides={roles.length}
        currentIndex={activeIndex}
        onDotClick={handleDotClick}
      />
      <Title
        ta="center"
        c="white"
        my={5}
        className={SFProRounded.className + " " + classes.title}
      >
        Hot Jobs
      </Title>
      <Container mt="2rem" p={0} fluid>
        <Slider
          // dots={true}
          ref={sliderRef}
          infinite={true}
          speed={1000}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={4000}
          pauseOnHover={true}
          arrows={false}
          afterChange={(index) => setActiveIndex(index)}
          
        >
          {roles.map((role,index) => (
            <Grid key={index}>
              {jobs[role.role]?.map((job:any)=>(
                <GridCol key={job.id} span={{md:6,xs:12}}>
                <JobCardSmall userId={userId} job={job}/>
              </GridCol>
              ))}
          </Grid>
          ))}
        </Slider>
      </Container>
      <Button
        onClick={handleClick}
        miw={"max-content"}
        color="#004a93"
        fs="1rem"
        py="0.5rem"
        px="1rem"
        mb={"2.53rem"}
        maw={"22.5rem"}
        mt="2rem"
        w={"30%"}
        radius="md"
      >
        See All {roles[activeIndex].role} Jobs
        <IconChevronRight />
      </Button>
    </Container>
  );
}
