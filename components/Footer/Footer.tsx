"use client";
import React, { useState, useEffect } from "react";
import { Container, Group, Stack, Text } from "@mantine/core";
import Image from "next/image";
import { IconMail, IconMapPin } from "@tabler/icons-react";
import classes from "./Footer.module.css";
import Link from "next/link";
import { SFProRounded } from "@/app/layout";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <footer className={`${classes.footer} ${SFProRounded.className}`}>
      <Container className={classes.wrapper}>
        {/* Section 1: Logo and Social Icons */}
        <div className={classes.happyTechies}>
          <Image src="/images/logo.png" alt="logo" width={130} height={45} />
          <Group style={{display:'flex',justifyContent:'space-evenly'}} className={classes.socialIcons}>
            {/* <Link href="/random-facebook" className={classes.socialLink}>
              <img
                src="/images/facebook-icon.png"
                alt="Facebook"
                width={32}
                height={32}
                className={classes.socialIcon}
              />
            </Link> */}
            <Link href="https://x.com/BeAHappyTechie" target="_blank" className={classes.socialLink} title="Stay Updated with Happy Techies on Twitter">
              <img
                src="/images/twitter-icon.png"
                alt="Twitter"
                height={32}
                className={classes.socialIcon}
              />
            </Link>
            {/* <Link href="/random-instagram" className={classes.socialLink}>
              <img
                src="/images/instagram-icon.png"
                alt="Instagram"
                width={32}
                height={32}
                className={classes.socialIcon}
              />
            </Link> */}
            <Link href="https://www.linkedin.com/company/happy-techies/" target="_blank" className={classes.socialLink} title="Connect with Happy Techies on LinkedIn">
              <img
                src="/images/linkedin-icon.png"
                alt="LinkedIn"
                height={32}
                className={classes.socialIcon}
              />
            </Link>
            <Link href="https://www.youtube.com/@HappyTechiesMedia" style={{marginLeft:-5}} target="_blank" className={classes.socialLink} title="Subscribe to Happy Techies on YouTube">
              <img
                src="/images/youtube-icon.png"
                alt="YouTube"
                height={32}
                className={classes.socialIcon}
              />
            </Link>
          </Group>
        </div>

        {/* Section 2: Links Group */}
        <div className={classes.menuGroup}>
          <div className={classes.rowGroup}>
            <Stack className={classes.column}>
              <Text className={classes.heading}>Jobs</Text>
              <Link
                href="/jobs?speciality=Power+BI&tab=latest-jobs"
                className={classes.link}
                title="Latest Power BI Jobs"
              >
                Latest Power BI Jobs
              </Link>
              <Link
                href="/jobs?speciality=Fabric&tab=latest-jobs"
                className={classes.link}
                title="Microsoft Fabric Jobs"
              >
                Microsoft Fabric Jobs
              </Link>
              <Link href="/jobs?speciality=Copilot&tab=latest-jobs" className={classes.link} title="Copilot Jobs">
                Copilot Jobs
              </Link>
              <Link
                href="/jobs?speciality=M365&tab=latest-jobs"
                className={classes.link}
                title="M365 and Teams Jobs"
              >
                M365 and Teams Jobs
              </Link>
              <Link
                href="/jobs?speciality=Cloud+Solution+Architect&tab=latest-jobs"
                className={classes.link}
                title="Cloud Solution Architect Jobs"
              >
                Cloud Solution Architect Jobs
              </Link>
              <Link
                href="/jobs?speciality=Azure+Data+Engineer&tab=latest-jobs"
                className={classes.link}
                title="Azure Data Engineer Jobs"
              >
                Azure Data Engineer Jobs
              </Link>
            </Stack>

            <Stack className={classes.column}>
              <Text className={classes.heading}>Resources</Text>
              <Link href="/news" className={classes.link} title="Microsoft News">
                Microsoft News
              </Link>
              <Link href="/perspectives" className={classes.link} title="Perspectives">
                Perspectives
              </Link>
              <Link href="/partners" className={classes.link} title="Microsoft Partners">
                Microsoft Partners
              </Link>
              <Link
                href="/career-services?careerServiceCategory=interview"
                className={classes.link}
                title="Interview Preparation"
              >
                Interview Preparation
              </Link>
              <Link
                href="/career-services?careerServiceCategory=resume"
                className={classes.link}
                title="Resume Coaching and Review"
              >
                Resume Coaching and Review
              </Link>
            </Stack>
          </div>

          <div className={classes.rowGroup}>
            <Stack className={classes.column}>
              <Text className={classes.heading}>Company</Text>
              <Link href="/about-us" className={classes.link} title="About us" content="Happy Techies is a dedicated online platform connecting Microsoft enthusiasts with exciting career opportunities. We are passionate about Microsoft Technologies and committed to helping you find your dream job.">
                About us
              </Link>
              <Link href="/contact-us" className={classes.link} title="Contact us">
                Contact us
              </Link>
            </Stack>

            <Stack className={classes.column}>
              <Text className={classes.heading}>Contact us</Text>
              <div className={classes.contactInfo}>
                <IconMail size={20} />
                <a href="mailto:info@happytechies.com" className={classes.link}>
                  info@happytechies.com
                </a>
              </div>
              <div className={classes.contactInfo}>
                <IconMapPin size={20} />
                <Text style={{ color: "#727272" }}>Dallas, TX</Text>
              </div>
            </Stack>
          </div>
        </div>

        {/* Section 3: Divider Line */}
        <div className={classes.dividerLine} />

        {/* Section 4: Copyright */}
        <div className={classes.copyrightWrapper}>
          <Text className={classes.copyright}>
            Copyright © 2024 Happy Techies
          </Text>
          {/* <Group className={classes.copyrightBlock}>
            <Text className={classes.copyright}>All Rights Reserved</Text>
            <span className={classes.separator}>|</span>
            <div className={classes.linkRow}>
              <Link href="/privacy-policy" className={classes.bluelink}>
                Privacy Policy |
              </Link>
              <Link href="/terms-of-service" className={classes.bluelink}>
                Terms of Service
              </Link>
            </div>
          </Group> */}
          <Group className={classes.copyrightBlock}>
            <Text className={classes.copyright}>All Rights Reserved</Text>
            <span className={classes.separator}>|</span>
            <div className={classes.linkRow}>
              <Link href="/privacy-policy" className={classes.bluelinkPrivacy} title="Privacy Policy">
                Privacy Policy
              </Link>
              <span className={classes.separator}>|</span>
              <Link href="/terms-of-service" className={classes.bluelinkTerms} title="Terms of Service">
                Terms of Service
              </Link>
            </div>
          </Group>
        </div>
      </Container>
    </footer>
  );
}
