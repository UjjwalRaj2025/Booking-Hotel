import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER === "smtp-relay.brevo.com" ? process.env.SENDER_EMAIL : (process.env.SMTP_USER || process.env.SENDER_EMAIL),
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration on startup
transporter.verify((error) => {
  if (error) {
    console.warn("⚠️ SMTP Email Transporter Notice:", error.message);
    console.warn("📌 Tip: In Brevo (smtp-relay.brevo.com), set SMTP_USER in server/.env to your Brevo account login email or Brevo SMTP Login ID.");
  } else {
    console.log("📧 SMTP Email Transporter Ready (Connected to Brevo)");
  }
});

export default transporter;