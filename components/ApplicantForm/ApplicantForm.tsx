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
} from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { insertApplicationData } from "@/app/apply-form/action";
interface ApplicantFormProps {
  // onSubmit: (data: any) => Promise<{ id: string; status: boolean }>;
  jobId?: string;
}

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
  });

  const [errors, setErrors] = useState({
    employerName: "",
    phoneNumber: "",
    experience: "",
    startDate: "",
    email: "",
    employmentstatus: "",
    linkedinProfile: "",
    certification: "",
    uploadResume: "",
    uploadCV: "",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // const handleSubmit = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     // Basic validation
  //     if (!formData.uploadResume) {
  //       setErrors((prev) => ({ ...prev, uploadResume: "Resume is required" }));
  //       return;
  //     }

  //     // Upload resume file to Supabase storage
  //     const supabase = createClient();
  //     const fileExt = formData.uploadResume.name.split(".").pop();
  //     const fileName = `${Math.random()}.${fileExt}`;

  //     const { data: uploadData, error: uploadError } = await supabase.storage
  //       .from("resumes")
  //       .upload(fileName, formData.uploadResume);

  //     if (uploadError) {
  //       throw new Error("Resume upload failed");
  //     }

  //     // Get public URL for resume
  //     const {
  //       data: { publicUrl },
  //     } = supabase.storage.from("resumes").getPublicUrl(fileName);

  //     const result = await onSubmit({
  //       ...formData,
  //       resumeUrl: publicUrl,
  //       jobId: jobId,
  //     });

  //     if (result.status) {
  //       router.push("/application-success");
  //     }
  //   } catch (error) {
  //     console.error("Application submission failed:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleFileUpload = (file: File, type: 'resume' | 'cv') => {
    if (!file) return Promise.reject(new Error("No file provided"));
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64Data = reader.result;
  
        // Determine the API route based on the type
        const apiRoute = type === 'resume' ? "/api/resumes" : "/api/cvs";
  
        fetch(apiRoute, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: base64Data,
            fileName: file.name,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Upload failed");
            }
            return response.json();
          })
          .then((data) => {
            setFormData((prev) => ({
              ...prev,
              [type === 'resume' ? 'resumeUrl' : 'cvUrl']: data.url,
            }));
            resolve(data?.url);
          })
          .catch(reject);
      };
  
      reader.onerror = () => reject(new Error("File reading failed"));
    });
  };
  
  
  const handleSubmit = async () => {
    console.log("Submit data", formData);
    setIsSubmitting(true);
   
    try {
      let uploadPromises = [];
  
      if (formData.uploadResume) {
        uploadPromises.push(handleFileUpload(formData.uploadResume, 'resume'));
      }
      if (formData.uploadCV) {
        uploadPromises.push(handleFileUpload(formData.uploadCV, 'cv'));
      }
  
      await Promise.all(uploadPromises);
  
      // const result = await onSubmit({
      //   ...formData,
      //   jobId: jobId,
      // });
      insertApplicationData(
        formData,jobId
        
      )
      .then((result) => {
        if (result.status) {
          router.push("/application-success");
        }
      
      })}
     catch (error) {
           console.error("Application submission failed:", error);
         } finally {
           setIsSubmitting(false);
         }
  
    //   if (result.status) {
    //     router.push("/application-success");
    //   }
    // } catch (error) {
    //   console.error("Application submission failed:", error);
    // } finally {
    //   setIsSubmitting(false);
     }
  
  

  const startDateValue = formData.startDate
    ? new Date(formData.startDate)
    : null;

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
    display:"flex",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 400,
    color: "#AEB0B4",
  },
};
