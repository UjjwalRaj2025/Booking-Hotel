import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

let resend = null;
if (resendApiKey && resendApiKey.trim().length > 0) {
  resend = new Resend(resendApiKey.trim());
  console.log("⚡ Resend API Email Service Initialized");
} else {
  console.log("ℹ️ RESEND_API_KEY not set in server/.env (using Nodemailer SMTP as active transport)");
}

export default resend;
