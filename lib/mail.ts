import "dotenv/config";
import fs from "fs/promises";
import handlebars from "handlebars";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createTransport } from "nodemailer";

const isTestEnv = process.env.NODE_ENV === "test";

const transporter = createTransport(
  isTestEnv
    ? {
        host: "localhost",
        port: 1025,
        secure: false,
      }
    : {
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
);

export const sendMail = async ({
  to,
  subject,
  templateName,
  context,
}: {
  to: string;
  subject: string;
  templateName: string;
  context: object;
}) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const templatesDir = path.resolve(__dirname, "../templates");
  const templatePath = path.join(templatesDir, templateName);
  const templateSource = await fs.readFile(templatePath, "utf-8");
  const html = handlebars.compile(templateSource)(context);

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: html,
  });
};
