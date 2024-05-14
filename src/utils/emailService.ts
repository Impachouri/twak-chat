import nodemailer from "nodemailer";

export default async function sendEmailNotification(chatDetails: any) {
  try {
    const { visitor, message, time, property } = await JSON.parse(chatDetails);

    const emailMessage = `
      A new chat has started on Twak:

      Visitor Name: ${visitor.name}
      City: ${visitor.city}
      Country: ${visitor.country}
      Message: ${message.text}
      Time: ${time}
      Property ID: ${property.id}
      Property Name: ${property.name}


      Visit: https://dashboard.tawk.to/#/chat
    `;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER_MAIL,
      to: process.env.RECEIVER_MAIL,
      subject: "New Conversation on Twak",
      text: emailMessage,
    });

    console.log("Email notification sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
//
