const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendMail;