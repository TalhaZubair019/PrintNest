import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;

function getTransporter() {
  // Cache transporter across invocations when possible
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { from, to, subject, html, replyTo } = body;

  if (!to || !subject || !html) {
    return NextResponse.json({ error: "Missing required email fields: to, subject, html." }, { status: 400 });
  }

  const sender = from || emailFrom;
  if (!sender) {
    return NextResponse.json({ error: "Missing from address. Set EMAIL_FROM or provide from in request." }, { status: 500 });
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

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error sending email via Vercel API route (nodemailer):", error);
    return NextResponse.json({ error: error?.message || "Email send failed" }, { status: 500 });
  }
}
