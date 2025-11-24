// src/utils/sendEmail.js

import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  const email = { ...options, from: SMTP_FROM };
  
  try {
    await transporter.sendMail(email);
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};