// import React from "react";
// import { SFProRounded } from "@/app/layout";
// import {
//   Container,
//   Grid,
//   GridCol,
//   Group,
//   Title,
//   Text,
//   Box,
//   SimpleGrid,
//   Button,
//   Card,
//   CardSection,
//   ThemeIcon,
// } from "@mantine/core";
// import {
//   IconArrowUpRight,
//   IconBriefcase,
//   IconCalendarBolt,
//   IconCash,
//   IconCode,
//   IconMapPin,
//   IconGolf,
//   IconBookmark,
//   IconCoin,
//   IconMail,
//   IconBrandLinkedin,
//   IconX,
//   IconBrandFacebook,
//   IconCalendarEvent,
//   IconBuilding,
//   IconAward,
//   IconPackage,
// } from "@tabler/icons-react";
// import CardCompany from "../cardCompany/cardCompany";
// import { FaUserShield } from "react-icons/fa";
// import BackButton from "../BackButton/BackButton";
// import classes from "./JobPreview.module.css";
// import { CardAICTA } from "@/components/CardAICTA/CardAICTA";
// import { CardContentCTA } from "@/components/CardContentCTA/CardContentCTA";
// import { CardImage } from "@/components/CardImage/CardImage";
// import { ContainedNav } from "@/components/ContainedNav/ContainedNav";
// import { Job } from "@/components/Job/Job";
// import SaveJobButton from "@/components/SaveJobButton";
// import { capitalize } from "@/utils/supabase/dto";
// import { createClient } from "@/utils/supabase/server";
// import Link from "next/link";
// const JobPreview = ({ job, jobs }: { job: any; jobs: any[] }) => {
//   const styles = {
//     titleHeader: {
//       fontWeight: "700",
//       textAlign: "left",
//       wordBreak: "break-all",
//     },
//     textStyle: {
//       fontSize: "16px",
//       fontWeight: "500",
//       gap: "4px",
//       height: "25.6px",
//       color: "#000000B2",
//     },
//     descriptionText: {
//       whiteSpace: "pre-line",
//       lineHeight: "32px",
//     },
//     requirementsText: {
//       whiteSpace: "pre-line",
//       lineHeight: "32px",
//       paddingBottom: "xs",
//       marginLeft: "-16px",
//     },
//     shareButtonStyle: {
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//     },
//     cardSectionStyle: {
//       borderBottom: "1px solid #E0E0E0",
//       margin: "0 2px",
//       display: "flex",
//       alignItems: "center",
//     },
//     cardTextStyle: {
//       color: "#000000B2",
//       lineHeight: "25.6px",
//     },
//     cardValueStyle: {
//       color: "#000000",
//       fontSize: "18px",
//       lineHeight: "28.8px",
//       textAlign: "right",
//     },
//   };

//   if (!job) {
//     return <Text>No job data available.</Text>;
//   }

//   const SaveButton = () => {
//     return (
//       <Button
//         component="a"
//         size="sm"
//         bg="white"
//         variant="outline"
//         href="/login"
//         fz="md"
//         leftSection={
//           <IconBookmark
//             style={{
//               color: "#489BE7",
//               width: "15.16px",
//               height: "18px",
//               border: "1.89px",
//             }}
//           />
//         }
//         style={{
//           width: "100%", // Fixed width
//           height: "58px", // Fixed height
//           padding: "16px 24px", // Custom padding
//           borderRadius: "6px 0 0 0",
//           border: "1px solid transparent",
//           backgroundColor: "#fff",
//           color: "#489BE7",
//         }}
//       >
//         Save job
//       </Button>
//     );
//   };

//   return (
//     <Container size="xl">
//       <main>
//         <Grid>
//           <GridCol span={{ base: 12, md: 8 }}>
//             <Container>
//               <BackButton BackButtonStyles={{ marginLeft: "-10px" }} />
//               <Group justify="space-between">
//                 <Title
//                   ta="left"
//                   order={1}
//                   c="#004a93"
//                   className={`${SFProRounded.className} ${classes.TitleHeader}`}
//                 >
//                   {job.company_name || "No Title Available"}
//                 </Title>
//               </Group>

