import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()


export const sendPasswordResetEmail = (email: string,resetToken: string, name:string) =>{
    const html = `
        <html>
            <body>
            <h1>Reset your password</h1>
                <h3>Dear ${name}</h3>
                <p>Click on the link to reset your password</p>
                <a href="http://localhost:3000/reset-password?token=${resetToken}">Click Here!</a>
            </body>
        </html>
    `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "SupportTeam@gmail.com",
    to: email,
    subject: "To-Do List reset password request",
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent to ${email}`);
    //   console.log(info.response);
    }
  });
}
