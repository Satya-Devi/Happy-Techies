import Footer from "@/components/Footer/Footer";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  apiPlugin,
  StoryblokBridgeLoader,
  storyblokInit,
} from "@storyblok/react/rsc";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import Firebase from "@/components/Firebase/Firebase";
// The order of these imports is important for the CSS to be applied correctly
import { Article } from "@/components/Storyblok/Article";
import { Grid } from "@/components/Storyblok/Grid";
import { Hero } from "@/components/Storyblok/Hero";
import { Page } from "@/components/Storyblok/Page";
import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { Suspense } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./global.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

storyblokInit({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    article: Article,
    page: Page,
    hero: Hero,
    grid: Grid,
  },
});

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "happyTECHIES",
//   description: "A modern job board for Microsoft Technologies",
// };

export const author = localFont({
  src: "../public/fonts/Author-Variable.ttf",
});

export const SFProRounded = localFont({
  src: "../public/fonts/SF-Pro-Rounded-Regular.otf",
  // weight: "200 900",
});
export const SFProRoundedSemiBold = localFont({
  src: "../public/fonts/SF-Pro-Rounded-Semibold.otf",
  // weight: "200 900",
});

const inter = Inter_Tight({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:site_name" content="Happy Techies" />
        <meta property="og:title" content="Happy Techies" />
        <title>HappyTechies – Your Gateway to Microsoft Tech Careers</title>
        <meta
          name="description"
          content="HappyTechies connects tech talent with Microsoft job opportunities. Explore top careers in Microsoft technologies. Start your journey today!"
        />
        <meta
          property="og:description"
          content="HappyTechies connects tech talent with Microsoft job opportunities. Explore top careers in Microsoft technologies. Start your journey today!"
        />
        <ColorSchemeScript />
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="47237572-4bb4-4843-80be-c138be5192c7"
          type="text/javascript"
        ></script>
        <script src="/js/survey.js"></script>
        <script src="/js/analytics.js"></script>
        {/* <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="923582d5-3ef7-4a94-90bf-5d69b65ae7bb"  type="text/javascript"></script> */}
        {/* <script  src="https://cmp.osano.com/16BafyUO4SDUd2hps/7f1fb6ba-35ea-4e82-8e2b-7c483cffbca3/osano.js"></script> */}
      </head>
      <body style={{ backgroundColor: "#f3f9ff" }}>
        <Suspense>
          <Firebase />
        </Suspense>
        <MantineProvider
          theme={{
            fontFamily: inter.style.fontFamily,
          }}
        >
          <Notifications />
          <main>{children}</main>
          <Footer />
        </MantineProvider>
      </body>
      <StoryblokBridgeLoader options={{}} />
    </html>
  );
}
