// pages/page.tsx
import { Hero } from "@/components/Hero/Hero";
import ContactUsForm from "@/components/ContactUsForm/page";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import  {createTransport} from "nodemailer";


export default async function Page() {
  
  const handleSubmit = async ({ name, email, message }: {
    name: string,
    email: string,
    message: string
  }) => {
    "use server";

    const origin = headers().get("origin");
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIl_APP_EMAIL,
        pass: process.env.GMAIL_APP_PASS,
      },
      tls: {
        ciphers:'SSLv3'
    }
    });

    const mailOptions = {
      from: process.env.GMAIl_APP_EMAIL,
      to: process.env.GMAIL_APP_MAIL_TO,
      subject: "New Contact Form Submission",
      html: `<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .field {
      margin-bottom: 10px;
    }
    .label {
      font-weight: bold;
    }
    .message {
      white-space: pre-line;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">New Contact Form Submission</div>

    <div class="field">
      <span class="label">Name:</span> ${name}
    </div>

    <div class="field">
      <span class="label">Email:</span> ${email}
    </div>

    <div class="field">
      <span class="label">Message:</span>
      <div class="message">${message}</div>
    </div>

    <p>Best regards,<br> Happy Techies</p>
  </div>
</body>
</html>
`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
    return redirect("/contact-us");
  };
  return (
    <>
      <Hero
        title="Contact Us"
        subtitle="We would love to hear from you"
        align="center"
        titleStyles={{
          marginLeft: "30px",
        }}
        subtitleStyles={{
          marginLeft: "30px",
        }}
        backButtonStyles={{marginLeft:"20px"}}
      />
      <ContactUsForm leftMargin="50px" onSubmit={handleSubmit}/>
    </>
  );
}
