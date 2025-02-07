"use client";
import { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";  // Using Font Awesome for PDF icon

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
import { createClient } from "@/utils/supabase/client";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { fetchApplicantsData } from "@/app/application-form/action";
import { insertApplicationData } from "@/app/apply-form/action";
interface ApplicantFormProps {
  // onSubmit: (data: any) => Promise<{ id: string; status: boolean }>;
  id?: string;
}

const ApplicantView = ({ id }: ApplicantFormProps) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    experience: "",
    available_start_date: null as Date | null,
    email: "",
    current_employment_status: "",
    linkedin_profile: "",
    certifications: "",
    uploadResume: null as File | null,
    uploadCV: null as File | null,
    resume: "",
    cv: "",
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



    const [activePage, setActivePage] = useState(1);
    const [data, setData] = useState();
    const [count, setCount] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);


    useEffect(() => {
 
      getData();
    }, []);
    console.log("idd",id)
    const handleDateConversion = (dateString: string) => {
        if (!dateString) return null; // Handle null or undefined dates
        return new Date(dateString.split(" ")[0]); // Extract and convert date part only
      };
  const getData = () => {
    setIsLoading(true);
    fetchApplicantsData({id
    })
      .then((result:any) => {
        console.log("iddd", result);
        if (result){
            let formatedDate=null;
            if(result[0]?.available_start_date){
                 formatedDate=handleDateConversion(result[0]?.available_start_date)
            }
            setFormData((prevFormData) => ({
                ...prevFormData, // Preserve existing state
                full_name: result[0]?.full_name || "",
                phone_number: result[0]?.phone_number || "",
                experience: result[0]?.experience || "",
                available_start_date: formatedDate || null,
                email: result[0]?.email || "",
                current_employment_status: result[0]?.current_employment_status || "",
                linkedin_profile: result[0]?.linkedin_profile || "",
                certifications: result[0]?.certifications || "",
                resume: result[0]?.resume || "",
                cv: result[0]?.cv || "",
              }));
        } 
            // setData(result);
      
      })
      .catch((error) => {
        console.error(error); // Handle any errors here if necessary
      })
      .finally(() => {
        setIsLoading(false);
      });
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
                  value={formData?.full_name}
                 readOnly
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
                  value={formData.phone_number}
                  readOnly
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
                  readOnly
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
                  value={formData.available_start_date}
                  placeholder="DD/MM/YYYY"
                  readOnly
                  className="custom-input"
                  styles={{
                    ...inputStyles,
                    required: { color: "black" },
                  }}
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
                  readOnly
                //   onChange={(e) => handleInputChange("email", e.target.value)}
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
                  readOnly
                  value={formData.current_employment_status}
                //   onChange={(value) =>
                //     handleInputChange("employmentstatus", value)
                //   }
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
                  readOnly
                  required
                  value={formData.linkedin_profile}
                //   onChange={(e) =>
                //     handleInputChange("linkedinProfile", e.target.value)
                //   }
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
                  readOnly
                  value={formData.certifications}
                //   onChange={(e) =>
                //     handleInputChange("certification", e.target.value)
                //   }
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
                {/* <FileInput
                  size="md"
                  label="Upload Resume"
                  placeholder="Drop Files here or Browse"
                  required
                  accept="application/pdf"
                  value={formData.resume}
                //   onChange={(file) => handleInputChange("uploadResume", file)}
                  styles={{
                    ...uploadStyles,
                    required: { color: "black" },
                  }}
                /> */}

<div>
  {/* Check if the resume URL exists */}
  {formData.resume ? (
    <div>
      <label
      style={{
      fontSize: "16px",
      fontWeight: 600,
      paddingBottom: "11px"}}
// styles={{
//     uploadStyles,
  
//   }}
      >Uploaded Resume :</label>
      {/* Custom styled input-like field */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
          cursor: "pointer",
          width: "300px",
          marginTop: "10px",
        }}
        onClick={() => window.open(formData.resume, "_blank")}  // Open the PDF when clicked
      >
        {/* PDF Icon */}
        <FaFilePdf
          style={{
            color: "#d9534f", // Red color for PDF icon
            marginRight: "10px",
            fontSize: "18px",
          }}
        />
        {/* File Name */}
        <span style={{ color: "#333", wordBreak: "break-word" }}>
          {formData.resume.split("/").pop()} {/* Display the file name */}
        </span>
      </div>
    </div>
  ) : (
    <div>No resume uploaded</div>
  )}
</div>



               
                
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                {/* <FileInput
                  size="md"
                  label="Upload Resume"
                  placeholder="Drop Files here or Browse"
                  required
                  accept="application/pdf"
                  value={formData.resume}
                //   onChange={(file) => handleInputChange("uploadResume", file)}
                  styles={{
                    ...uploadStyles,
                    required: { color: "black" },
                  }}
                /> */}

<div>
  {/* Check if the resume URL exists */}
  {formData.cv ? (
    <div>
      <label
      style={{
        fontSize: "16px",
    fontWeight: 600,
    paddingBottom: "11px",
      }}
      >Uploaded CV :</label>
      {/* Custom styled input-like field */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
          cursor: "pointer",
          width: "300px",
          marginTop: "10px",
        }}
        onClick={() => window.open(formData.cv, "_blank")}  // Open the PDF when clicked
      >
        {/* PDF Icon */}
        <FaFilePdf
          style={{
            color: "#d9534f", // Red color for PDF icon
            marginRight: "10px",
            fontSize: "18px",
          }}
        />
        {/* File Name */}
        <span style={{ color: "#333", wordBreak: "break-word" }}>
          {formData.cv.split("/").pop()} {/* Display the file name */}
        </span>
      </div>
    </div>
  ) : (
    <div>No CV uploaded</div>
  )}
</div>



               
                
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
       
      </Group>
    </div>
  );
};

export default ApplicantView;

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
