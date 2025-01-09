"use client";

import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Button, Container, InputLabel } from "@mantine/core";
import classes from "./HeroAnimatedSearch.module.css";
import { IconSearch } from "@tabler/icons-react";
import Slider from "react-slick";
import { useMediaQuery } from "@mantine/hooks";
import FilterData from "@/utils/constants/FilterData";
import { fetchTopRoles } from "@/app/actions";
import Fuse from 'fuse.js';
// const options = [
//   "Looking for Azure Data Engineer Jobs in Houston",
//   "Looking for Azure AI Engineer jobs in frankfurt",
//   "Looking for Azure Security Engineer jobs in nashville",
//   "Looking for M365 Architect jobs in highland park",
//   "Looking for Power Apps Developer jobs in greensboro",
//   "Looking for Azure Data Scientist jobs in north chicago",
//   "Looking for Azure Administrator jobs in Indianapolis",
//   "Looking for Python jobs in New York",
// ];

const options=FilterData.keywords;
const sliderSettings = {
  dots: false,
  pauseOnHover: true,
  arrows: false,
  autoplaySpeed: 3000,
  focusOnSelect: true,
  autoplay: true,
  vertical: true,
};
const HeroAnimatedSearch = () => {
  const [value, setValue] = useState<string>("");
  const [focus, setFocus] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [keywords, setKeywords] = useState(FilterData.keywords);
  useEffect(() => {
    fetchTopRoles()
    .then((res) => {
      if(res?.length)setKeywords(res);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const fuse=useMemo(()=>{
    return new Fuse(keywords, {
      includeScore: true,
      threshold: 0.4,  // Adjust this to match misspelled terms better
    });
  },[keywords])
  
  const handleSearch = () => {
    window.location.href = `/jobs?query=${value}&tab=all-jobs`;
  };

  const SearchButton = () => (
    <Button onClick={handleSearch} className={classes.search}>
      <IconSearch color="#fff" size={isMobile ? 20 : 30} />
    </Button>
  );

  return (
    <Container className={classes.input_container}>
      <InputLabel
        style={{ display: focus || value ? "none" : "inline" }}
        className={classes.animated_label}
      >
        <Slider {...sliderSettings}>
          {keywords.map((option, i) => (
            <span key={i}>{option}</span>
          ))}
        </Slider>
      </InputLabel>
      <Autocomplete
       data={keywords}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            handleSearch();
          }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={value}
        onChange={(value) => setValue(value)}
        leftSection={
          !focus && !value ? (
            <IconSearch
              className={classes.search_icon}
              color="#6F7071"
              size={isMobile ? 20 : 30}
            />
          ) : null
        }
        rightSection={focus || value ? SearchButton() : null}
        rightSectionWidth={"max-content"}
        classNames={{
          input: `${classes.input} ${
            focus || value ? classes.remove_left_padding : ""
          }`,
          root: classes.input_wrapper,
        }}
      />
    </Container>
  );
};
export default HeroAnimatedSearch;
