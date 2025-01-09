import React from 'react';
import styles from './Grid.module.css';
import { IconHelpOctagon, IconRosetteDiscountCheck, IconTargetArrow } from "@tabler/icons-react";
import { SFProRounded } from "@/app/layout";

interface GridItemProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({ title, items, icon }) => (
  <div className={styles.gridItem}>
    {/* Display the icon above the title */}
    <div className={`${styles.gridIcon} ${SFProRounded.className}`}>{icon}</div>
    <h3 className={`${styles.gridTitle} ${SFProRounded.className}`}>{title}</h3>
    <ul className={`${styles.gridList} ${SFProRounded.className}`}>
      {items.map((item, index) => (
        <li key={index} className={`${styles.gridListItem}  ${SFProRounded.className}`}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const GridComponent: React.FC = () => {
  return (
    <div className={styles.gridContainer}>
      {/* Grid items */}
      <GridItem
        title="Our Mission"
        items={[
          'Empower your career growth with personalized guidance and support from experienced mentors.',
          'Connect with like-minded professionals and build valuable relationships within the Microsoft community.',
          'Stay ahead of the curve with access to the latest industry trends, news, and insights.'
        ]}
        icon={<IconTargetArrow size={40} color="#135CA5"/>}
      />
      <GridItem
        title="What We Offer"
        items={[
          'Comprehensive Job Board: Explore thousands of carefully curated Microsoft job openings from startups to tech giants.',
          'Personalized Job Matching: Find roles that align perfectly with your skills and experience.',
          'Career Growth Resources: Access valuable resources like training, mentorship, and networking to advance your career.',
          `Engaging Community: Connect with like-minded professionals, share knowledge, and learn from experts.`
        ]}
        icon={<IconRosetteDiscountCheck  size={40} color="#135CA5" />}
      />
      <GridItem
        title="Why Choose Happy Techies"
        items={[
          'Expertise: Our team has deep expertise in Microsoft technologies and understands the unique needs of professionals in the field.',
          'Commitment: We\'re dedicated to helping you achieve your career goals and succeed in the Microsoft ecosystem.',
          'Community-Driven: Happy Techies is a thriving community of Microsoft enthusiasts who support and inspire each other.'
        ]}
        icon={<IconHelpOctagon size={40} color="#135CA5" />}
      />
    </div>
  );
};

export default GridComponent;
