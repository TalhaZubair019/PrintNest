const nodemailer = require("nodemailer");

/**
 * Initialize Nodemailer with Gmail SMTP.
 * Note: Requires a "Gmail App Password" (set in EMAIL_PASS).
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps with SSL issues on some cloud platforms
  },
  debug: true, // Enable for detailed logs
  logger: true, // Log to console
});

// Maintains compatibility with existing code structure
// Example call: await transporter.sendMail(options)
module.exports = { transporter };
