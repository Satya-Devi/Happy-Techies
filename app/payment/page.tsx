import { Hero } from "@/components/Hero/Hero";
import PaymentForm from "@/components/Payment/Payment";
export default function PaymentPage() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
      }}
    >
      <Hero
        title="Payment"
        subtitle=""
        align="center"
        role="Employer"
        page="post-job"
      />
      <PaymentForm />
    </div>
  );
}
