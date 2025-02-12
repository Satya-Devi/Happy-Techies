"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Group,
  NumberInput,
  TagsInput,
  TextInput,
  Select,
  Textarea,
  FileInput,
  Modal,
  Text,
} from "@mantine/core";
import { SFProRounded } from "@/app/layout";
import * as Yup from "yup";
import { createClient } from "@/utils/supabase/client";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { insertApplicationData } from "@/app/apply-form/action";

interface ApplicantFormProps {
  jobId?: string;
}

interface FormErrors {
  [key: string]: string;
}

const validationSchema = Yup.object().shape({
  employerName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters")
    .required("Employer Name is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number")
    .required("Phone Number is required"),
  experience: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Experience cannot be negative")
    .max(50, "Please enter a realistic experience value")
    .required("Experience is required")
    .typeError("Experience must be a number"),
  startDate: Yup.date()
    .transform((value) => (value === "" ? undefined : value))
    .typeError("Please select a valid date")
    .required("Start Date is required")
    .min(new Date(), "Start date must be in the future"),
  email: Yup.string()
    .email("Invalid email format")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format")
    .required("Email is required"),
  employmentstatus: Yup.string().required("Employment Status is required"),
  linkedinProfile: Yup.string()
    .url("Invalid URL")
    .matches(/linkedin\.com/, "Must be a LinkedIn URL")
    .required("LinkedIn Profile is required"),
  certification: Yup.string().required("Certification is required"),
  uploadResume: Yup.mixed().required("Resume is required"),
});

