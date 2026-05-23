const nodemailer = require("nodemailer");

const EMAIL_ROUTE_URL =
  process.env.EMAIL_ROUTE_URL || process.env.FRONTEND_URL || "http://localhost:3000";
const EMAIL_API_ENDPOINT = `${EMAIL_ROUTE_URL.replace(/\/$/, "")}/api/email`;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
  greetingTimeout: 10000,
  debug: true,
  logger: true,
});

async function sendMail(mailOptions) {
  if (process.env.USE_VERCEL_EMAIL_ROUTE === "true" || process.env.RESEND_API_KEY) {
    return sendMailViaEmailRoute(mailOptions);
  }

  return transporter.sendMail(mailOptions);
}

async function sendMailViaEmailRoute(mailOptions) {
  const { from, to, subject, html, replyTo } = mailOptions;

  if (!to || !subject || !html) {
    throw new Error("Missing required email fields: to, subject, html.");
  }

  const response = await fetch(EMAIL_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, replyTo }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email route failed: ${response.status} ${text}`);
  }

  return response.json();
}

module.exports = { transporter, sendMail };