//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <FaUserShield
//                   size={24}
//                   color={"#489BE7"}
//                   style={{ marginRight: "8px" }}
//                 />
//                 <span
//                   className={SFProRounded.className}
//                   style={{
//                     fontSize: "16px",
//                     fontWeight: "500",
//                     gap: "4px",
//                     height: "25.6px",
//                     color: "#000000B2",
//                   }}
//                 >
//                   Role: {job.job_title || "Not Specified"}
//                 </span>
//                 <IconGolf
//                   size={24}
//                   strokeWidth={2}
//                   color={"#489BE7"}
//                   style={{ marginRight: "8px" }}
//                 />
//                 <span
//                   className={SFProRounded.className}
//                   style={{
//                     fontSize: "16px",
//                     fontWeight: "500",
//                     gap: "4px",
//                     height: "25.6px",
//                     color: "#000000B2",
//                   }}
//                 >
//                   Company: {job.company_name || "Not Specified"}
//                 </span>
//               </div>

//               <Box pt="xl">
//                 <Title
//                   order={2}
//                   fw={700}
//                   pb="xs"
//                   className={SFProRounded.className}
//                 >
//                   Job Description
//                 </Title>
//                 <Text
//                   mr="lg"
//                   style={{
//                     whiteSpace: "pre-line",
//                     lineHeight: "32px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   {job.job_description || "No description provided."}
//                 </Text>
//               </Box>

//               <Box pt="lg">
//                 <Title
//                   order={2}
//                   fw={700}
//                   pb="xs"
//                   className={SFProRounded.className}
//                 >
//                   Requirements
//                 </Title>
//                 <Container pr="xl">
//                   {job.requirements?.length > 0 ? (
//                     job.requirements.map(
//                       (requirement: string, index: number) => (
//                         <div key={index} style={styles.requirementsText}>
//                           • {requirement.trim()}
//                         </div>
//                       )
//                     )
//                   ) : (
//                     <span>No specific requirements for this role.</span>
//                   )}
//                 </Container>
//               </Box>

//               <Container px={0} py="xl">
//                 <Box
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       marginRight: "20px",
//                       fontWeight: 600,
//                       fontSize: "13px",
//                     }}
//                   >
//                     SHARE THIS OPENING
//                   </Text>
//                   <Box
//                     style={{
//                       display: "flex",
//                       gap: "10px",
//                     }}
//                   >
//                     <a
//                       href="mailto:?subject=Check out this job opening!"
//                       title="Share via Email"
//                     >
//                       <img
//                         src="/images/email.png"
//                         alt="Email"
//                         width="42px"
//                         height="42px"
//                       />
//                     </a>
//                     <a
//                       href="https://www.linkedin.com/shareArticle"
//                       target="_blank"
//                       title="Share on LinkedIn"
//                     >
//                       <img
//                         src="/images/linked.png"
//                         alt="LinkedIn"
//                         width="42px"
//                         height="42px"
//                       />
//                     </a>
//                     <a
//                       href="https://twitter.com/intent/tweet"
//                       target="_blank"
//                       title="Share on X (formerly Twitter)"
//                     >
//                       <img
//                         src="/images/x.png"
//                         alt="X"
//                         width="42px"
//                         height="42px"
//                       />
//                     </a>
//                     <a
//                       href="https://www.facebook.com/sharer/sharer.php"
//                       target="_blank"
//                       title="Share on Facebook"
//                     >
//                       <img
//                         src="/images/facebook.png"
//                         alt="Facebook"
//                         width="42px"
//                         height="42px"
//                       />
//                     </a>
//                   </Box>
//                 </Box>
//               </Container>