const ApplicantForm = ({ jobId }: ApplicantFormProps) => {
  const [formData, setFormData] = useState({
    employerName: "",
    phoneNumber: "",
    experience: "",
    startDate: "",
    email: "",
    employmentstatus: "",
    linkedinProfile: "",
    certification: "",
    uploadResume: null as File | null,
    uploadCV: null as File | null,
    resumeUrl: "",
    cvUrl: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Immediate validation
    validateField(key, value);

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateField = (fieldName: string, value: any) => {
    validationSchema
      .validateAt(fieldName, { [fieldName]: value })
      .then(() => {
        setErrors((prev) => {
          const { [fieldName]: _, ...rest } = prev;
          return rest;
        });
      })
      .catch((error: Yup.ValidationError) => {
        setErrors((prev) => ({ ...prev, [fieldName]: error.message }));
      });
  };

  const handleFileUpload = async (file: File, type: "resume" | "cv") => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise<string>((resolve, reject) => {
      reader.onload = async () => {
        try {
          const response = await fetch(
            `/api/${type === "resume" ? "resumes" : "cvs"}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                file: reader.result,
                fileName: file.name,
              }),
            }
          );

          if (!response.ok) throw new Error("Upload failed");
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            [type === "resume" ? "resumeUrl" : "cvUrl"]: data.url,
          }));
          resolve(data.url);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("File reading failed"));
    });
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);

      const uploadPromises = [];
      if (formData.uploadResume)
        uploadPromises.push(handleFileUpload(formData.uploadResume, "resume"));
      if (formData.uploadCV)
        uploadPromises.push(handleFileUpload(formData.uploadCV, "cv"));
      await Promise.all(uploadPromises);

      const { uploadResume, uploadCV, ...submitData } = formData;
      const result = await insertApplicationData(submitData, jobId);

      if (result.status) {
        setIsModalOpen(true);
        setFormData({
          employerName: "",
          phoneNumber: "",
          experience: "",
          startDate: "",
          email: "",
          employmentstatus: "",
          linkedinProfile: "",
          certification: "",
          uploadResume: null,
          uploadCV: null,
          resumeUrl: "",
          cvUrl: "",
        });
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Create an object with all validation errors
        const validationErrors = error.inner.reduce((acc, err) => {
          if (err.path) {
            acc[err.path] = err.message;
          }
          return acc;
        }, {} as FormErrors);

        setErrors(validationErrors);
      }
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDateValue = formData.startDate
    ? new Date(formData.startDate)
    : null;

  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/jobs");
  };

  return (
    <div>
      <Box
        mx="auto"
        p="lg"
        style={{
          maxWidth: "89%",
          backgroundColor: "white",
        }}
      >
        <Modal
          opened={isModalOpen}
          centered
          onClose={() => setIsModalOpen(false)}
          size="lg"
        >
          <Text
            size="md"
            style={{
              marginBottom: "25px",
            }}
            className={SFProRounded.className}
          >
            Your application has been submitted successfully
          </Text>
          <Group mt="md" justify="flex-end">
            <Button
              color="#004A93"
              aria-label="Delete draft"
              onClick={closeModal}
            >
              Close
            </Button>
          </Group>
        </Modal>
        <form>
          <Grid
            gutter={34}
            style={{
              gap: "5%",
              padding: "3px",
            }}
          >
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  required
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.employerName}
                  onChange={(e) =>
                    handleInputChange("employerName", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.employerName && (
                  <div style={{ color: "red" }}>{errors.employerName}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  required
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.phoneNumber && (
                  <div style={{ color: "red" }}>{errors.phoneNumber}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <NumberInput
                  size="md"
                  label="Experience"
                  placeholder="Enter Number of Years"
                  min={0}
                  value={formData.experience}
                  onChange={(value) => handleInputChange("experience", value)}
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.experience && (
                  <div style={{ color: "red" }}>{errors.experience}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <DateInput
                  size="md"
                  label="Available Start Date"
                  required
                  minDate={new Date()}
                  value={startDateValue}
                  placeholder="DD/MM/YYYY"
                  className="custom-input"
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                  onChange={(value) => handleInputChange("startDate", value)}
                  clearable
                />
                {errors.startDate && (
                  <div style={{ color: "red" }}>{errors.startDate}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  label="Email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.email && (
                  <div style={{ color: "red" }}>{errors.email}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <Select
                  size="md"
                  label="Current Employment Status"
                  placeholder="Select your employment status"
                  checkIconPosition="right"
                  required
                  value={formData.employmentstatus}
                  onChange={(value) =>
                    handleInputChange("employmentstatus", value)
                  }
                  data={[
                    { value: "employed", label: "Employed" },
                    { value: "unemployed", label: "Unemployed" },
                    { value: "freelancer", label: "Freelancer" },
                    { value: "student", label: "Student" },
                    { value: "contractor", label: "Contractor" },
                  ]}
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.employmentstatus && (
                  <div style={{ color: "red" }}>{errors.employmentstatus}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  label="LinkedIn Profile"
                  placeholder="LinkedIn Profile"
                  required
                  value={formData.linkedinProfile}
                  onChange={(e) =>
                    handleInputChange("linkedinProfile", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.linkedinProfile && (
                  <div style={{ color: "red" }}>{errors.linkedinProfile}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  label="Certification"
                  placeholder="Enter certification"
                  required
                  value={formData.certification}
                  onChange={(e) =>
                    handleInputChange("certification", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.certification && (
                  <div style={{ color: "red" }}>{errors.certification}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <FileInput
                  size="md"
                  label="Upload Resume"
                  placeholder="Drop Files here or Browse"
                  required
                  accept="application/pdf"
                  value={formData.uploadResume}
                  onChange={(file) => handleInputChange("uploadResume", file)}
                  styles={{
                    ...uploadStyles,
                    required: { color: "black" },
                  }}
                />

                {errors.uploadResume && (
                  <div style={{ color: "red" }}>{errors.uploadResume}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <FileInput
                  size="md"
                  label="Upload Cover Letter"
                  placeholder="Drop Files here or Browse"
                  value={formData.uploadCV}
                  onChange={(e) => handleInputChange("uploadCV", e)}
                  styles={{
                    ...uploadStyles,
                    required: { color: "black" },
                  }}
                />
                {errors.uploadCV && (
                  <div style={{ color: "red" }}>{errors.uploadCV}</div>
                )}
              </div>
            </Grid.Col>
          </Grid>
        </form>
      </Box>
      <Group
        mt="lg"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          type="submit"
          size="md"
          style={{
            backgroundColor: "#004A93",
            color: "white",
            width: 150,
          }}
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Apply"}
        </Button>
      </Group>
    </div>
  );
};

export default ApplicantForm;

const inputStyles = {
  input: {
    border: "0.91px solid #D6D6D6",
    minHeight: "48px",
    borderRadius: "9.1px",
  },
  label: {
    fontSize: "16px",
    fontWeight: 600,
    paddingBottom: "11px",
  },
  placeholder: {
    fontSize: "20px",
    fontWeight: 400,
    color: "#AEB0B4",
  },
};

const textStyles = {
  input: {
    borderRadius: "9.1px",
    border: "0.91px solid #D6D6D6",
    minHeight: "180px",
  },
  label: {
    fontSize: "16px",
    fontWeight: 600,
    paddingBottom: "11px",
  },
  placeholder: {
    fontSize: "20px",
    fontWeight: 400,
    color: "#AEB0B4",
  },
};

const tagStyles = {
  pill: {
    backgroundColor: "white",
    color: "#004A93",
    margin: "2px",
    borderRadius: "10px",
    border: "1px solid #004A93",
  },
};

const uploadStyles = {
  input: {
    borderRadius: "9.1px",
    border: "0.91px solid #D6D6D6",
    minHeight: "180px",
  },
  label: {
    fontSize: "16px",
    fontWeight: 600,
    paddingBottom: "11px",
  },
  placeholder: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 400,
    color: "#AEB0B4",
  },
};
