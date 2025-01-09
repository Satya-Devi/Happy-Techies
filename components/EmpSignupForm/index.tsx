"use client";
import React, { useRef, useState } from "react";
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
    form?: string;
    email?: string;
    message?: string;
    password?: string;
    confirmPassword?: string;
    tos?: string;
    linkedin?: string;
    mobile?: string;
  };
  onSubmit: (data: any, data1: any) => {};
};

interface FormValues {
  name: string;
  location: string;
  mobile: string;
  linkedin: string;
  company: string;
  email: string;
  password: string;
  confirmPassword: string;
  tos: boolean;
}
const EmpSignupForm = ({ searchParams, onSubmit }: Props) => {
  const ref = useRef<ReCAPTCHA>(null);
  const formData = useRef();
  // const [formValues, setFormValues] = useState<FormValues>({
  //   name: "",
  //   location: "",
  //   mobile: "",
  //   linkedin: "",
  //   company: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  //   tos: false,
  // });
  const [formValues, setFormValues] = useState<FormValues>(() => {
    if (searchParams.form) {
      try {
        return JSON.parse(searchParams.form);
      } catch (error) {
        console.error("Error parsing searchParams.form:", error);
      }
    }
    return {
      name: "",
      location: "",
      mobile: "",
      linkedin: "",
      company: "",
      email: "",
      password: "",
      confirmPassword: "",
      tos: false,
    };
  });
  console.log(
    "searchParams: ",
    searchParams.form,
    searchParams.form ? JSON.parse(searchParams.form) : null
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    console.log("e value", e);
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = (e: any) => {
    formData.current = e;
    console.log("Submit data", e);
    if (ref.current) {
      ref.current.execute();
    }
    console.log("FormValues", formValues);
    // onSubmit(formData.current, formValues);
  };
  const onVerify = (token: any) => {
    if (ref.current?.reset) {
      ref.current.reset();
    }
    onSubmit(formData.current, formValues);
  };
  return (
    <form>
      {/* <Stack pt="xl">
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "10px" }}>
      <div style={{ flex: 1 }}>
        <label htmlFor="name" style={labelStyle}>
          Name
        </label>
        <input
          name="name"
          placeholder="Your Name"
          required
          style={inputStyle}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="location" style={labelStyle}>
          Location
        </label>
        <input
          name="location"
          placeholder="Your Location"
          required
          style={inputStyle}
        />
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "10px" }}>
      <div style={{ flex: 1 }}>
        <label htmlFor="mobile" style={labelStyle}>
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          placeholder="+1234567890"
          required
          style={inputStyle}
        />
    {searchParams?.["mobile"] && <Text color="red" size="sm">{searchParams["mobile"]}</Text>}

      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="linkedin" style={labelStyle}>
          LinkedIn Profile
        </label>
        <input
          type="url"
          name="linkedin"
          placeholder="https://linkedin.com/in/yourprofile"
          required
          style={inputStyle}
        />
       {searchParams?.["linkedin"] && <Text color="red" size="sm">{searchParams["linkedin"]}</Text>}

      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "10px" }}>
      <div style={{ flex: 1 }}>
        <label htmlFor="company" style={labelStyle}>
          Company Name
        </label>
        <input
          name="company"
          placeholder="Your Company Name"
          required
          style={inputStyle}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="email" style={labelStyle}>
          Email
        </label>
        <input
          name="email"
          placeholder="you@example.com"
          required
          style={inputStyle}
        />
            {searchParams?.["email"] && <Text color="red" size="sm">{searchParams["email"]}</Text>}
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "10px" }}>
      <div style={{ flex: 1 }}>
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
        {searchParams?.["password"] && <Text color="red" size="sm">{searchParams["password"]}</Text>}
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="confirmPassword" style={labelStyle}>
          Confirm Password
        </label>
        <input
          type="password"
          name="confirm password"
          placeholder="••••••••"
          required
          style={inputStyle}
        />
        {searchParams?.["confirmPassword"] && <Text color="red" size="sm">{searchParams["confirmPassword"]}</Text>}
      </div>
    </div>
    <div style={{ marginBottom: "10px" }}>
      <Checkbox
        type="checkbox"
        name="tos"
        required
        label={
          <>
            I agree to the {" "}
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
            {' '} and {' '}
            <Link
              href="/privacy-policy"
              style={{
                color: "#004a93",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </Link>
          </>
        }
      />
      {searchParams?.["tos"] && <Text color="red" size="sm">{searchParams["tos"]}</Text>}
    </div>
       <ReCAPTCHA
                     ref={ref}
                     size="invisible"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                     onChange={onVerify}
                 />
    <SubmitButton
      style={buttonStyle}
      formAction={handleSubmit}
      pendingText="Signing Up..."
    >
      Sign Up
    </SubmitButton>
    <Divider
      label="or Sign up using"
      labelPosition="center"
      my="md"
    />
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
      <Link href="/employers-login" style={linkStyle}>
        Login
      </Link>
    </Text>
    {searchParams?.message && (
      <Container>
        <Badge
          variant="light"
          color="green"
          radius="md"
          size="lg"
          p="md"
        >
          {searchParams.message}
        </Badge>
      </Container>
    )}
  </Stack> */}
      <Stack pt="xl">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label htmlFor="name" style={labelStyle}>
              Name
            </label>
            <input
              name="name"
              placeholder="Your Name"
              required
              style={inputStyle}
              value={formValues.name}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="location" style={labelStyle}>
              Location
            </label>
            <input
              name="location"
              placeholder="Your Location"
              required
              style={inputStyle}
              value={formValues.location}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label htmlFor="mobile" style={labelStyle}>
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="+1234567890"
              required
              style={inputStyle}
              value={formValues.mobile}
              onChange={handleInputChange}
            />
            {searchParams["mobile"] && (
              <Text color="red" size="sm">
                {searchParams["mobile"]}
              </Text>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="linkedin" style={labelStyle}>
              LinkedIn Profile
            </label>
            <input
              type="url"
              name="linkedin"
              placeholder="https://linkedin.com/in/yourprofile"
              required
              style={inputStyle}
              value={formValues.linkedin}
              onChange={handleInputChange}
            />
            {searchParams["linkedin"] && (
              <Text color="red" size="sm">
                {searchParams["linkedin"]}
              </Text>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label htmlFor="company" style={labelStyle}>
              Company Name
            </label>
            <input
              name="company"
              placeholder="Your Company Name"
              required
              style={inputStyle}
              value={formValues.company}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              name="email"
              placeholder="you@example.com"
              required
              style={inputStyle}
              value={formValues.email}
              onChange={handleInputChange}
            />
            {searchParams["email"] && (
              <Text color="red" size="sm">
                {searchParams["email"]}
              </Text>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              style={inputStyle}
              value={formValues.password}
              onChange={handleInputChange}
            />
            {searchParams["password"] && (
              <Text color="red" size="sm">
                {searchParams["password"]}
              </Text>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              required
              style={inputStyle}
              value={formValues.confirmPassword}
              onChange={handleInputChange}
            />
            {searchParams["confirmPassword"] && (
              <Text color="red" size="sm">
                {searchParams["confirmPassword"]}
              </Text>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Checkbox
            type="checkbox"
            name="tos"
            required
            checked={formValues.tos}
            onChange={handleInputChange}
            label={
              <>
                I agree to the
                <Link
                  href="/terms-of-service"
                  style={{
                    color: "#004a93",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  style={{
                    color: "#004a93",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  Privacy Policy
                </Link>
              </>
            }
          />
          {searchParams["tos"] && (
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
          Sign Up
        </SubmitButton>
        <Divider label="or Sign up using" labelPosition="center" my="md" />
        <Group justify="center" gap="xl">
          <CircularButton>
            <GoogleLoginButton role="Employer" />
          </CircularButton>
          <CircularButton>
            <MicrosoftLoginButton role="Employer" />
          </CircularButton>
          <CircularButton>
            <LinkedInLoginButton role="Employer" />
          </CircularButton>
        </Group>
        <Text c="dark" size="sm" ta="center" mt={30}>
          Already have an account?
          <Link href="/employers-login" style={linkStyle}>
            Login
          </Link>
        </Text>
        {searchParams.message && (
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

export default EmpSignupForm;

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
