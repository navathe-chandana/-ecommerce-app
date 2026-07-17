import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOrderEmail = async (toEmail, toName, orderId, status) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = `Order Update: ${status}`;
    sendSmtpEmail.htmlContent = `
      <h2>Hi ${toName},</h2>
      <p>Your order <strong>#${orderId}</strong> status has been updated to: <strong>${status}</strong>.</p>
      <p>Thank you for shopping with us!</p>
    `;
    sendSmtpEmail.sender = { name: "Ecommerce Store", email: process.env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: toEmail, name: toName }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};