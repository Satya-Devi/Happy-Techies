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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { redirect ,useRouter} from "next/navigation";

import * as Yup from "yup";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  employersName: Yup.string().required("Employer's name is required"),
  companyName: Yup.string().required("Company name is required"),
  contactNumber: Yup.string()
    .matches(/^\d{10,15}$/, "Contact number must be between 10-15 digits")
    .required("Contact number is required"),
  billingAddress: Yup.string().required("Billing address is required"),
  cardholderName: Yup.string().required("Cardholder name is required"),
  cardNumber: Yup.string()
    .matches(/^\d{16}$/, "Card number must be 16 digits")
    .required("Card number is required"),
  expirationDate: Yup.date()
    .required("Expiration date is required")
    .min(new Date(), "Expiration date must be in the future"),
  cvc: Yup.string()
    .matches(/^\d{3}$/, "CVC must be 3 digits")
    .required("CVC is required"),
  country: Yup.string().required("Country is required"),
});

const PaymentForm = () =>
  // { onSubmit }: { onSubmit: (data: any) => void }
  {
    const [formData, setFormData] = useState({
      employersName: "",
      companyName: "",
      contactNumber: "",
      billingAddress: "",
      cardholderName: "",
      cardNumber: "",
      expirationDate: "",
      cvc: "",
      country: "",
    });
 
  const [warningModal, setWarningModal] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [modalMessage, setModalMessage] = useState("");
    const router=useRouter()
    const handleInputChange = (key: string, value: any) => {
      console.log("handle", key, value, formData);
      setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const validateForm = async (): Promise<boolean> => {
      try {
        // Filter out fields with no data before validation
        const filteredFormData = Object.fromEntries(
          Object.entries(formData).filter(
            ([key, value]) => value !== null && value !== ""
          )
        );

        await validationSchema.validate(filteredFormData, {
          abortEarly: false,
        });
        setErrors({});
        return true;
      } catch (validationErrors) {
        if (validationErrors instanceof Yup.ValidationError) {
          const formErrors: { [key: string]: string } = {};
          validationErrors.inner.forEach((error) => {
            if (error.path) {
              formErrors[error.path] = error.message;
            }
          });
          setErrors(formErrors);
        }
        return false;
      }
    };

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            maxWidth: "100%",
            backgroundColor: "white",
            gap: "12px",
          }}
        >
          {/* Summary Section */}
          <div
            style={{
              width: "20%",
              borderRadius: "8px",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <Text size="lg">Job Posting</Text>
              <Text size="lg">$100.00</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <Text size="lg">Sales Tax</Text>
              <Text size="lg">$15.00</Text>
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
                $115.00
              </Text>
            </div>
          </div>

          {/* Payment Form */}
          <div
            style={{
              width: "70%",
              backgroundColor: "#F7FAFC",
              borderRadius: "8px",
              padding: "2rem",
              // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <form>
              <Grid gutter={20}>
                {/* Employer's Name */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Employer's Name"
                    placeholder="Enter employer's name"
                    value={formData.employersName}
                    onChange={(e) =>
                      handleInputChange("employersName", e.target.value)
                    }
                  />
                  {errors.employersName && (
                    <Text color="red" size="sm">
                      {errors.employersName}
                    </Text>
                  )}
                </Grid.Col>

                {/* Cardholder's Name */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Cardholder's Name"
                    placeholder="Enter cardholder's name"
                    value={formData.cardholderName}
                    onChange={(e) =>
                      handleInputChange("cardholderName", e.target.value)
                    }
                  />
                  {errors.cardholderName && (
                    <Text color="red" size="sm">
                      {errors.cardholderName}
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
                    label="Card Number"
                    placeholder="1234 5678 9101 1121"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    rightSection={
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          marginRight: "70px",
                        }}
                      >
                        <img
                          src="/images/MasterCard.png"
                          alt="mastercard"
                          width={25}
                          height={18}
                        />
                        <img
                          src="/images/Visa.png"
                          alt="visa"
                          width={25}
                          height={19}
                        />
                        <img
                          src="/images/Amex.png"
                          alt="amex"
                          width={25}
                          height={18}
                        />
                      </div>
                    }
                  />
                  {errors.cardNumber && (
                    <Text color="red" size="sm">
                      {errors.cardNumber}
                    </Text>
                  )}
                </Grid.Col>

                {/* Contact Number */}
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Contact Number"
                    placeholder="Enter contact number"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                  />
                  {errors.contactNumber && (
                    <Text color="red" size="sm">
                      {errors.contactNumber}
                    </Text>
                  )}
                </Grid.Col>

                {/* Expiration Date */}
                <Grid.Col span={6}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        size="md"
                        label="Expiration Date"
                        placeholder="MM / YY"
                        value={formData.expirationDate}
                        onChange={(e) =>
                          handleInputChange("expirationDate", e.target.value)
                        }
                      />
                      {errors.expirationDate && (
                        <Text color="red" size="sm">
                          {errors.expirationDate}
                        </Text>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <TextInput
                        size="md"
                        label="CVC"
                        placeholder="Enter CVC"
                        value={formData.cvc}
                        onChange={(value) => handleInputChange("cvc", value)}
                        rightSection={
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              marginRight: "10px",
                            }}
                          >
                            <img
                              src="/images/CVC.png"
                              alt="mastercard"
                              width={25}
                              height={18}
                            />
                          </div>
                        }
                      />
                      {errors.cvc && (
                        <Text color="red" size="sm">
                          {errors.cvc}
                        </Text>
                      )}
                    </div>
                  </div>
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
               onClick={() => router.push("/post-job")}
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
              onClick={() => setWarningModal(true)}
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
                            Your job listing request has been submitted and is pending for approval. You will be notified via email when the job goes live.
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
