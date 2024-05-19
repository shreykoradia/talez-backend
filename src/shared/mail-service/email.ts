import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Queue from "bull";

dotenv.config();

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
};

const emailQueue = new Queue("email", redisConfig);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getEmailTemplate = () => {
  const filePath = path.join(
    __dirname,
    "../../shared/templates/verifyEmailTemplate.html"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const sendEmailVerification = (to: string, token: string) => {
  const emailTemplate = getEmailTemplate();

  const mailOptions = {
    from: process.env.EMAIL_HOST_FROM,
    to,
    subject: "Verify your Email Account",
    html: emailTemplate.replace(
      "{{verificationLink}}",
      `${process.env.BACKEND_PROD_URL}/auth/verify/${token}`
    ),
  };

  // Enqueue the email job
  emailQueue.add("sendEmail", { mailOptions });
};

emailQueue.process("sendEmail", 1, async (job) => {
  const { mailOptions } = job.data;
  // send email using nodemailer
  await transporter.sendMail(mailOptions);
});
