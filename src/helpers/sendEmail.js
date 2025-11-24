// helpers/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const sendEmail = async (data) => {
  const email = { ...data, from: SMTP_FROM };
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;