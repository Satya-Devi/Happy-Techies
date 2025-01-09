"use client";
import { useState, useEffect } from "react";
import { SFProRounded } from "@/app/layout";
import {
  Button,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  FileInput,
  Group,
  Box,
  Grid,
  Modal,
  Text,
  Title,
  TagsInput,
  RangeSlider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  companyLogo: Yup.mixed()
    .required("Company logo is required")
    .test(
      "fileType",
      "Only image files (JPG, JPEG, PNG, GIF, BMP, WEBP, APNG, AVIF) are allowed",
      (value) => {
        console.log("======value", value);
        if (!value || !(value as File).type) {
          return false;
        }
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "image/bmp",
          "image/webp",
          "image/apng",
          "image/avif",
        ];
        return allowedTypes.includes((value as File).type);
      }
    ),

  employerName: Yup.string()
    .required("Employer Name is required")
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Employer Name cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(2, "Employer Name must be at least 2 characters long")
    .max(50, "Employer Name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Employer Name can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),
  employerWebsite: Yup.string()
    .required("Employer website is required")
    .test("url", "Invalid website URL", (value) => {
      if (!value) return true;
      const urlPattern =
        /^(?:http:\/\/|https:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)*(?:\.[a-z]{2,})(?:\/[\w-./?%&=]*)?$/i;
      return urlPattern.test(value);
    }),
  jobTitle: Yup.string()
    .required("Job title is required")
    .transform((value) => (value === "" ? null : value))
    .test("no-spaces-only", "Job title cannot contain only spaces", (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .min(2, "Job title must be at least 2 characters long")
    .max(50, "Job title cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Job title can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),
  jobType: Yup.string().required("Job type is required"),
  solutionArea: Yup.string().required("Solution area is required"),
  jobLocation: Yup.string()
    .required("Job location is required")
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Job Location cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(2, "Job Location must be at least 2 characters long")
    .max(50, "Job Location cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Job Location can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),
  workplaceType: Yup.string().required("Workplace type is required"),
  salaryMin: Yup.number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? undefined : Number(originalValue)
    )
    .required("Salary range is required")
    .min(1, "Minimum salary must be greater than 0"),
  salaryMax: Yup.number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? undefined : Number(originalValue)
    )
    .required("Salary range is required")
    .test(
      "max-salary-test",
      "Maximum salary must be greater than minimum salary",
      function (value) {
        const { salaryMin } = this.parent;
        console.log("Current max value:", value);
        console.log("Current min value:", salaryMin);
        console.log(
          "Parent object:",
          this.parent,
          Number(value),
          Number(salaryMin),
          Number(value) >= Number(salaryMin)
        );
        return Number(value) >= Number(salaryMin);
      }
    ),
  experience: Yup.number()
    .required("Years of experience is required")
    .typeError("Years of experience is required")
    .min(0, "Experience must be at least 0 years"),

  deadline: Yup.date()
    .min(new Date(), "Deadline must not be less than today")
    .required("Deadline is required"),
  skills: Yup.array()
    .of(Yup.string().required("Each skill is required"))
    .min(1, "At least one skill is required 123")
    .required("Skills are required 123"),
  jobDescription: Yup.string()
    .required("Job Description is required")
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Job Description cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(2, "Job Description must be at least 2 characters long"),
});
const draftValidationSchema = Yup.object().shape({
  companyLogo: Yup.mixed().test(
    "fileType",
    "Only image files (JPG, JPEG, PNG, GIF, BMP, WEBP, APNG, AVIF) are allowed",
    (value) => {
      if (!value) return true;
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/apng",
        "image/avif",
      ];
      return allowedTypes.includes((value as File).type);
    }
  ),
  employerName: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Employer Name cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(2, "Employer Name must be at least 2 characters long")
    .max(50, "Employer Name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Employer Name can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),
  employerWebsite: Yup.string()
    .nullable()
    .test("url", "Invalid website URL", (value) => {
      if (!value) return true;
      const urlPattern =
        /^(?:http:\/\/|https:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)*(?:\.[a-z]{2,})(?:\/[\w-./?%&=]*)?$/i;
      return urlPattern.test(value);
    }),
  jobTitle: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test("no-spaces-only", "Job title cannot contain only spaces", (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .min(2, "Job title must be at least 2 characters long")
    .max(50, "Job title cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Job title can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),
  jobType: Yup.string().nullable(),
  solutionArea: Yup.string().nullable(),
  jobLocation: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Job Location cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(2, "Job Location must be at least 2 characters long")
    .max(50, "Job Location cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Job Location can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),

  workplaceType: Yup.string().nullable(),
  salaryMin: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue?.trim() === "" ? null : Number(originalValue)
    )
    .test("optional-min-salary", "Invalid minimum salary", function (value) {
      return !value || value > 1;
    }),

  salaryMax: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue?.trim() === "" ? null : Number(originalValue)
    )
    .test(
      "optional-max-salary",
      "Maximum salary must be greater than minimum salary",
      function (value) {
        const { salaryMin } = this.parent;
        return !value || !salaryMin || value >= salaryMin;
      }
    ),
  experience: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(0, "Experience must be at least 0 years")
    .test("optional-validation", "Invalid experience value", function (value) {
      return !value || (value >= 0 && Number.isInteger(value));
    }),
  deadline: Yup.date()
    .min(new Date(), "Deadline must not be less than today")
    .nullable(),
  skills: Yup.array()
    .nullable()
    .transform((value) => (!value ? [] : value))
    .of(Yup.string().trim())
    .test("optional-skills", "Invalid skills format", function (value) {
      return (
        !value?.length ||
        (value.length > 0 &&
          value.every(
            (skill) => typeof skill === "string" && skill.trim().length > 0
          ))
      );
    }),
  jobDescription: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Job Description cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(2, "Job Description must be at least 2 characters long"),
});

type Props = {
  searchParams: {
    message?: string;
  };

  onSubmit: (data: any) => {};
};

const EmpJobForm = ({ searchParams, onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    companyLogo: null,
    employerName: "",
    employerWebsite: "",
    jobTitle: "",
    jobType: "",
    solutionArea: "",
    jobLocation: "",
    workplaceType: "",
    salaryRange: "",
    experience: "",
    deadline: null,
    skills: [],
    jobDescription: "",
    isDraft: false,
    salaryMin: "",
    salaryMax: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalClose, setModalClose] = useState(false);
  const [ModalText, setModalText] = useState("");
  const [ModalTitle, setModalTitle] = useState("");
  const [warningModal, setWarningModal] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  useEffect(() => {
    console.log("Modal1");

    if (isModalClose) {
      console.log("Modal2");
      return redirect("/my-jobs");
    }
  }, [isModalClose]);
  const handleImageUpload = async (file: any) => {
    // Create a new File instance from the file data
    console.log("EEEENNNTTEERREEED",file, formData?.companyLogo, imageFile);
   
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
      
    reader.onload = async () => {
      const base64Data = reader.result;
        
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Data,
          fileName: file.name
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
      }
    };
  };
  
  // const handleImageUpload = async (imageFile: {
  //   lastModified: number;
  //   lastModifiedDate: Date;
  //   name: string;
  //   size: number;
  //   type: string;
  //   webkitRelativePath: string;
  // }) => {
  //   // Convert the file data to a Blob
  //   const blob = new Blob([imageFile], { type: imageFile.type });
    
  //   // Create a File instance from the Blob
  //   const file = new File([blob], imageFile.name, {
  //     type: imageFile.type,
  //     lastModified: imageFile.lastModified
  //   });
  
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
      
  //   reader.onload = async () => {
  //     const base64Data = reader.result;
        
  //     const response = await fetch('/api/upload', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         file: base64Data,
  //         fileName: imageFile.name
  //       })
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Upload successful:', data);
  //     }
  //   };
  // };
  
  const validateField = async (fieldName: string, value: any) => {
    try {
      console.log("Validation", value);
      if (fieldName === "salaryMax")
        await draftValidationSchema.validateAt(fieldName, {
          [fieldName]: value,
          salaryMin: formData.salaryMin,
        });
      else
        await draftValidationSchema.validateAt(fieldName, {
          [fieldName]: value,
        });
      setErrors((prev) => {
        const { [fieldName]: _, ...rest } = prev; // Remove the field from the errors object
        return rest; // Return the new object without the specified field
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [fieldName]: error.message }));
      }
    }
  };
  const handleInputChange = async (key: string, value: any) => {
    console.log("handle", key, value, formData);
    if (key === "companyLogo" && value) {
    setImageFile(value);
    }
  
    setFormData((prev) => ({ ...prev, [key]: value }));
    await validateField(key, value);
  };
  // const draftValidateForm = async (): Promise<boolean> => {
  //   try {
  //     // Filter out fields with no data before validation
  //     const filteredFormData = Object.fromEntries(
  //       Object.entries(formData).filter(
  //         ([key, value]) => value !== null && value !== ""
  //       )
  //     );

  //     await draftValidationSchema.validate(filteredFormData, {
  //       abortEarly: false,
  //     });
  //     setErrors({});
  //     return true;
  //   } catch (validationErrors) {
  //     if (validationErrors instanceof Yup.ValidationError) {
  //       const formErrors: { [key: string]: string } = {};
  //       validationErrors.inner.forEach((error) => {
  //         formErrors[error.path || ""] = error.message;
  //       });
  //       setErrors(formErrors);
  //     }
  //     return false;
  //   }
  // };

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      if (validationErrors instanceof Yup.ValidationError) {
        const formErrors: { [key: string]: string } = {};
        validationErrors.inner.forEach((error) => {
          formErrors[error.path || ""] = error.message;
        });
        console.log("formErrors", formErrors);
        setErrors(formErrors);
      }
      return false;
    }
  };
  const hasAtLeastOneField = () => {
    const { isDraft, ...dataToCheck } = formData;
    return Object.entries(dataToCheck).some(([key, value]) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        if (value === null || value === undefined) {
            return false;
        }
        return value.toString().trim() !== '';
    });
};
  console.log("================================", errors);
  const handleSubmit = async ({ is_draft }: { is_draft?: boolean }) => {
    console.log("submit$$$$$$$$$$$$$---", formData, is_draft);
    let isValid;
    if (is_draft) {
      isValid = Object.keys(errors).length === 0
    } else {
      isValid = await validateForm();
    }
    console.log("isValid&&&&&&&&&&&", isValid, errors);
    if (isValid) {
      let data = formData;
      // data.companyLogo = (formData?.companyLogo as any)?.name || null;
      if(!is_draft){
        router.push("/payment");
        // return redirect("/payment");
      }
      else{
      data.companyLogo = (formData?.companyLogo as any)?.name || null;
//data.companyLogo = formData?.companyLogo?.name;
      data.isDraft = is_draft ?? false;
      if(formData?.companyLogo)
      await handleImageUpload(imageFile);
      let res = true
     // let res = await onSubmit(data);

      console.log("Success", res);
      if (res) {
        console.log("Success", res);
        setModalOpen(true);
        setFormData({
          companyLogo: null,
          employerName: "",
          employerWebsite: "",
          jobTitle: "",
          jobType: "",
          solutionArea: "",
          jobLocation: "",
          workplaceType: "",
          salaryRange: "",
          experience: "",
          deadline: null,
          skills: [],
          jobDescription: "",
          isDraft: false,
          salaryMin: "",
          salaryMax: "",
        });
      } else {
        setModalOpen(true);
        setModalTitle("Fail!");

        setModalText("Something went wrong!");
      }}
      console.log("Form submitted successfully1:", data, searchParams);

      console.log("Form submitted successfully:", formData);
    } 
    
    else {
      console.log("Form has errors:", errors);
    }
  };
  const handleDraft = async () => {
    console.log("Form 6789saved successfully");
    setFormData((prev) => ({ ...prev, ["isDraft"]: true }));
    setModalText("Form has been successfully saved as a draft!");
    console.log("Form 6789saved successfully", hasAtLeastOneField());
    if (hasAtLeastOneField()) {
      handleSubmit({ is_draft: true });

  }
  else{
    setModalText("Please enter at least one field to save as a draft.");    

    setWarningModal(true);
  }
    
  };

  return (
    <div>
      <Box
        mx="auto"
        p="lg"
        style={{
          maxWidth: "89%",
          // borderRadius: 8,
          backgroundColor: "white",
          // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
            <Grid.Col span={12}>
              <div
                style={{
                  paddingTop: "23px",
                }}
              >
                <FileInput
                  size="md"
                  required
                  label="Company Logo"
                  placeholder={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyItems: "center",
                        flexDirection: "column",
                        paddingTop: "10px",
                      }}
                    >
                      <div>
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div style={{ fontSize: "14px", textAlign: "center" }}>
                        Logo
                      </div>
                    </div>
                  }
                  accept="image/*"
                  // withAsterisk
                  styles={{
                    input: {
                      borderRadius: "9.1px",
                      width: "100%",
                      minHeight: "120px",
                      maxWidth: "140px",
                    },
                    required: {
                      color: "black", // Change the asterisk color
                    },
                    label: {
                      fontSize: "18px",
                      fontWeight: 600,
                      paddingBottom: "10px",
                    },
                  }}
                  value={formData.companyLogo}
                  onChange={(file) => handleInputChange("companyLogo", file)}
                />
   

                {errors.companyLogo && (
                  <div style={{ color: "red" }}>{errors.companyLogo}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  required
                  label="Employer Name"
                  placeholder="Name"
                  value={formData.employerName}
                  onChange={(e) =>
                    handleInputChange("employerName", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
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
                  label="Employer Website"
                  placeholder="Website Link"
                  // withAsterisk
                  value={formData.employerWebsite}
                  onChange={(e) =>
                    handleInputChange("employerWebsite", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                />
                {errors.employerWebsite && (
                  <div style={{ color: "red" }}>{errors.employerWebsite}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  required
                  label="Job Title"
                  placeholder="Title"
                  // withAsterisk
                  value={formData.jobTitle}
                  onChange={(e) =>
                    handleInputChange("jobTitle", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                />
                {errors.jobTitle && (
                  <div style={{ color: "red" }}>{errors.jobTitle}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <Select
                  size="md"
                  required
                  label="Job Type"
                  placeholder="Full Time"
                  data={["Full Time", "Part Time", "Internship", "Freelance"]}
                  // data={["FULLTIME", "CONTRACTOR", "TEMPORARY"]}
                  // withAsterisk
                  value={formData.jobType}
                  onChange={(value) => handleInputChange("jobType", value)}
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                  clearable
                />
                {errors.jobType && (
                  <div style={{ color: "red" }}>{errors.jobType}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <Select
                  size="md"
                  label="Solution Area"
                  placeholder="Technology"
                  required
                  data={[
                    "All",
                    "Business Application",
                    "Data and AI",
                    "Digital and App Innovation",
                    "Modern Workplace and Surface",
                    "Infrastructure",
                    "Security",
                  ]}
                  // withAsterisk
                  value={formData.solutionArea}
                  onChange={(value) => handleInputChange("solutionArea", value)}
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                  clearable
                />
                {errors.solutionArea && (
                  <div style={{ color: "red" }}>{errors.solutionArea}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  label="Job Location"
                  placeholder="Location"
                  required
                  // withAsterisk
                  value={formData.jobLocation}
                  onChange={(e) =>
                    handleInputChange("jobLocation", e.target.value)
                  }
                  // className="custom-input"
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                />
                {errors.jobLocation && (
                  <div style={{ color: "red" }}>{errors.jobLocation}</div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <Select
                  size="md"
                  label="Workplace Type"
                  required
                  placeholder="On Site"
                  data={["On-Site", "Remote"]}
                  value={formData.workplaceType}
                  onChange={(value) =>
                    handleInputChange("workplaceType", value)
                  }
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                  clearable
                />
                {errors.workplaceType && (
                  <div style={{ color: "red" }}>{errors.workplaceType}</div>
                )}
              </div>
            </Grid.Col>
            {/* <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  label="Salary Range"
                  placeholder="$25,000 - $50,000"
                  // withAsterisk
                  value={formData.salaryRange}
                  onChange={(e) =>
                    handleInputChange("salaryRange", e.target.value)
                  }
                  styles={{
                    ...inputStyles,
                  }}
                />
                {errors.salaryRange && (
                  <div style={{ color: "red" }}>{errors.salaryRange}</div>
                )}
              </div>
            </Grid.Col> */}
            {/* <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Salary Range (per annum)
                </label>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "50%",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <TextInput
                      id="salaryMax"
                      size="md"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        handleInputChange("salaryMin", e.target.value)
                      }
                      styles={{
                        ...inputStyles,
                      }}
                    />
                  </div>

                  <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    -
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "50%",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <TextInput
                      id="salaryMin"
                      size="md"
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        handleInputChange("salaryMax", e.target.value)
                      }
                      styles={{
                        ...inputStyles,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Grid.Col> */}
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <label
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Salary Range (Annual)*
                </label>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px", // Increased from 5px for better spacing
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "45%", // Increased from 40% for better proportions
                    }}
                  >
                    <TextInput
                      id="salaryMax"
                      size="md"
                      required
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        handleInputChange("salaryMin", e.target.value)
                      }
                      styles={{
                        ...inputStyles,
                        input: {
                          ...inputStyles.input,
                          paddingRight: "60px", // Space for currency selector
                        },
                      }}
                    />
                  </div>

                  <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    -
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "45%", // Increased from 40% for better proportions
                    }}
                  >
                    <TextInput
                      id="salaryMin"
                      size="md"
                      required
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        handleInputChange("salaryMax", e.target.value)
                      }
                      styles={{
                        ...inputStyles,
                        input: {
                          ...inputStyles.input,
                          paddingRight: "60px",
                        },
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyItems: "flex-start",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    marginTop: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "55%", // Increased from 40% for better proportions
                    }}
                  >
                    {errors.salaryMin && (
                      <div style={{ color: "red" }}>{errors.salaryMin}</div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "45%",
                      // Increased from 40% for better proportions
                    }}
                  >
                    {errors.salaryMax && (
                      <div style={{ color: "red" }}>{errors.salaryMax}</div>
                    )}
                  </div>
                </div>
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <NumberInput
                  size="md"
                  label="Preferred Years Of Experience"
                  placeholder="Experience"
                  // withAsterisk
                  required
                  min={0}
                  value={formData.experience}
                  onChange={(value) => handleInputChange("experience", value)}
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black",
                    
                    },
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
                  label="Select Application Deadline"
                  required
                  minDate={new Date()}
                  value={formData.deadline}
                  placeholder="Job Application Deadline"
                  className="custom-input"
                  styles={{
                    ...inputStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                  onChange={(value) => handleInputChange("deadline", value)}
                  clearable
                />
                {errors.deadline && (
                  <div style={{ color: "red" }}>{errors.deadline}</div>
                )}
              </div>
            </Grid.Col>

            {/* <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <Textarea
                  label="Skills Required"
                  placeholder="Add Skills"
                  minRows={4}
                  // withAsterisk
                  required
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  styles={{
                    ...textStyles,
                  }}
                />
                {errors.skills && (
                  <div style={{ color: "red" }}>{errors.skills}</div>
                )}
              </div>
            </Grid.Col> */}

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TagsInput
                  size="md"
                  label="Skills Required"
                  placeholder="Press Enter to submit a skill"
                  required
                  value={formData.skills}
                  onChange={(skills) => handleInputChange("skills", skills)}
                  onRemove={(removedSkill) =>
                    handleInputChange(
                      "skills",
                      formData.skills.filter((skill) => skill !== removedSkill)
                    )
                  }
                  styles={{
                    ...textStyles,
                    ...tagStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                />

                {errors.skills && (
                  <div style={{ color: "red" }}>{errors.skills}</div>
                )}
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <Textarea
                  size="md"
                  required
                  label="Job Description"
                  placeholder="Enter The Job Description"
                  minRows={4}
                  // withAsterisk
                  value={formData.jobDescription}
                  onChange={(e) =>
                    handleInputChange("jobDescription", e.target.value)
                  }
                  styles={{
                    ...textStyles,
                    required: {
                      color: "black", // Change the asterisk color
                    },
                  }}
                />
                {errors.jobDescription && (
                  <div style={{ color: "red" }}>{errors.jobDescription}</div>
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
          gap: "16px", // Space between buttons
        }}
      >
        <Button
          type="submit"
          size="md"
          style={{
            backgroundColor: "#004A93", // Correct property name
            color: "white",
          }}
          onClick={handleDraft}
        >
          Save Draft
        </Button>
        <Button
          type="submit"
          size="md"
          style={{
            backgroundColor: "#004A93", // Correct property name
            color: "white",
          }}
          onClick={() => handleSubmit({})}
          // onClick={handleSubmit}
        >
          Make Payment
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style={{
              marginLeft: "6px",
            }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <polyline points="12 8 16 12 12 16" />
          </svg>
        </Button>
        <Modal
          opened={isModalOpen}
          onClose={() => setModalOpen(false)}
          centered
          size="lg"
        >
          <Box ml={40} mr={40} mb={40}>
            <Title
              ta="left"
              order={1}
              className={SFProRounded.className}
              c="blue"
              mb={10}
            >
              {ModalTitle ? ModalTitle : "Success!"}
              {/* {searchParams?.message && searchParams.message == "Success" ? "Success!" : "Fail!"} */}
            </Title>
            <Text className={SFProRounded.className} c="dark" size="md">
              {/* {searchParams?.message && searchParams.message == "Fail"?"Somthing went wrong Please try again!": ModalText?.length?ModalText:"The form has been submitted successfully!"} */}
              {ModalText?.length
                ? ModalText
                : "Your job listing request has been submitted and is pending approval. You will be notified via email when the job goes live."}
            </Text>
            <Button
              style={buttonStyle}
              onClick={() => {
                setModalOpen(false);
                setModalClose(true);
              }}
              mt="md"
            >
              OK
            </Button>
          </Box>
        </Modal>

        <Modal
          opened={warningModal}
          onClose={() => setWarningModal(false)}
          centered
          size="lg"
        >
          <Box ml={40} mr={40} mb={40}>
            <Title
              ta="left"
              order={1}
              className={SFProRounded.className}
              c="blue"
              mb={10}
            >
              Warning!
              {/* {searchParams?.message && searchParams.message == "Success" ? "Success!" : "Fail!"} */}
            </Title>
            <Text className={SFProRounded.className} c="dark" size="md">
              {/* {searchParams?.message && searchParams.message == "Fail"?"Somthing went wrong Please try again!": ModalText?.length?ModalText:"The form has been submitted successfully!"} */}
              {ModalText}
                     </Text>
            <Button
              style={buttonStyle}
              onClick={() => {
                setWarningModal(false);
              }}
              mt="md"
            >
              OK
            </Button>
          </Box>
        </Modal>
      </Group>
    </div>
  );
};

export default EmpJobForm;
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
