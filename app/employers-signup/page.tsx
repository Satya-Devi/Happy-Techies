import { ContainedNav } from "@/components/ContainedNav/ContainedNav";
import { ImageCard } from "@/components/ImageCard/ImageCard";
import { createClient } from "@/utils/supabase/server";
import { Container, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SFProRounded } from "../layout";
import * as yup from "yup";
import EmpSignupForm from "@/components/EmpSignupForm";
import bcrypt from "bcrypt";

const passwordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  tos: yup.bool().oneOf([true], "You must agree to the terms of service"),
  mobile: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  linkedin: yup
    .string()
    .url("Invalid LinkedIn profile URL")
    .matches(
      /linkedin\.com\/in\/[a-zA-Z0-9_-]+/,
      "Enter a valid LinkedIn profile URL"
    )
    .required("LinkedIn profile is required"),
});

export default function EmpSignup({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const signUp = async (formData: FormData, formValues: any) => {
    "use server";
    console.log("StartStaRTStart", formValues, formData);
    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const mobile = parseInt(formData.get("mobile") as string, 10);
    const linkedin = formData.get("linkedin") as string;

    const tos = formData.get("tos") === "on";
    console.log(
      "signupdata====",
      confirmPassword,
      email,
      linkedin,
      mobile,
      company,
      location,
      name
    );
    try {
      await passwordSchema.validate(
        {
          email,
          password,
          confirmPassword,
          tos,
          linkedin,
          mobile,
        },
        { abortEarly: false }
      );
    } catch (error) {
      console.error("EEERRROR", error);
      if (error instanceof yup.ValidationError) {
        // Collect errors
        const errorMessages = error.inner.reduce(
          (acc: { [key: string]: string }, e: yup.ValidationError) => {
            if (e.path) {
              acc[e.path] = e.message;
            }
            return acc;
          },
          {}
        );

        // const errorQueryString = new URLSearchParams(errorMessages).toString();
        // console.log("errorQueryString",errorQueryString)
        // return redirect(`/employers-signup?${errorQueryString}`);

        const errorQueryString = new URLSearchParams(errorMessages);
        errorQueryString.append("form", JSON.stringify(formValues));

        console.log("errorQueryString", errorQueryString.toString());
        return redirect(`/employers-signup?${errorQueryString.toString()}`);
      }
      throw error; // Re-throw unexpected errors
    }

    if (!tos) {
      return redirect(
        "/employers-signup?message=You must agree to the terms of service"
      );
    }

    if (password !== confirmPassword) {
      return redirect("/employers-signup?message=Passwords don't match");
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/empcallback`,
      },
    });
    console.log("dataaa", data);
    const user = data.user;

    if (error) {
      console.log("error+++++", error);
      return redirect("/employers-login?message=Could not authenticate user");
    }

    if (!user) {
      return console.log("/employers-login?message=User creation failed");
    }

    console.log(user, "User created");

    // const encryptedPassword = await bcrypt.hash(password, 10);
    // const { data: insertData, error: insertError } = await supabase.from("users").insert([
    //   {
    //     id: user.id,
    //     email: email,
    //     password: encryptedPassword,
    //     provider: user.app_metadata.provider,
    //     created_at: new Date().toISOString(),
    //   },
    // ]);
    const { data: insertData1, error: empinsertError } = await supabase
      .from("employer_details")
      .insert([
        {
          id: user.id,
          email: email,
          emp_name: name,
          location: location,
          mobile_number: mobile,
          linkedin_profile_link: linkedin,
          company_name: company,
          provider: user.app_metadata.provider,
          is_employer_login: true,
          created_at: new Date().toISOString(),
        },
      ]);
    if (empinsertError) {
      return console.log("insert in user", empinsertError);
    }
    // if(insertError) {
    //   return console.log("insert-emp",insertError);
    // }
    console.log("$$$$$$$$$$$$$$$$$$$$$");
    return redirect(
      "/employers-login?message=Check email to continue sign in process"
    );
  };

  return (
    <>
      <ContainedNav role="Employer" />
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
            <Title
              ta="left"
              order={1}
              className={SFProRounded.className}
              c="#004A93"
            >
              Sign up for happytechies
            </Title>
            <Text c="dark" size="md" ta="left" mt={5}>
              Post a job and Hire the top talent.
            </Text>
            <EmpSignupForm searchParams={searchParams} onSubmit={signUp} />
          </Paper>
          <ImageCard slug="empsignup" />
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
