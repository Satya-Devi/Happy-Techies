"use client"
import { Box } from "@mantine/core";
import EmployerLogo from "../EmployerLogo";

type CardImageProps = {
  employer_logo: string;
};

export function CardImage({ employer_logo }: CardImageProps) {
  return (
    <Box
      bg="#f8f9fa"
      style={{
        display: "inline-block",
        borderRadius: "10px",
        border: "1px solid #dee2e6",
        padding:"0.4rem"
      }}
    >
      <EmployerLogo
        logo={
          employer_logo ||
          "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg"
        }
      />
    </Box>
  );
}
