"use client";
import { Box, Modal, Text, Title, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState, useEffect } from "react";
import { SFProRounded } from "@/app/layout";
import { createClient } from "@/utils/supabase/client";

type Props = {
    searchParams: {
        code?: string
    }
}

export default function ResetPassword({ searchParams }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [success, setSuccess] = useState(false);
  const [errorM, setErrorM] = useState(false)
  const [message, setMessage] = useState("")

  const handleResetPassword = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm password") as string;
    console.log(password, confirm_password)
    if (password !== confirm_password) return setMessage("Passwords don't match!"), setErrorM(true);
    const supabase = createClient();
    try {
      setErrorM(false)
      const { data, error } = await supabase.auth.updateUser({
        password
      });
      if (error) {
        return setMessage("Something went wrong!! Please try later."), setErrorM(true);
      }
      if (data) setMessage("Password changed successfully!"), setSuccess(!success), setErrorM(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    if(searchParams?.code){
        open()
    }
  }, [searchParams])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        close();
        setSuccess(!success);
      }, 8000);
    }
  }, [success]);

  return (
    <>
      <Modal opened={opened} onClose={close} centered size="lg">
        <Box ml={40} mr={40} mb={40}>
          <Title
            ta="left"
            order={1}
            className={SFProRounded.className}
            c="blue"
            mb={20}
          >
            New password
          </Title>
          <form>
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
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="confirm password" style={labelStyle}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm password"
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>
            {success && <Text style={successText}>{message}</Text>}
            {errorM && <Text style={errorText}>{message}</Text>}
            <Button
              style={buttonStyle}
              type="submit"
              formAction={handleResetPassword}
            >
              Submit
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
  marginBottom: "10px"
};

const errorText = {
    color: "red",
    fontSize: "16px",
    fontWeight: 500,
    marginBottom: "10px"
  }