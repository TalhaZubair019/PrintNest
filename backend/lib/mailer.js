const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Primary: Gmail SMTP on port 587 (STARTTLS) - works on more cloud platforms
const smtpTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  family: 4,
});

// Wrapper that tries SMTP first, falls back to Resend
const transporter = {
  sendMail: async (options) => {
    // Try Gmail SMTP first
    try {
      const result = await smtpTransporter.sendMail(options);
      console.log("Email sent via SMTP:", result.messageId);
      return result;
    } catch (smtpError) {
      console.warn("SMTP failed, trying Resend:", smtpError.message);
    }

    // Fallback: Resend API
    try {
      const result = await resend.emails.send({
        from: `PrintNest <onboarding@resend.dev>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo || process.env.EMAIL_USER,
      });

      if (result.error) {
        console.error("Resend API error:", result.error);
        throw new Error(result.error.message);
      }

      console.log("Email sent via Resend:", result.data?.id);
      return result;
    } catch (resendError) {
      console.error("Resend also failed:", resendError.message);
      throw resendError;
    }
  },
};

module.exports = { transporter };
