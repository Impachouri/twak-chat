import nodemailer from "nodemailer";

export function sendEmailNotification(chatDetails: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const { visitor, message, time, property } = JSON.parse(chatDetails);

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

      transporter.sendMail(
        {
          from: process.env.SENDER_MAIL,
          to: process.env.RECEIVER_MAIL,
          subject: "New Conversation on Twak",
          text: emailMessage,
        },
        (error) => {
          if (error) {
            console.error("Error sending email:", error);
            reject(error);
          } else {
            console.log("Email notification sent successfully.");
            resolve();
          }
        }
      );
    } catch (error) {
      console.error("Error sending email:", error);
      reject(error);
    }
  });
}
