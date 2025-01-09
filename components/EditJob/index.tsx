"use client";
import { useState, useEffect } from "react";
import { SFProRounded } from "@/app/layout";
import {
  Button,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Group,
  Box,
  Grid,
  Modal,
  Text,
  Title,
  Badge,
  TagsInput,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";
import { redirect } from "next/navigation";
import * as Yup from "yup";
import classes from "./EditJob.module.css";

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
  .nullable()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? undefined : Number(originalValue)
    )
    // .required("Salary range is required")
    .min(1, "Minimum salary must be greater than 0"),
  salaryMax: Yup.number()
  .nullable()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? undefined : Number(originalValue)
    )
    // .required("Salary range is required")
    // .test(
    //   "max-salary-test",
    //   "Maximum salary must be greater than minimum salary",
    //   function (value) {
    //     const { salaryMin } = this.parent;
    //     console.log("Current max value:", value);
    //     console.log("Current min value:", salaryMin);
    //     console.log(
    //       "Parent object:",
    //       this.parent,
    //       Number(value),
    //       Number(salaryMin),
    //       Number(value) >= Number(salaryMin)
    //     );
    //     return Number(value) >= Number(salaryMin);
    //   }
    // ),
    .test(
      "max-salary-test",
      "Maximum salary must be greater than minimum salary",
      function (value) {
        const { salaryMin } = this.parent;
        
        // Only validate if salaryMin has a value
        if (!salaryMin) {
          return true;
        }
    
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

type Props = {
  searchParams: {
    message?: string;
  };

  onSubmit: (data: any) => {};
  data: any;
};

const EditJobForm = ({ searchParams, onSubmit, data }: Props) => {
  let formValue = null;
  if (data?.[0]?.application_deadline)
    formValue = new Date(data[0].application_deadline);

  const [formData, setFormData] = useState({
    employerName: data?.[0]?.company_name || "",
    employerWebsite: data?.[0]?.links[0] || "",
    jobTitle: data?.[0]?.job_title || "",
    jobType: data?.[0]?.employment_type || "",
    solutionArea: data?.[0]?.solution_area || "",
    jobLocation: data?.[0]?.job_location || "",
    workplaceType: data?.[0]?.remote
      ? "Remote"
      : data?.[0]?.remote === false
      ? "On-Site"
      : null, // Example for aa default type
    salaryMin: data?.[0]?.salary_min || "",
    salaryMax: data?.[0]?.salary_max || "",
    // salaryRange: data?.[0]?.salary_range || "",
    experience: data?.[0]?.years_of_experience || "",
    deadline: formValue,
    skills: data?.[0]?.skills || [],
    jobDescription: data?.[0]?.job_description || "",
    isDraft: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalClose, setModalClose] = useState(false);
  // const [isSubmit, setIsSubmit] = useState(false);
  const [ModalText, setModalText] = useState("");
  const [ModalTitle, setModalTitle] = useState("");
  useEffect(() => {
    // console.log("Modal1", data, data[0].company_name);

    if (isModalClose) {
      console.log("Modal2");
      return redirect("/my-jobs");
    }
  }, [isModalClose]);
  console.log("Modal45678", data, formData);
  const validateField = async (fieldName: string, value: any) => {
    try {
      console.log("Validation", value);
      if (fieldName === "salaryMax")
        await validationSchema.validateAt(fieldName, {
          [fieldName]: value,
          salaryMin: formData.salaryMin,
        });
      else
        await validationSchema.validateAt(fieldName, {
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
    setFormData((prev) => ({ ...prev, [key]: value }));
    await validateField(key, value);
  };
  // const validateForm = async (): Promise<boolean> => {
  //   try {
  //     // Filter out fields with no data before validation
  //     const filteredFormData = Object.fromEntries(
  //       Object.entries(formData).filter(
  //         ([key, value]) => value !== null && value !== ""
  //       )
  //     );

  //     await validationSchema.validate(filteredFormData, { abortEarly: false });
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
        setErrors(formErrors);
      }
      return false;
    }
  };
  const handleSubmit = async () => {
    const isValid = await validateForm();
    console.log("Success!!!!!!!!!!!!!1111", isValid);
    if (isValid || Object.keys(errors).length === 0) {
      let data = formData;

      let res = await onSubmit(data);
      console.log("Success!!!!!!!!!!!!!", res);
      if (res) {
        console.log("Success", res);
        setModalOpen(true);
      } else {
        setModalOpen(true);
        setModalTitle("Fail!");
        setModalText("Somthing went wrong!");
      }
      console.log("Form submitted successfully1:", data, searchParams);
      console.log("Form submitted successfully:", formData);
    } else {
      console.log("Form has errors:", errors);
    }
  };
  let formattedDeadline = null;
  if (data[0]?.application_deadline) {
    formattedDeadline = new Date(data[0]?.application_deadline)
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(",", "")
      .toUpperCase();
  }

  let formattedCreatedAt = null;
  if (data[0]?.created_at) {
    formattedCreatedAt = new Date(data[0]?.created_at)
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(",", "")
      .toUpperCase();
  }
  return (
    <div>
      <Box
        mx="auto"
        p="lg"
        style={{
          maxWidth: "89%",
          borderRadius: 17,
          backgroundColor: "white",
          // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "0.9px solid #D6D6D6",
        }}
      >
        <div className={classes.header}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div>
              {formattedCreatedAt && (
                <>
                  <div style={{ fontSize: "10px", color: "blue" }}>
                    Posting Date
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                      fontWeight: 400,
                      border: "1px solid blue",
                      borderRadius: 50,
                      color: "blue",
                      padding: "1px 5px",
                    }}
                  >
                    {formattedCreatedAt}
                  </div>
                </>
              )}
            </div>

            <div>
              {formattedDeadline && (
                <>
                  <div style={{ fontSize: "10px", color: "red" }}>
                    Expiray Date
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                      fontWeight: 400,
                      border: "1px solid red",
                      borderRadius: 50,
                      color: "red",
                      padding: "1px 5px",
                    }}
                  >
                    {formattedDeadline}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <Group align="center">
              <Text
                size="lg"
                color="black"
                style={{
                  fontWeight: "bold",
                }}
              >
                $4.0k{" "}
                <Text component="span" size="xs" color="gray">
                  Paid
                </Text>
              </Text>
              <Badge
                color="#004A93"
                size="lg"
                radius="xl"
                style={{
                  padding: "23px",
                  fontSize: "18px",
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0.5,
                }}
              >
                798 Applicants
              </Badge>
            </Group>
          </div>
        </div>

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
                  required
                  label="Solution Area"
                  placeholder="Technology"
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
                  required
                  label="Job Location"
                  placeholder="Location"
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
                  required
                  label="Workplace Type"
                  placeholder="On Site"
                  data={["On-Site", "Remote"]}
                  // withAsterisk
                  // required
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
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <label
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Salary Range (Annual)
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
                      // rightSection={
                      //   <Select
                      //     data={["$", "₹"]}
                      //     defaultValue="$"
                      //     styles={{
                      //       input: {
                      //         border: 0,
                      //         minHeight: "30px",
                      //         width: "50px", // Fixed width for currency selector
                      //       },
                      //       wrapper: {
                      //         paddingRight: "8px",
                      //       },
                      //     }}
                      //     onChange={(value) =>
                      //       handleInputChange("currency", value)
                      //     }
                      //   />
                      // }
                      rightSection={
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          $
                        </div>
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
                      // rightSection={
                      //   <Select
                      //     data={["$", "₹"]}
                      //     defaultValue="$"
                      //     styles={{
                      //       input: {
                      //         border: 0,
                      //         minHeight: "30px",
                      //         width: "50px",
                      //       },
                      //       wrapper: {
                      //         paddingRight: "8px",
                      //       },
                      //     }}
                      //     onChange={(value) =>
                      //       handleInputChange("currency", value)
                      //     }
                      //   />
                      // }
                      onChange={(e) =>
                        handleInputChange("salaryMax", e.target.value)
                      }
                      rightSection={
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          $
                        </div>
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
                      color: "black", // Change the asterisk color
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
                  required
                  label="Select Application Deadline"
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
                      formData.skills.filter(
                        (skill: string) => skill !== removedSkill
                      )
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
                  label="Job Description"
                  required
                  placeholder="Enter Job Description"
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
          gap: "16px",
        }}
      >
        <Button
          type="submit"
          size="md"
          style={{
            backgroundColor: "#004A93",
            color: "white",
          }}
          onClick={handleSubmit}
        >
          Update Job
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
                : "The form has been updated successfully!"}
            </Text>
            <Button
              style={buttonStyle}
              onClick={() => {
                setModalOpen(false);
                setModalClose(true);
              }}
              mt="md"
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Group>
    </div>
  );
};

export default EditJobForm;

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
const inputStyles = {
  input: {
    borderRadius: "9.1px",
    border: "0.91px solid #D6D6D6",
    minHeight: "48px",
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
const tagStyles = {
  pill: {
    backgroundColor: "white",
    color: "#004A93",
    margin: "2px",
    borderRadius: "10px",
    border: "1px solid #004A93",
  },
};
