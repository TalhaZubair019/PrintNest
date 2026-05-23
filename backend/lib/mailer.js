const nodemailer = require("nodemailer");

const EMAIL_ROUTE_URL =
  process.env.EMAIL_ROUTE_URL ||
  process.env.FRONTEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  null;

function normalizeEmailRouteUrl(url) {
  const trimmed = url.trim().replace(/\/$/, "");
  return trimmed.endsWith("/api/email") ? trimmed : `${trimmed}/api/email`;
}

const EMAIL_API_ENDPOINT = EMAIL_ROUTE_URL
  ? normalizeEmailRouteUrl(EMAIL_ROUTE_URL)
  : null;

const smtpHost = process.env.EMAIL_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.EMAIL_PORT || "465");
const smtpSecure =
  process.env.EMAIL_SECURE === "true" || smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
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

function shouldUseEmailRoute() {
  return !!EMAIL_API_ENDPOINT;
}

async function sendMail(mailOptions) {
  if (shouldUseEmailRoute()) {
    console.debug("Mailer: sending via email route", EMAIL_API_ENDPOINT);
    return sendMailViaEmailRoute(mailOptions);
  }

  console.debug("Mailer: sending via SMTP", { smtpHost, smtpPort, smtpSecure });
  return transporter.sendMail(mailOptions);
}

async function sendMailViaEmailRoute(mailOptions) {
  const { from, to, subject, html, replyTo } = mailOptions;

  if (!to || !subject || !html) {
    throw new Error("Missing required email fields: to, subject, html.");
  }

  if (!EMAIL_API_ENDPOINT) {
    throw new Error(
      "EMAIL_ROUTE_URL is not configured. Set EMAIL_ROUTE_URL in the environment when USE_VERCEL_EMAIL_ROUTE=true.",
    );
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
