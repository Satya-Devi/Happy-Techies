"use client";
import { Box, Modal, Text, Title, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState, useEffect } from "react";
import classes from "./ForgotPassword.module.css";
import { SFProRounded } from "@/app/layout";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPassword() {
  const [opened, { open, close }] = useDisclosure(false);
  const [success, setSuccess] = useState(false)
  const [errorM, setErrorM] = useState(false)
  const [message, setMessage] = useState("")

  const handleForgotPassword = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const supabase = createClient();
    try {
      setErrorM(false)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://happytechies.com/login"
      });
      if (error) {
        return setMessage("Something went wrong!! Please try later."), setErrorM(true);
      }
      setMessage("Success! A password reset email has been sent.")
      setSuccess(!success)
      setErrorM(false)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(()=> {
    if(success){
      setTimeout(()=>{
        close()
        setSuccess(!success)
      },8000)
    }
  },[success])

  return (
    <>
      <Text
        onClick={open}
        className={classes.forgotTitle}
        c="dark"
        size="md"
        ta="right"
      >
        Forgot Password?
      </Text>
      <Modal opened={opened} onClose={close} centered size="lg">
        <Box ml={40} mr={40} mb={40}>
          <Title
            ta="left"
            order={1}
            className={SFProRounded.className}
            c="blue"
            mb={10}
          >
            Forgot your password?
          </Title>
          <Text className={SFProRounded.className} c="dark" size="md">
            Just enter the email you used to sign up, and we’ll send you the
            steps to reset your password. Don't worry, we never store your
            password, so we’ll never email it to you.
          </Text>
          <form>
            <div style={inputContainerStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <input
                name="email"
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
              {success && <Text style={successText}>{message}</Text>}
              {errorM && <Text style={errorText}>{message}</Text>}
            </div>
            <Button
              style={buttonStyle}
              type="submit"
              formAction={handleForgotPassword}
            >
              Send reset instructions
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}

const inputContainerStyle = {
  marginBottom: "20px",
  marginTop: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: 500,
  fontSize: "14px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #e0e0e0",
  fontSize: "16px",
};

const buttonStyle = {
  backgroundColor: "#004a93",
  color: "white",
  // padding: "10px",
  borderRadius: "20px",
  height: "40px",
  fontSize: "16px",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const successText = {
  color: "green",
  fontSize: "16px",
  fontWeight: 500,
}

const errorText = {
  color: "red",
  fontSize: "16px",
  fontWeight: 500,
}