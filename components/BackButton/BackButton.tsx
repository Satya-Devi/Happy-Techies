"use client";

import { IconCircleArrowLeftFilled } from "@tabler/icons-react";
import classes from "./BackButton.module.css";
import { useEffect, useLayoutEffect, useRef } from "react";

type BackButtonProps = {
  BackButtonStyles?: React.CSSProperties;
};

// export default function BackButton({ BackButtonStyles }: BackButtonProps, {role}:{role?:string}) {
export default function BackButton({
  BackButtonStyles,
  role,
}: BackButtonProps & { role?: string }) {
  const initialRoute = useRef<string | null>(null);

  useLayoutEffect(() => {
    // Capture the initial URL as soon as the component is rendered
    if (!initialRoute.current) {
      initialRoute.current = `${window.location.origin}${window.location.pathname}${window.location.search}`;
      console.log("Captured initial route with filters:", initialRoute.current);
    }
  }, []);

  const handleBackClick = () => {
    if (window.location.href === initialRoute.current) {
      window.history.back(); // Go back in browser history
    } else if (initialRoute.current) {
      // Otherwise, navigate to the initial route
      window.location.assign(initialRoute.current);
    }
  };

  return (
    <IconCircleArrowLeftFilled
      className={
        role && role == "Employer" ? classes.ebackButton : classes.backButton
      }
      style={BackButtonStyles}
      onClick={handleBackClick}
    />
  );
}
