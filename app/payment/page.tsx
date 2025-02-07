//'use client';
import { Hero } from "@/components/Hero/Hero";
import PaymentForm from "@/components/Payment/Payment";
//import { useState } from "react";
export default function PaymentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // const [showPayment, setShowPayment] = useState(false);
  const setShowPayments = () => {
    console.log("setShowPayment");
  };

  const handleSubmit = (data: any): void => {
    // Implementation goes here
  };

  return (
    <div>
      <Hero
        title="Payment"
        subtitle=""
        align="center"
        role="Employer"
        page="post-job"
      />
      <PaymentForm
        jobId={searchParams?.jobId}
        // setShowPayments={setShowPayments}
        // handleSubmit={handleSubmit}
      />
    </div>
  );
}
