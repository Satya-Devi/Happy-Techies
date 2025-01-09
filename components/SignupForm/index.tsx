"use client";
import React, { useRef } from "react";
import {
  Badge,
  Box,
  Checkbox,
  Container,
  Group,
  Stack,
  Text,
  Divider,
} from "@mantine/core";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import ReCAPTCHA from "react-google-recaptcha";
import LinkedInLoginButton from "../LinkedInLoginButton";
import MicrosoftLoginButton from "../MicrosoftLoginButton";

type Props = {
  searchParams: {
    message?: string;
    password?: string;
    confirmPassword?: string;
    tos?: string;
  };
  onSubmit: (data: any) => {};
};
const SignupForm = ({ searchParams, onSubmit }: Props) => {
  const ref = useRef<ReCAPTCHA>(null);
  const formData1 = useRef();
  const handleSubmit = (e: any) => {
    formData1.current = e;
    console.log("OSign down", formData1.current);
    if (ref.current) {
      ref.current.execute();
    }
    onSubmit(formData1.current);
  };
  const onVerify = (token: any) => {
    if (ref.current?.reset) {
      ref.current.reset();
    }
    console.log("onSubmitcaptcha", formData1.current);
    onSubmit(formData1.current);
  };
  return (
    <form>
      <Stack pt="xl">
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            name="email"
            placeholder="you@example.com"
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            style={inputStyle}
          />
          {searchParams?.["password"] && (
            <Text color="red" size="sm">
              {searchParams["password"]}
            </Text>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password" style={labelStyle}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm password"
            placeholder="••••••••"
            required
            style={inputStyle}
          />
          {searchParams?.["confirmPassword"] && (
            <Text color="red" size="sm">
              {searchParams["confirmPassword"]}
            </Text>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Checkbox
            type="checkbox"
            name="tos"
            required
            label={
              <>
                I agree to the{" "}
                <Link
                  href="/terms-of-service"
                  style={{
                    color: "#004a93",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  Terms of Service
                </Link>
              </>
            }
          />
          {searchParams?.["tos"] && (
            <Text color="red" size="sm">
              {searchParams["tos"]}
            </Text>
          )}
        </div>
        <ReCAPTCHA
          ref={ref}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          onChange={onVerify}
        />
        <SubmitButton
          style={buttonStyle}
          formAction={handleSubmit}
          pendingText="Signing Up..."
        >
          Create an account
        </SubmitButton>
        <Divider label="or Sign up using" labelPosition="center" my="md" /> 
                <Group justify="center" gap="xl">
                    <CircularButton>
                        <GoogleLoginButton />
                    </CircularButton>
                    <CircularButton>
                        <MicrosoftLoginButton />
                    </CircularButton>
                    <CircularButton>
                        <LinkedInLoginButton />
                    </CircularButton>
                </Group>
                <Text c="dark" size="sm" ta="center" mt={30}>
                    Already have an account?{" "}
                    <Link href="/login" style={linkStyle} title="Login to Happy Techies">
                        Login
                    </Link>
                </Text>

        {searchParams?.message && (
          <Container>
            <Badge variant="light" color="green" radius="md" size="lg" p="md">
              {searchParams.message}
            </Badge>
          </Container>
        )}
      </Stack>
    </form>
  );
};

export default SignupForm;

const labelStyle = {
  display: "block",
  paddingBottom: "4px",
  fontWeight: 500,
  fontStyle: "uppercase",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outline: "none",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "6px",
  borderRadius: "20px",
  border: "none",
  background: "#004a93",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background 0.3s",
};

const linkStyle = {
  color: "#004a93",
  textDecoration: "none",
  fontWeight: 500,
};

const CircularButton = ({ children }: { children: React.ReactNode }) => (
  <Box
    style={{
      width: 50,
      height: 50,
      borderRadius: "50%",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #e0e0e0",
      position: "relative",
    }}
  >
    {children}
  </Box>
);