//               {/* <Container px={0} py="xl" visibleFrom="sm">
//                 <Title
//                   ta="left"
//                   order={1}
//                   pb="md"
//                   className={SFProRounded.className}
//                 >
//                   Similar jobs
//                 </Title>
//                 {jobs?.length > 0 ? (
//                   <SimpleGrid cols={1}>
//                     {jobs.map((similarJob: any) => (
//                       <Container px={0} my="sm" key={similarJob.id}>
//                         <a href={`/jobs/${similarJob.id}`}>
//                           <Card withBorder radius="md">
//                             <CardSection style={styles.cardSectionStyle}>
//                               <Text size="16px" fw={500}>
//                                 {similarJob.job_title || "No Title"}
//                               </Text>
//                               <Text style={styles.cardTextStyle}>
//                                 {similarJob.company_name || "No Company Name"}
//                               </Text>
//                             </CardSection>
//                           </Card>
//                         </a>
//                       </Container>
//                     ))}
//                   </SimpleGrid>
//                 ) : (
//                   <Text>No similar jobs found.</Text>
//                 )}
//               </Container> */}
//             </Container>
//           </GridCol>

//           <GridCol span={{ base: 12, md: 4 }}>
//             <Grid visibleFrom="sm" gutter="sm">
//               <GridCol span={{ base: 12, md: 6 }}>
//                 <SaveButton />
//               </GridCol>

//               <GridCol span={{ base: 12, md: 6 }}>
//                 <Button
//                   component="a"
//                   fullWidth
//                   size="lg"
//                   fz={"md"}
//                   color="#004a93"
//                   href={job.job_listing_source_url || "#"}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   leftSection={
//                     <IconArrowUpRight
//                       style={{
//                         width: "13.75px",
//                         height: "13.75px",
//                         color: "#FFFFFF",
//                       }}
//                     />
//                   }
//                   style={{
//                     width: "100%",
//                     height: "58px",
//                     padding: "16px 24px",
//                     borderRadius: "0px",
//                     border: "1px solid transparent",
//                     backgroundColor: "#004a93",
//                   }}
//                 >
//                   Apply now
//                 </Button>
//               </GridCol>
//             </Grid>

//             <Card p="lg" my="md" radius="md">
//               {/* Job Type */}
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                   height: "auto",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconBriefcase style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Job Type
//                 </Text>
//                 <Text
//                   fw={500}
//                   style={{
//                     // font: "Inter Display",
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     position: "absolute",
//                     right: "28px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   {job.employment_type
//                     ? `${capitalize(job.employment_type.toLowerCase())} role`
//                     : "Full-time role"}
//                 </Text>
//               </CardSection>

//               {/* Skills */}
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                   // height: "70px",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconCode style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                     width: "50%",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Skills required
//                 </Text>
//                 <Text
//                   fw={500}
//                   className={SFProRounded.className}
//                   style={{
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     // position: "absolute",
//                     // right: "28px",
//                     width: "50%",
//                     textAlign: "right",
//                     marginRight: "-12px",
//                   }}
//                 >
//                   {/* {job.skills?.length
//                     ? job.skills.join(", ")
//                     : "No particular skills mentioned."} */}
//                   {job.skills?.length
//                     ? job.skills.map((skill: string, index: number) => (
//                         <span key={index}>
//                           {skill}
//                           {index < job.skills.length - 1 ? ", " : ""}
//                         </span>
//                       ))
//                     : "No particular skills mentioned."}
//                 </Text>
//               </CardSection>

