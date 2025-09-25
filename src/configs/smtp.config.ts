import nodemailer, { Transporter } from "nodemailer";
import constants from "../constants.js";

const smtpTransport: Transporter = nodemailer.createTransport({
    host: constants.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: constants.SMTP_USERNAME,
        pass: constants.SMTP_PASSWORD,
    },
});

(async () => {
    try {
        await smtpTransport.verify();
        console.log("SMTP verified: ready to send emails");
    } catch (error) {
        console.error("SMTP verification failed:", error);
    }
})();

export default smtpTransport;
