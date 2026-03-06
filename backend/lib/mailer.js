const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "142.251.127.108",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false, servername: "smtp.gmail.com" },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});

module.exports = { transporter };