//               {/* Location */}
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                   height: "70px",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconMapPin style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Location
//                 </Text>
//                 <Text
//                   fw={500}
//                   className={SFProRounded.className}
//                   style={{
//                     // font: "Inter Display",
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     position: "absolute",
//                     right: "28px",
//                   }}
//                 >
//                   {job.job_location || "Location not specified"}
//                 </Text>
//               </CardSection>
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                   height: "70px",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconPackage style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Solution Area
//                 </Text>
//                 <Text
//                   fw={500}
//                   className={SFProRounded.className}
//                   style={{
//                     // font: "Inter Display",
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     position: "absolute",
//                     right: "28px",
//                   }}
//                 >
//                   {job.solution_area || ""}
//                 </Text>
//               </CardSection>
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                   height: "70px",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconAward style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Experience
//                 </Text>
//                 <Text
//                   fw={500}
//                   className={SFProRounded.className}
//                   style={{
//                     // font: "Inter Display",
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     position: "absolute",
//                     right: "28px",
//                   }}
//                 >
//                   {job.years_of_experience || ""}
//                 </Text>
//               </CardSection>

//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                   height: "70px",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconBuilding style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Work Place Type
//                 </Text>
//                 <Text
//                   fw={500}
//                   className={SFProRounded.className}
//                   style={{
//                     // font: "Inter Display",
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     position: "absolute",
//                     right: "28px",
//                   }}
//                 >
//                   {job.remote ? "Remote" : "Onsite"}
//                 </Text>
//               </CardSection>

//               {/* Salary */}
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconCoin style={{ width: "16px", height: "16px" }} />
//                   <IconCoin style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                     width: "50%",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Salary
//                 </Text>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     width: "100%",
//                     justifyContent: "flex-end",
//                     marginRight: "-12px",
//                   }}
//                 >
//                   <Text
//                     fw={500}
//                     className={SFProRounded.className}
//                     style={{
//                       // font: "Inter Display",
//                       color: "#000000",
//                       size: "18px",
//                       lineHeight: "28.8px",
//                       width: "50%",
//                       textAlign: "right",
//                     }}
//                   >
//                     min {job.salary_min || "NA"} $
//                   </Text>

//                   <Text
//                     fw={500}
//                     className={SFProRounded.className}
//                     style={{
//                       // font: "Inter Display",
//                       color: "#000000",
//                       size: "18px",
//                       lineHeight: "28.8px",
//                       width: "50%",
//                       textAlign: "right",
//                     }}
//                   >
//                     max {job.salary_max || "NA"} $
//                   </Text>
//                 </div>
//               </CardSection>

