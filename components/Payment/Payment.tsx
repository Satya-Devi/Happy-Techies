"use client";
import { useState, useEffect } from "react";
import { SFProRounded } from "@/app/layout";
import { insertPaymentData } from "@/app/payment/action";
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
  Card,
  Badge,
  List,
  ThemeIcon,
  Input,
  ComboboxItem,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { IconCheck, IconHelpCircle, IconEdit } from "@tabler/icons-react";
import styles from "./Payment.module.css";
import * as Yup from "yup";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  employerName: Yup.string()
    .required("Employer's name is required")
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
  companyName: Yup.string()
    .required("Company name is required")
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Employer Name cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(2, "Company Name must be at least 2 characters long")
    .max(50, "Company Name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Company Name can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),
  contactNumber: Yup.string()
    // .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid phone number") // Validates phone number format
    // .required("Contact number is required"),
    .matches(
      /^(\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Invalid U.S. phone number"
    )
    .required("Phone number is required"),
  billingAddress: Yup.string()
    .required("Billing address is required")
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Billing Address cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(5, "Billing Address must be at least 5 characters long"),
  emailAddress: Yup.string()
    .email("Please enter a valid email address") // Validates that the input is a proper email format
    .required("Employer email is required"),
  country: Yup.string().required("Country is required"),
});
const instantValidationSchema = Yup.object().shape({
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
  companyName: Yup.string()
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
    .min(2, "Company Name must be at least 2 characters long")
    .max(50, "Company Name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[-'\s][a-zA-Z0-9]+)*$/,
      "Company Name can only include letters, numbers, spaces, hyphens, and apostrophes"
    ),

  contactNumber: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    // .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid phone number"), // Validates phone number format
    .matches(
      /^(\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Invalid U.S. phone number"
    ),
  // .required("Phone number is required"),
  billingAddress: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test(
      "no-spaces-only",
      "Billing Address cannot contain only spaces",
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    )
    .min(5, "Billing Address must be at least 5 characters long"),
  emailAddress: Yup.string()
    .nullable()
    .email("Please enter a valid email address"), // Validates that the input is a proper email format
  country: Yup.string().nullable(),
});
interface PaymentFormProps {
  setShowPayments?: () => void;
  handleSubmit?: (data: any) => void;
  payment?: boolean;
  jobId?: string;
}
const PaymentForm = ({
  setShowPayments = () => {},
  handleSubmit = () => {},
  payment,
  jobId,
}: // setShowPayments, handleSubmit
PaymentFormProps) =>
  // { onSubmit }: { onSubmit: (data: any) => void }
  {
    console.log("JOBBID", jobId);
    const searchParams = useSearchParams();
    const action = payment ? "payment" : searchParams.get("action");
    const [formData, setFormData] = useState({
      employerName: "",
      companyName: "",
      contactNumber: "",
      billingAddress: "",
      emailAddress: "",
      country: "",
    });
    const [empId, setEmpId] = useState(null);
    const [orderId, setOrderId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [warningModal, setWarningModal] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [modalMessage, setModalMessage] = useState("");
    const router = useRouter();
    // const handleInputChange = (key: string, value: any) => {
    //   console.log("handle", key, value, formData);
    //   setFormData((prev) => ({ ...prev, [key]: value }));
    // };

    const validateForm = (): Promise<boolean> => {
      return validationSchema
        .validate(formData, { abortEarly: false })
        .then(() => {
          console.log("NOOOOOO ERRRRRORRRRS");
          setErrors({});
          return true;
        })
        .catch((validationErrors) => {
          console.log("ERROR: " + validationErrors);
          if (validationErrors instanceof Yup.ValidationError) {
            const formErrors: { [key: string]: string } = {};
            validationErrors.inner.forEach((error) => {
              formErrors[error.path || ""] = error.message;
            });
            console.log("formErrorssss", formErrors);
            setErrors(formErrors);
          }
          return false;
        });
    };
    const handleContinue = () => {
      //handleSubmit({});
      let isValidPromise = validateForm();
      isValidPromise.then((isValid) => {
        console.log("isValid&&&&&&&&&&&", isValid, errors);
        if (isValid) {
          console.log("formmmData", formData);

          insertData();
        } else {
          console.log("Form has errors:", errors);
        }
      });

      // setWarningModal(true);
    };
    const insertData = () => {
      setIsLoading(true);

      insertPaymentData({ data: formData, jobId: jobId })
        .then((result: any) => {
          if (result && result.status) {
            setOrderId(result.id);
            setEmpId(result.empId);
          }
        })
        .catch((error) => {
          console.error("Error fetching drafts:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    // const validateForm = (): Promise<boolean> => {
    //   return new Promise((resolve, reject) => {
    //     // Filter out fields with no data before validation
    //     const filteredFormData = Object.fromEntries(
    //       Object.entries(formData).filter(
    //         ([key, value]) => value !== null && value !== ""
    //       )
    //     );

    //     validationSchema
    //       .validate(filteredFormData, {
    //         abortEarly: false,
    //       })
    //       .then(() => {
    //         setErrors({}); // Clear any previous errors
    //         resolve(true); // Resolve as valid
    //       })
    //       .catch((validationErrors) => {
    //         if (validationErrors instanceof Yup.ValidationError) {
    //           const formErrors: { [key: string]: string } = {};
    //           validationErrors.inner.forEach((error) => {
    //             if (error.path) {
    //               formErrors[error.path] = error.message;
    //             }
    //           });
    //           setErrors(formErrors); // Set the errors
    //         }
    //         reject(false); // Reject as invalid
    //       });
    //   });
    // };
    const validateField = (fieldName: string, value: any) => {
      console.log("Validation", value);
      let validationPromise;
      validationPromise = instantValidationSchema.validateAt(fieldName, {
        [fieldName]: value,
      });
      return validationPromise
        .then(() => {
          setErrors((prev) => {
            const { [fieldName]: _, ...rest } = prev; // Remove the field from the errors object
            return rest; // Return the new object without the specified field
          });
        })
        .catch((error) => {
          if (error instanceof Yup.ValidationError) {
            setErrors((prev) => ({ ...prev, [fieldName]: error.message }));
          }
        });
    };
    const handleInputChange = (key: string, value: any) => {
      console.log("handle", key, value, formData);
      setFormData((prev) => ({ ...prev, [key]: value }));
      console.log("handle", key, value);
      // if(key=='contactNumber' && value!=null){
      validateField(key, value)
        .then(() => {
          console.log(`Validation succeeded for ${key}`);
        })
        .catch((error) => {
          console.error(`Validation failed for ${key}:`, error);
        });
      // }
    };
    console.log("errors", errors);
    const [promoteModalOpened, setPromoteModalOpened] = useState(false);

    const handlePromoteJob = () => {
      setPromoteModalOpened(false);
    };

    const [budgetType, setBudgetType] = useState(null as string | null);
    const [budget, setBudget] = useState("");

    const [price, setPrice] = useState(0);
    const [tax, setTax] = useState(10);
    const [totalPrice, setTotalPrice] = useState(
      action == "payment" ? 110 : 10
    );
    useEffect(() => {
      if (action == "payment") {
        setTotalPrice(100 + price + tax);
      } else {
        setTotalPrice(price + tax);
      }
    }, [tax, price]);
    const handleCancel = () => {
      if (action == "payment") {
        setShowPayments();
      } else {
        router.push("/my-jobs?nav_from=payment");
      }
    };
    return (
      <>
        <Modal
          opened={promoteModalOpened}
          onClose={() => setPromoteModalOpened(false)}
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
              Promote Job
            </Title>
            <Text className={SFProRounded.className} c="dark" size="md" mb={20}>
              Customize your job promotion to boost visibility and reach more
              candidates. Choose a budget type and set your desired amount to
              see estimated results.
            </Text>

            {/* Budget Selection Section */}
            <Group align="flex-start" mb={20}>
              <div>
                <Text fw={500} mb={5}>
                  Select Budget Type
                </Text>
                <Select
                  checkIconPosition="right"
                  value={budgetType}
                  clearable
                  onChange={(value) =>
                    value !== null &&
                    value !== undefined &&
                    setBudgetType(value)
                  }
                  data={[
                    { value: "oneday", label: "One Day" },
                    { value: "oneweek", label: "One Week" },
                    { value: "onemonth", label: "One Month" },
                    // { value: "total", label: "Total" },
                  ]}
                  placeholder="Select budget type"
                />
              </div>
            </Group>

            {/* Features List */}
            <Text fw={500} mb={10}>
              Features of Promoted Job:
            </Text>
            <List spacing="xs" size="sm" mb={20}>
              <List.Item
                icon={
                  <ThemeIcon color="#004A93" size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                Shown at the top of search results
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="#004A93" size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                Top placement in job recommendations
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="#004A93" size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                Instant mobile alerts to qualified candidates
              </List.Item>
            </List>

            {/* Save and Update Button */}
            <Button
              fullWidth
              style={buttonStyle}
              onClick={() => {
                if (budgetType === "oneday") {
                  // setTotalPrice(60+price);
                  setPrice(10);
                  setTax(10);
                } else if (budgetType === "oneweek") {
                  // setTotalPrice(30+price);
                  setPrice(30);
                  setTax(10);
                } else if (budgetType === "onemonth") {
                  // setTotalPrice(action=="payment"?110:10);
                  setPrice(100);
                  setTax(10);
                }
                // else if (budgetType === "total") {
                //   setPrice(10000);
                //   setTax(10);
                //   setTotalPrice(10010);
                // }
                setPromoteModalOpened(false);
              }}
            >
              Save and Update Price
            </Button>
          </Box>
        </Modal>

        <div className={styles.container}>
          {/* Summary Section */}
          <div className={styles.summarySection}>
            {action === "payment" ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text
                    size="lg"
                    c="#004a93"
                    fw={700}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 3,
                    }}
                    onClick={() => setPromoteModalOpened(true)}
                  >
                    Promote Job <IconEdit stroke={2} />
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text size="lg">Job Posting</Text>
                  <Text size="lg">100$</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text size="lg">Promoting Cost</Text>
                  <Text size="lg">{price}$</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text size="lg">Sales Tax</Text>
                  <Text size="lg">{tax}$</Text>
                </div>
                <hr
                  style={{
                    margin: "1rem 0",
                    border: "none",
                    borderTop: "1px solid #e9ecef",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text size="xl" fw={500}>
                    Total
                  </Text>
                  <Text size="xl" fw={600}>
                    {/* {action=="payment"?(price+tax+100):(price+tax)} */}
                    {totalPrice}$
                  </Text>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text
                    size="lg"
                    c="#004a93"
                    fw={700}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 3,
                    }}
                    onClick={() => setPromoteModalOpened(true)}
                  >
                    Promote Job <IconEdit stroke={2} />
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text size="lg">Promoting cost</Text>
                  <Text size="lg">{price}$</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text size="lg">Sales Tax</Text>
                  <Text size="lg">{tax}$</Text>
                </div>
                <hr
                  style={{
                    margin: "1rem 0",
                    border: "none",
                    borderTop: "1px solid #e9ecef",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text size="xl" fw={500}>
                    Total
                  </Text>
                  <Text size="xl" fw={600}>
                    {totalPrice}$
                  </Text>
                </div>
              </>
            )}
          </div>

          {/* Payment Form */}
          <div className={styles.formSection}>
            <form>
              <Grid gutter={20}>
                {/* Employer's Name */}
                {/* {jobId} */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Employer's Name"
                    placeholder="Enter employer's name"
                    value={formData.employerName}
                    onChange={(e) =>
                      handleInputChange("employerName", e.target.value)
                    }
                  />
                  {errors.employerName && (
                    <Text color="red" size="sm">
                      {errors.employerName}
                    </Text>
                  )}
                </Grid.Col>

                {/* Cardholder's Name */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Employer's Email"
                    placeholder="Enter Email Address"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      handleInputChange("emailAddress", e.target.value)
                    }
                  />
                  {errors.emailAddress && (
                    <Text color="red" size="sm">
                      {errors.emailAddress}
                    </Text>
                  )}
                </Grid.Col>

                {/* Company Name */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Company Name"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                  />
                  {errors.companyName && (
                    <Text color="red" size="sm">
                      {errors.companyName}
                    </Text>
                  )}
                </Grid.Col>

                {/* Card Number */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Contact Number"
                    placeholder="Enter contact number"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                    rightSection={
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          marginRight: "70px",
                        }}
                      ></div>
                    }
                  />
                  {errors.contactNumber && (
                    <Text color="red" size="sm">
                      {errors.contactNumber}
                    </Text>
                  )}
                </Grid.Col>

                {/* Billing Address */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Billing Address"
                    placeholder="Enter billing address"
                    value={formData.billingAddress}
                    onChange={(e) =>
                      handleInputChange("billingAddress", e.target.value)
                    }
                  />
                  {errors.billingAddress && (
                    <Text color="red" size="sm">
                      {errors.billingAddress}
                    </Text>
                  )}
                </Grid.Col>

                {/* Country */}
                <Grid.Col span={6}>
                  <Select
                    size="md"
                    label="Country"
                    placeholder="Select a country"
                    data={[
                      "United States",
                      "Canada",
                      "United Kingdom",
                      "India",
                      "Australia",
                    ]}
                    value={formData.country}
                    onChange={(value) => handleInputChange("country", value)}
                  />
                  {errors.country && (
                    <Text color="red" size="sm">
                      {errors.country}
                    </Text>
                  )}
                </Grid.Col>
              </Grid>
            </form>
            <Group
              mt="lg"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px", // Space between buttons
              }}
            >
              <Button
                // onClick={() => router.push("/post-job")}
                // onClick={() => setShowPayment(false)}
                onClick={handleCancel}
                type="submit"
                size="md"
                style={{
                  border: "2px solid #004A93", // Correct property name
                  backgroundColor: "#F7FAFC", // Correct property name
                  color: "#004A93",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleContinue()}
                type="submit"
                size="md"
                style={{
                  backgroundColor: "#004A93", // Correct property name
                  color: "white",
                }}
              >
                Continue
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
                    Success
                    {/* {searchParams?.message && searchParams.message == "Success" ? "Success!" : "Fail!"} */}
                  </Title>
                  <Text className={SFProRounded.className} c="dark" size="md">
                    {/* {searchParams?.message && searchParams.message == "Fail"?"Somthing went wrong Please try again!": ModalText?.length?ModalText:"The form has been submitted successfully!"} */}
                    Your job listing request has been submitted and is pending
                    for approval. You will be notified via email when the job
                    goes live.
                  </Text>
                  <Button
                    style={buttonStyle}
                    onClick={() => {
                      setWarningModal(false);
                      router.push("/my-jobs");
                    }}
                    mt="md"
                  >
                    OK
                  </Button>
                </Box>
              </Modal>
            </Group>
          </div>
        </div>
      </>
    );
  };
export default PaymentForm;

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
