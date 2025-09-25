import axios from "axios";
import constants from "../constants.js";
import oauth2Client from "../configs/smtp.config.js";

// Helper to base64url encode the email
function base64UrlEncode(str: string) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

// Build raw RFC-2822 email with HTML only
function buildEmail(
    to: string,
    subject: string,
    html: string,
    from = constants.GMAIL_USER
) {
    return [
        `From: "CodeFusion" <${from}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        html,
    ].join("\r\n");
}

export default async function sendMail(
    to_email: string,
    subject: string,
    html_message: string
) {
    try {
        // Get fresh access token
        const { token: accessToken } = await oauth2Client.getAccessToken();
        if (!accessToken) throw new Error("Failed to get access token");

        // Build raw email
        const raw = base64UrlEncode(
            buildEmail(to_email, subject, html_message)
        );

        // Send via Gmail API
        await axios.post(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
            { raw },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        throw error;
    }
}