//               {/* Date Posted */}
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconCalendarBolt style={{ width: "16px", height: "16px" }} />
//                   <IconCalendarBolt style={{ width: "16px", height: "16px" }} />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                     width: "50%",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Date Posted
//                 </Text>
//                 <Text
//                   fw={500}
//                   className={SFProRounded.className}
//                   style={{
//                     // font: "Inter Display",
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     width: "50%",
//                     textAlign: "right",
//                     marginRight: "-12px",
//                   }}
//                 >
//                   {job.created_at
//                     ? new Date(job.created_at).toLocaleDateString("en-US", {
//                         month: "long",
//                         day: "numeric",
//                         year: "numeric",
//                       })
//                     : "No date posted"}
//                 </Text>
//               </CardSection>
//               <CardSection
//                 py="lg"
//                 pr="lg"
//                 style={{
//                   borderBottom: "1px solid #E0E0E0",
//                   margin: "0 2px",
//                   display: "flex",
//                   alignItems: "center",
//                   height: "70px",
//                 }}
//               >
//                 <ThemeIcon variant="light">
//                   <IconCalendarEvent
//                     style={{ width: "16px", height: "16px" }}
//                   />
//                 </ThemeIcon>
//                 <Text
//                   size="16px"
//                   fw={500}
//                   py="xs"
//                   style={{
//                     marginLeft: "8px",
//                     color: "#000000B2",
//                     // font: "Inter Display",
//                     lineHeight: "25.6px",
//                   }}
//                   className={SFProRounded.className}
//                 >
//                   Deadline
//                 </Text>
//                 <Text
//                   fw={500}
//                   className={SFProRounded.className}
//                   style={{
//                     // font: "Inter Display",
//                     color: "#000000",
//                     size: "18px",
//                     lineHeight: "28.8px",
//                     position: "absolute",
//                     right: "28px",
//                   }}
//                 >
//                   {job.application_deadline
//                     ? new Date(job.application_deadline).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         }
//                       )
//                     : "No date posted"}
//                 </Text>
//               </CardSection>
//             </Card>
//             <Group gap="xs" hiddenFrom="sm" my="lg">
//               <SaveButton />
//               <Button
//                 component="a"
//                 fullWidth
//                 fz={"md"}
//                 size="lg"
//                 color="#004a93"
//                 href={job.job_listing_source_url?.toString()}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 leftSection={<IconArrowUpRight size={20} />}
//               >
//                 Apply now
//               </Button>
//             </Group>
//             <Container px={0} py="xl" hiddenFrom="sm">
//               <Title
//                 ta="left"
//                 order={1}
//                 pb="md"
//                 className={SFProRounded.className}
//               >
//                 Similar jobs
//               </Title>
//               {jobs.length > 0 ? (
//                 <SimpleGrid cols={1}>
//                   {jobs.map((job) => (
//                     <Container
//                       px={0}
//                       key={job.id}
//                       className={SFProRounded.className}
//                     >
//                       {/* <Link
//                         href={`/jobs/${job.id}`}
//                         style={{
//                           textDecoration: "none",
//                         }}
//                       >
//                         <JobCardSmall job={job} />
//                       </Link> */}
//                     </Container>
//                   ))}
//                 </SimpleGrid>
//               ) : (
//                 <Text>
//                   No similar jobs were found with a matching skill set for this
//                   role.
//                 </Text>
//               )}
//             </Container>
//             {/* <CardCompany
//               id={job.id}
//               companyLogo={job.employer_logo}
//               companyName={job.company_name}
//               companyDescription={job.brief_summary}
//             /> */}
//             <CardContentCTA />
//           </GridCol>
//         </Grid>
//       </main>
//     </Container>
//   );
// };

// export default JobPreview;

