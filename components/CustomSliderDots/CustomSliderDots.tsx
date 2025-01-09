// components/CustomSliderDots.js
import React from "react";
import styles from "./CustomSliderDots.module.css"; // Import your CSS module for styling
import PropTypes from 'prop-types'; // Import PropTypes for type checking

const CustomSliderDots: React.FC<{ totalSlides: number; currentIndex: number; onDotClick: (index: number) => void }> = ({ totalSlides, currentIndex, onDotClick }) => {
  return (
    <div className={styles.dotsContainer}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <li
        key={index}
        className={`${styles.dot} ${index === currentIndex ? styles.active : ""}`}
        onClick={() => onDotClick(index)}
      ></li>
      ))}
    </div>
  );
};

export default CustomSliderDots;
