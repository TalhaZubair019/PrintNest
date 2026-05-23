import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;

function getTransporter() {
  const globalObj = global as any;
  if (globalObj.__mail_transporter) return globalObj.__mail_transporter;

  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || (process.env.EMAIL_SECURE === "true" ? 465 : 587));
  const secure = process.env.EMAIL_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  globalObj.__mail_transporter = transporter;
  return transporter;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { from, to, subject, html, replyTo } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required email fields: to, subject, html." });
  }

  const sender = from || emailFrom;
  if (!sender) {
    return res.status(500).json({ error: "Missing from address. Set EMAIL_FROM or provide from in request." });
  }

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: sender,
      to,
      subject,
      html,
      replyTo,
    });

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error sending email via Vercel Pages API route (nodemailer):", error);
    return res.status(500).json({ error: error?.message || "Email send failed" });
  }
}