import React from "react";
import { SFProRounded } from "@/app/layout";
import {
  Container,
  Grid,
  GridCol,
  Group,
  Title,
  Text,
  Box,
  SimpleGrid,
  Button,
  Card,
  CardSection,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconBriefcase,
  IconCalendarBolt,
  IconCash,
  IconCode,
  IconMapPin,
  IconGolf,
  IconBookmark,
  IconCoin,
  IconMail,
  IconBrandLinkedin,
  IconX,
  IconBrandFacebook,
  IconCalendarEvent,
  IconBuilding,
  IconAward,
  IconPackage,
} from "@tabler/icons-react";
import CardCompany from "../cardCompany/cardCompany";
import { FaUserShield } from "react-icons/fa";
import BackButton from "../BackButton/BackButton";
import classes from "./JobPreview.module.css";
import { CardAICTA } from "@/components/CardAICTA/CardAICTA";
import { CardContentCTA } from "@/components/CardContentCTA/CardContentCTA";
import { CardImage } from "@/components/CardImage/CardImage";
import { ContainedNav } from "@/components/ContainedNav/ContainedNav";
import { Job } from "@/components/Job/Job";
import SaveJobButton from "@/components/SaveJobButton";
import { capitalize } from "@/utils/supabase/dto";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
const JobPreview = ({ job, jobs }: { job: any; jobs: any[] }) => {
  const styles = {
    titleHeader: {
      fontWeight: "700",
      textAlign: "left",
      wordBreak: "break-all",
    },
    textStyle: {
      fontSize: "16px",
      fontWeight: "500",
      gap: "4px",
      height: "25.6px",
      color: "#000000B2",
    },
    descriptionText: {
      whiteSpace: "pre-line",
      lineHeight: "32px",
    },
    requirementsText: {
      whiteSpace: "pre-line",
      lineHeight: "32px",
      paddingBottom: "xs",
      marginLeft: "-16px",
    },
    shareButtonStyle: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    cardSectionStyle: {
      borderBottom: "1px solid #E0E0E0",
      margin: "0 2px",
      display: "flex",
      alignItems: "center",
    },
    cardTextStyle: {
      color: "#000000B2",
      lineHeight: "25.6px",
    },
    cardValueStyle: {
      color: "#000000",
      fontSize: "18px",
      lineHeight: "28.8px",
      textAlign: "right",
    },
  };

  if (!job) {
    return <Text>No job data available.</Text>;
  }

  const SaveButton = () => {
    return (
      <Button
        component="a"
        size="sm"
        bg="white"
        variant="outline"
        href="/login"
        fz="md"
        leftSection={
          <IconBookmark
            style={{
              color: "#489BE7",
              width: "15.16px",
              height: "18px",
              border: "1.89px",
            }}
          />
        }
        style={{
          width: "100%", // Fixed width
          height: "58px", // Fixed height
          padding: "16px 24px", // Custom padding
          borderRadius: "6px 0 0 0",
          border: "1px solid transparent",
          backgroundColor: "#fff",
          color: "#489BE7",
        }}
      >
        Save job
      </Button>
    );
  };

  return (
    <div
      style={{
        marginTop: "-50px",
      }}
    >
      <Container size="xl">
        <main>
          <Grid mx="auto" p="lg" style={{ maxWidth: "99%" }}>
            <GridCol span={{ base: 12, md: 8 }}>
              <Container>
                {/* <BackButton BackButtonStyles={{ marginLeft: "-10px" }} /> */}
                <Group justify="space-between">
                  <Title
                    ta="left"
                    order={1}
                    c="#004a93"
                    className={`${SFProRounded.className} ${classes.TitleHeader}`}
                  >
                    {job.company_name || "No Title Available"}
                  </Title>
                </Group>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaUserShield
                    size={24}
                    color={"#489BE7"}
                    style={{ marginRight: "8px" }}
                  />
                  <span
                    className={SFProRounded.className}
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      gap: "4px",
                      height: "25.6px",
                      color: "#000000B2",
                    }}
                  >
                    Role: {job.job_title || "Not Specified"}
                  </span>
                  <IconGolf
                    size={24}
                    strokeWidth={2}
                    color={"#489BE7"}
                    style={{ marginRight: "8px" }}
                  />
                  <span
                    className={SFProRounded.className}
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      gap: "4px",
                      height: "25.6px",
                      color: "#000000B2",
                    }}
                  >
                    Company: {job.company_name || "Not Specified"}
                  </span>
                </div>

                <Box pt="xl">
                  <Title
                    order={2}
                    fw={700}
                    pb="xs"
                    className={SFProRounded.className}
                  >
                    Job Description
                  </Title>
                  <Text
                    mr="lg"
                    style={{
                      whiteSpace: "pre-line",
                      lineHeight: "32px",
                    }}
                    className={SFProRounded.className}
                  >
                    {job.job_description || "No description provided."}
                  </Text>
                </Box>

                <Box pt="lg">
                  <Title
                    order={2}
                    fw={700}
                    pb="xs"
                    className={SFProRounded.className}
                  >
                    Requirements
                  </Title>
                  {job.requirements?.length > 0 ? (
                    <Container pr="xl">
                      {job.requirements?.length > 0 &&
                        job.requirements.map(
                          (requirement: string, index: number) => (
                            <div key={index} style={styles.requirementsText}>
                              • {requirement.trim()}
                            </div>
                          )
                        )}
                    </Container>
                  ) : (
                    <Text>No requirements provided.</Text>
                  )}
                </Box>

                <Container px={0} py="xl">
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginRight: "20px",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      SHARE THIS OPENING
                    </Text>
                    <Box
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <a
                        href="mailto:?subject=Check out this job opening!"
                        title="Share via Email"
                      >
                        <img
                          src="/images/email.png"
                          alt="Email"
                          width="42px"
                          height="42px"
                        />
                      </a>
                      <a
                        href="https://www.linkedin.com/shareArticle"
                        target="_blank"
                        title="Share on LinkedIn"
                      >
                        <img
                          src="/images/linked.png"
                          alt="LinkedIn"
                          width="42px"
                          height="42px"
                        />
                      </a>
                      <a
                        href="https://twitter.com/intent/tweet"
                        target="_blank"
                        title="Share on X (formerly Twitter)"
                      >
                        <img
                          src="/images/x.png"
                          alt="X"
                          width="42px"
                          height="42px"
                        />
                      </a>
                      <a
                        href="https://www.facebook.com/sharer/sharer.php"
                        target="_blank"
                        title="Share on Facebook"
                      >
                        <img
                          src="/images/facebook.png"
                          alt="Facebook"
                          width="42px"
                          height="42px"
                        />
                      </a>
                    </Box>
                  </Box>
                </Container>

                {/* <Container px={0} py="xl" visibleFrom="sm">
                <Title
                  ta="left"
                  order={1}
                  pb="md"
                  className={SFProRounded.className}
                >
                  Similar jobs
                </Title>
                {jobs?.length > 0 ? (
                  <SimpleGrid cols={1}>
                    {jobs.map((similarJob: any) => (
                      <Container px={0} my="sm" key={similarJob.id}>
                        <a href={/jobs/${similarJob.id}}>
                          <Card withBorder radius="md">
                            <CardSection style={styles.cardSectionStyle}>
                              <Text size="16px" fw={500}>
                                {similarJob.job_title || "No Title"}
                              </Text>
                              <Text style={styles.cardTextStyle}>
                                {similarJob.company_name || "No Company Name"}
                              </Text>
                            </CardSection>
                          </Card>
                        </a>
                      </Container>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>No similar jobs found.</Text>
                )}
              </Container> */}
              </Container>
            </GridCol>

            <GridCol span={{ base: 12, md: 4 }}>
              {/* <Grid visibleFrom="sm" gutter="sm">
                <GridCol span={{ base: 12, md: 6 }}>
                  <SaveButton />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <Button
                    component="a"
                    fullWidth
                    size="lg"
                    fz={"md"}
                    color="#004a93"
                    href={job.job_listing_source_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={
                      <IconArrowUpRight
                        style={{
                          width: "13.75px",
                          height: "13.75px",
                          color: "#FFFFFF",
                        }}
                      />
                    }
                    style={{
                      width: "100%",
                      height: "58px",
                      padding: "16px 24px",
                      borderRadius: "0px",
                      border: "1px solid transparent",
                      backgroundColor: "#004a93",
                    }}
                  >
                    Apply now
                  </Button>
                </GridCol>
              </Grid> */}

              <Card p="lg" my="md" radius="md">
                {/* Job Type */}
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "auto",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconBriefcase style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Job Type
                  </Text>
                  <Text
                    fw={500}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                    className={SFProRounded.className}
                  >
                    {job.employment_type
                      ? `${capitalize(job.employment_type.toLowerCase())}`
                      : "Full-time role"}
                  </Text>
                </CardSection>

                {/* Skills */}
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    // height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconCode style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                      width: "50%",
                    }}
                    className={SFProRounded.className}
                  >
                    Skills required
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      // position: "absolute",
                      // right: "28px",
                      width: "50%",
                      textAlign: "right",
                      marginRight: "-12px",
                    }}
                  >
                    {/* {job.skills?.length
                    ? job.skills.join(", ")
                    : "No particular skills mentioned."} */}
                    {job.skills?.length
                      ? job.skills.map((skill: string, index: number) => (
                          <span key={index}>
                            {skill}
                            {index < job.skills.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "No particular skills mentioned."}
                  </Text>
                </CardSection>

                {/* Location */}
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconMapPin style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Location
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                  >
                    {job.job_location || "Location not specified"}
                  </Text>
                </CardSection>
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconPackage style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Solution Area
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                  >
                    {job.solution_area || ""}
                  </Text>
                </CardSection>
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconAward style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Experience
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                  >
                    {job.years_of_experience || ""} Yrs
                  </Text>
                </CardSection>

                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconBuilding style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Work Place Type
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                  >
                    {job.remote ? "Remote" : "Onsite"}
                  </Text>
                </CardSection>

                {/* Salary */}
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconCoin style={{ width: "16px", height: "16px" }} />
                    <IconCoin style={{ width: "16px", height: "16px" }} />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                      width: "50%",
                    }}
                    className={SFProRounded.className}
                  >
                    Salary
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "flex-end",
                      marginRight: "-12px",
                    }}
                  >
                    <Text
                      fw={500}
                      className={SFProRounded.className}
                      style={{
                        // font: "Inter Display",
                        color: "#000000",
                        size: "18px",
                        lineHeight: "28.8px",
                        width: "50%",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${job.salary_min || "NA"} - ${job.salary_max || "NA"}
                    </Text>
                  </div>
                </CardSection>

                {/* Date Posted */}
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconCalendarBolt
                      style={{ width: "16px", height: "16px" }}
                    />
                    <IconCalendarBolt
                      style={{ width: "16px", height: "16px" }}
                    />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                      width: "50%",
                    }}
                    className={SFProRounded.className}
                  >
                    Date Posted
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      width: "50%",
                      textAlign: "right",
                      marginRight: "-12px",
                    }}
                  >
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No date posted"}
                  </Text>
                </CardSection>
                <CardSection
                  py="lg"
                  pr="lg"
                  style={{
                    borderBottom: "1px solid #E0E0E0",
                    margin: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    height: "70px",
                  }}
                >
                  <ThemeIcon variant="light">
                    <IconCalendarEvent
                      style={{ width: "16px", height: "16px" }}
                    />
                  </ThemeIcon>
                  <Text
                    size="16px"
                    fw={500}
                    py="xs"
                    style={{
                      marginLeft: "8px",
                      color: "#000000B2",
                      // font: "Inter Display",
                      lineHeight: "25.6px",
                    }}
                    className={SFProRounded.className}
                  >
                    Deadline
                  </Text>
                  <Text
                    fw={500}
                    className={SFProRounded.className}
                    style={{
                      // font: "Inter Display",
                      color: "#000000",
                      size: "18px",
                      lineHeight: "28.8px",
                      position: "absolute",
                      right: "28px",
                    }}
                  >
                    {job.application_deadline
                      ? new Date(job.application_deadline).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "No date posted"}
                  </Text>
                </CardSection>
              </Card>
              <Group gap="xs" hiddenFrom="sm" my="lg">
                <SaveButton />
                <Button
                  component="a"
                  fullWidth
                  fz={"md"}
                  size="lg"
                  color="#004a93"
                  href={job.job_listing_source_url?.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftSection={<IconArrowUpRight size={20} />}
                >
                  Apply now
                </Button>
              </Group>
              <Container px={0} py="xl" hiddenFrom="sm">
                <Title
                  ta="left"
                  order={1}
                  pb="md"
                  className={SFProRounded.className}
                >
                  Similar jobs
                </Title>
                {jobs.length > 0 ? (
                  <SimpleGrid cols={1}>
                    {jobs.map((job) => (
                      <Container
                        px={0}
                        key={job.id}
                        className={SFProRounded.className}
                      >
                        {/* <Link
                        href={/jobs/${job.id}}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <JobCardSmall job={job} />
                      </Link> */}
                      </Container>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>
                    No similar jobs were found with a matching skill set for
                    this role.
                  </Text>
                )}
              </Container>
              {/* <CardCompany
              id={job.id}
              companyLogo={job.employer_logo}
              companyName={job.company_name}
              companyDescription={job.brief_summary}
            /> */}
              <CardContentCTA />
            </GridCol>
          </Grid>
        </main>
      </Container>
    </div>
  );
};

export default JobPreview;
