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
        /^(?:http:\/\/|https:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)(?:\.[a-z]{2,})(?:\/[\w-./?%&=])?$/i;
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

    .min(1, "Minimum salary must be greater than 0"),
  salaryMax: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? undefined : Number(originalValue)
    )
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
  experience: Yup.number()
    .required("Years of experience is required")
    .typeError("Years of experience is required")
    .min(0, "Experience must be at least 0 years"),

  deadline: Yup.date()
    .min(new Date(), "Deadline must not be less than today")
    .required("Deadline is required"),
  skills: Yup.array()
    .of(Yup.string().required("Each skill is required"))
    .min(1, "At least one skill is required")
    .required("Skills are required"),
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
        /^(?:http:\/\/|https:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)(?:\.[a-z]{2,})(?:\/[\w-./?%&=])?$/i;
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

const ApplicantForm = () => {
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
  const handleInputChange = (key: string, value: any) => {
    console.log("handle", key, value, formData);
    
    if (key === "companyLogo" && value) {
      setImageFile(value);
    }
  
    setFormData((prev) => ({ ...prev, [key]: value }));
  
    // Call validation without awaiting
    validateField(key, value).then(() => {
      console.log(`Validation completed for ${key}`);
    }).catch((error) => {
      console.error(`Validation failed for ${key}:`, error);
    });
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
                  label="Phone Number"
                  placeholder="Enter your phone number"
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
                <NumberInput
                  size="md"
                  label="Experience"
                  placeholder="Enter Number of Years"
                  // withAsterisk
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
                  label="Available Start Date"
                  required
                  minDate={new Date()}
                  value={formData.deadline}
                  placeholder="DD/MM/YYYY"
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

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <div>
                <TextInput
                  size="md"
                  label="Email"
                  placeholder="Enter your email"
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
                <TextInput
                  size="md"
                  label="Current Employment Status"
                  placeholder="Employed"
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
                <TextInput
                  size="md"
                  label="Linkedin Profile"
                  placeholder="Linkedin Profile"
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
                <TextInput
                  size="md"
                  label="Certifications"
                  placeholder="Employed"
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
                <TagsInput
                  size="md"
                  label="Upload Resume"
                  placeholder="Drop Files here or Browse"
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
                  label="Upload Cover Letter"
                  placeholder="Drop Files here or Browse"
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
      {/* <Group
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
            backgroundColor: "#004A93", // Correct property name
            color: "white",
            width: 150,
          }}
          // onClick={() => handleSubmit({})}
          // onClick={handleSubmit}
          // style={{
          //   backgroundColor: "#004A93", // Correct property name
          //   color: "white",
          // }}
        >
          Apply
        </Button>
      </Group> */}
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