import { ContainedNav } from "@/components/ContainedNav/ContainedNav";
import { ImageCard } from "@/components/ImageCard/ImageCard";
import { createClient } from "@/utils/supabase/server";
import {
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Button,
  Group,
  Divider,
  Box,
} from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SFProRounded } from "../layout";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import MicrosoftLoginButton from "@/components/MicrosoftLoginButton";
import LinkedInLoginButton from "@/components/LinkedInLoginButton";
import ForgotPassword from "@/components/ForgotPassword/ForgotPassword";
import ResetPassword from "@/components/ResetPassword/ResetPassword";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string, code: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/login?message=${error?.code === "invalid_credentials" ? "Invalid credentials" : error?.code}`);
    }

    return redirect("/jobs");
  };

  return (
    <>
      <ContainedNav />
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Paper
            h="700px"
            bg="white"
            px={{
              base: 40,
              md: 60,
            }}
            py={40}
            radius="md"
          >
            <Title
              ta="left"
              order={1}
              className={SFProRounded.className}
              c="blue"
              mb={10}
            >
              Log in to happytechies
            </Title>
            <Text c="dark" size="md" ta="left" mb={30}>
              Find your next job and grow your career.
            </Text>

            <form>
              <Stack>
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
                </div>
                <div style={inputPassContainerStyle}>
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
                {searchParams?.message && <Text style={errorText}>{searchParams?.message}</Text>}
                <ForgotPassword/>

                <Button
                  style={buttonStyle}
                  fullWidth
                  type="submit"
                  formAction={signIn}
                >
                  Sign In
                </Button>

                <Divider
                  label="or Sign in using"
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
                  Don't have an account?{" "}
                  <Link href="/signup" style={linkStyle} title="Sign Up Now to Explore Career Opportunities with Happy Techies">
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </form>
          </Paper>

          <ImageCard />
        </SimpleGrid>
      </Container>
      <ResetPassword searchParams={searchParams}/>
    </>
  );
}

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
      position: "relative"
    }}
  >
    {children}
  </Box>
);

const inputContainerStyle = {
  marginBottom: "20px",
};

const inputPassContainerStyle = {
  marginBottom: "0px",
}

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
  height:"40px",
  fontSize: "16px",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const linkStyle = {
  color: "#004a93",
  textDecoration: "none",
  fontWeight: 500,
};

const errorText = {
  color: "red",
  fontSize: "16px",
  fontWeight: 500,
  marginBottom: "10px"
}