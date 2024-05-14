// pages/api/sendEmail.js

import nodemailer from "nodemailer";

export default async function sendEmailNotification(message: string) {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    transporter.sendMail({
      from: process.env.SENDER_MAIL,
      to: process.env.RECEIVER_MAIL,
      subject: "Urgent!!! New Conversation on Twak",
      text: message,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
