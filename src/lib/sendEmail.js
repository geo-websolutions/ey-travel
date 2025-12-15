import { MailerSend } from "mailersend";
export async function sendEmail({ to, cc, subject, title, htmlBody }) {
  try {
    // Initialize MailerSend
    const mailersend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_TOKEN,
    });

    // Prepare recipients
    const recipients = Array.isArray(to) ? to : [to];
    const toArray = recipients.map((email) => ({
      email: email.trim(),
      name: "", // You can modify this if you have names
    }));

    // Prepare CC recipients if provided
    let ccArray = [];
    if (cc) {
      const ccRecipients = Array.isArray(cc) ? cc : [cc];
      ccArray = ccRecipients.map((email) => ({
        email: email.trim(),
        name: "",
      }));
    }

    // Create email data
    const emailData = {
      from: {
        email: process.env.EMAIL_USER, // Your verified domain email
        name: title,
      },
      to: toArray,
      cc: ccArray.length > 0 ? ccArray : undefined,
      subject: subject,
      html: htmlBody,
    };

    // Remove undefined properties to avoid API errors
    Object.keys(emailData).forEach((key) => {
      if (emailData[key] === undefined) {
        delete emailData[key];
      }
    });

    // Send email
    const response = await mailersend.email.send(emailData);

    return {
      success: true,
      info: response,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
