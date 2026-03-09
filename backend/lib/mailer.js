const fetch = require("node-fetch");

// Brevo (formerly Sendinblue) - Free HTTPS email API
// 300 emails/day, no domain verification needed, just verify sender email
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const transporter = {
  sendMail: async (options) => {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }

    // Extract sender name and email from "Name <email>" format
    let senderName = "PrintNest";
    let senderEmail = process.env.EMAIL_USER;
    if (options.from) {
      const match = options.from.match(/"?([^"<]*)"?\s*<?([^>]*)>?/);
      if (match) {
        senderName = match[1]?.trim() || "PrintNest";
        senderEmail = match[2]?.trim() || process.env.EMAIL_USER;
      }
    }

    const toList = Array.isArray(options.to)
      ? options.to.map((email) => ({ email }))
      : [{ email: options.to }];

    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: toList,
      subject: options.subject,
      htmlContent: options.html,
    };

    if (options.replyTo) {
      payload.replyTo = { email: options.replyTo };
    }

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Brevo API error:", errorData);
      throw new Error(
        errorData.message || `Brevo API failed with status ${response.status}`,
      );
    }

    const result = await response.json();
    console.log("Email sent via Brevo:", result.messageId);
    return result;
  },
};

module.exports = { transporter };
