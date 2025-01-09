import { ContainedNav } from "@/components/ContainedNav/ContainedNav";
import { ImageCard } from "@/components/ImageCard/ImageCard";
import { createClient } from "@/utils/supabase/server";
import {
  Container,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SFProRounded } from "../layout";
import * as yup from 'yup';
import SignupForm from "@/components/SignupForm";
import bcrypt from "bcrypt";

const passwordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], "Passwords must match")
    .required("Confirm password is required"),
  tos: yup.bool().oneOf([true], "You must agree to the terms of service")
});


export default function Signup({
  searchParams,
}: {
  searchParams: { [key: string]: string  };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm password") as string;
    const tos = formData.get("tos") === 'on';

    try {
      await passwordSchema.validate({
        email,
        password,
        confirmPassword,
        tos
      }, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Collect errors
        const errorMessages = error.inner.reduce((acc: { [key: string]: string }, e: yup.ValidationError) => {
          if (e.path) {
            acc[e.path] = e.message;
          }
          return acc;
        }, {});

        const errorQueryString = new URLSearchParams(errorMessages).toString();
        return redirect(`/signup?${errorQueryString}`);
      }
      throw error; // Re-throw unexpected errors
    }

    if (!tos) {
      return redirect("/signup?message=You must agree to the terms of service");
    }

    if (password !== confirmPassword) {
      return redirect("/signup?message=Passwords don't match");
    }
    

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    const user = data.user;

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    if (!user) {
      return console.log("/login?message=User creation failed");
    }

    console.log(user, "User created");

    const encryptedPassword = await bcrypt.hash(password, 10);
    const { data: insertData, error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        email: email,
        password: encryptedPassword,
        provider: user.app_metadata.provider,
        created_at: new Date().toISOString(),
      },
    ]);

    if(insertError) {
      return console.log(insertError);
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <>
      <ContainedNav />
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Paper
            h="auto"
            bg="white"
            px={{
              base: 40,
              md: 100,
            }}
            py={80}
            radius="md"
          >
            <Title ta="left" order={1} className={SFProRounded.className} c="blue">
              Sign up for happytechies
            </Title>
            <Text c="dark" size="md" ta="left" mt={5}>
              Find your next job and grow your career.
            </Text>
            <SignupForm searchParams={searchParams} onSubmit={signUp}/>
          </Paper>
          <ImageCard />
        </SimpleGrid>
      </Container>
    </>
  );
}

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
