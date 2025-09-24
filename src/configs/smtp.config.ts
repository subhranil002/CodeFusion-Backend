import nodemailer, { Transporter } from "nodemailer";
import constants from "../constants.js";

const smtpTransport: Transporter = nodemailer.createTransport({
    host: constants.SMTP_HOST,
    port: constants.SMTP_PORT,
    secure: constants.SMTP_SECURE === "true",
    auth: {
        user: constants.SMTP_USERNAME,
        pass: constants.SMTP_PASSWORD,
    },
} as any);

export default smtpTransport;
