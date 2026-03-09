const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Create a sendMail-compatible wrapper around Resend API
// so existing route code (transporter.sendMail({...})) works unchanged
const transporter = {
  sendMail: async (options) => {
    const fromEmail = process.env.EMAIL_USER || "onboarding@resend.dev";
    // Resend requires "from" in format: "Name <email>" with a verified domain
    // Using onboarding@resend.dev as sender (works without domain verification)
    // and setting reply-to to the actual store email
    const result = await resend.emails.send({
      from: `PrintNest <onboarding@resend.dev>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || fromEmail,
    });

    if (result.error) {
      console.error("Resend API error:", result.error);
      throw new Error(result.error.message);
    }

    console.log("Email sent via Resend:", result.data?.id);
    return result;
  },
};

module.exports = { transporter };
