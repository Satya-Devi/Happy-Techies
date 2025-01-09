"use client";

import {
  Box,
  Card,
  Grid,
  GridCol,
  Text,
} from "@mantine/core";
import {
  IconArrowUpRight,
} from "@tabler/icons-react";
import React, {useRef, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { CardContentCTA } from "../CardContentCTA/CardContentCTA";
import { SFProRounded } from "@/app/layout";
import Styles from "./ContactUsForm.module.css"
import { notifications } from "@mantine/notifications";

interface ContactUsFormProps {
  leftMargin: string;
  onSubmit?: (data?:any) => {}
}

const ContactUsForm: React.FC<ContactUsFormProps> = ({ leftMargin,onSubmit }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [token,setToken]=useState<string | null>(null);
  
  const formStyle = {
    maxWidth: "344px",
    left: "80px",
    top: "411px",
    gap: "24px",
    opacity: "0px",
    marginLeft: leftMargin,
  };
  const handeSubmit = async (event: any) => {
    event.preventDefault();
    let name = event.target.elements.name.value;
    let email = event.target.elements.email.value;
    let message = event.target.elements.message.value;
    if (name && email && message) {
      console.log(name, email, message);
      if (onSubmit) {
        await onSubmit({ name, email, message });
        notifications.show({
          title: "Form Submitted !",
          message: "Thank you for contacting us!",
          color: "green",
        });
      }
    } else {
      alert("Please fill all the fields");
    }
  }
  return (
    <>
      <Grid className={SFProRounded.className}>
        <GridCol span={{ base: 12, md: 8 }}>
          <Text
            className={Styles.headerText}
          >
            Have questions or feedback? Contact us, and we'll get back to you
            soon!
          </Text>
          <form onSubmit={handeSubmit} method="post" style={formStyle}>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="name" style={labelStyle}>
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Smith"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="message" style={labelStyle}>
                Message
              </label>
              <textarea
                name="message"
                placeholder="Your message"
                required
                style={textAreaStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="captcha" style={labelStyle}>
                Please verify you are a human
              </label>
              <ReCAPTCHA
                ref={recaptchaRef}
                onChange={(token) => setToken(token)}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              />
            </div>

            <button
              disabled={!token}
              type="submit"
              style={{
                ...buttonStyle,
                opacity: token ? "1" : "0.5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px", // Adds some space between the text and the icon
              }}
            >
              Submit
              <IconArrowUpRight
                style={{
                  width: "13.75px",
                  height: "13.75px",
                  color: "#FFFFFF",
                }}
              />
            </button>
          </form>
        </GridCol>
        <GridCol
          span={{ base: 12, md: 4 }}
          style={{
            flexShrink: 0,
            flexGrow: 0,
            // top: "-160px",
            // position: "relative",
            gap: "24px",
          }}
          className={Styles.getTouchContainer}
        >
          <Box style={{ width: "421px" }}>
            <Card p="lg" radius="md" style={cardStyle}>
              <Text
                size="sm"
                fw={700}
                mb="md"
                style={{
                  color: "#000000",
                  fontSize: "15px",
                  lineHeight: "18.2px",
                  font: "Inter Display",
                }}
              >
                GET IN TOUCH
              </Text>
              <Text mb="xl">
               Our friendly team is always here to chat.
              </Text>
              <div style={contactInfoStyle}>
                <div>
                  <Text fw={700} color="#489BE7">
                    ADDRESS
                  </Text>
                  <Text>Dallas,TX</Text>
                </div>
              </div>
              <div style={contactInfoStyle}>
                {/* <div>
                  <Text fw={700} color="#489BE7">
                    PHONE
                  </Text>
                  <Text>+1 (469) 555-4011</Text>
                </div> */}
              </div>
              <div style={contactInfoStyle}>
                <div>
                  <Text fw={700} color="#489BE7">
                    EMAIL
                  </Text>
                  <Text>info@happytechies.com</Text>
                </div>
              </div>
            </Card>
            <CardContentCTA />
          </Box>
        </GridCol>
      </Grid>
    </>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontSize: "16px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "16px",
};

const textAreaStyle = {
  width: "100%",
  minHeight: "100px",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#004a93",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};

const cardStyle = {
  marginBottom: "20px",
  width: "100%",
};

const contactInfoStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "16px",
};

export default ContactUsForm;
