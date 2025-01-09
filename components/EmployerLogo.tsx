"use client";

import { Image } from "@mantine/core";

interface EmployerLogoProps {
  logo: string | null;
}

export default function EmployerLogo({ logo }: EmployerLogoProps) {
  return (
    <Image
      h="40px"
      w="40px"
      fit="contain"
      src={
        logo ??
        "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg"
      }
      fallbackSrc="https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg"
      onError={(e) => {
        e.currentTarget.src =
          "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg";
      }}
    />
  );
}
