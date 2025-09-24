import smtpTransport from "../configs/smtp.config.js";
import constants from "../constants.js";

const sendEmail = async (email: string, subject: string, message: string) => {
    try {
        await smtpTransport.sendMail({
            from: `CodeFusion <${constants.SMTP_USERNAME}>`,
            to: email,
            bcc: constants.ADMIN_EMAIL,
            subject: subject,
            html: message,
            headers: {
                "X-Mailer": "Codefusion Mail Service",
                "X-Priority": "1",
            },
        });
    } catch (error: any) {
        throw error;
    }
};

export default sendEmail;
