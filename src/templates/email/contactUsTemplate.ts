const contactUsTemplate = (
    name: string,
    email: string,
    message: string
): string => {
    const receivedAt = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });
    const year = new Date().getFullYear();

    return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f3f5f7;padding:24px 12px;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9ee;">
        <tr>
          <td style="background:linear-gradient(90deg,#0b63d1 0%,#1a73e8 100%);padding:18px 20px;text-align:center;">
            <a href="https://codefusion.subhranilchakraborty.in" target="_blank" style="text-decoration:none;display:inline-block;outline:none;">
              <img src="https://nyibmtuweldv80cj.public.blob.vercel-storage.com/logo.jpeg" alt="CodeFusion" width="120" style="height:auto;display:block;border:0;"/>
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 28px;color:#39404a;">
            <h1 style="font-size:20px;color:#0f1720;margin-bottom:10px;font-weight:600;">📬 New Contact Message</h1>
            <p style="font-size:15px;color:#555b63;line-height:1.5;margin:0 0 18px 0;">
              A new message was submitted via the CodeFusion contact form. Details are below.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:top;padding:10px 0;width:110px;color:#3b82f6;font-weight:600;font-size:14px;">👤 Name:</td>
                <td style="vertical-align:top;padding:10px 0;font-size:14px;color:#333;">${name}</td>
              </tr>
              <tr>
                <td style="vertical-align:top;padding:10px 0;color:#3b82f6;font-weight:600;font-size:14px;">📧 Email:</td>
                <td style="vertical-align:top;padding:10px 0;font-size:14px;color:#333;"><a href="mailto:${email}" style="color:#0b63d1;text-decoration:none;">${email}</a></td>
              </tr>
              <tr>
                <td style="vertical-align:top;padding:10px 0;color:#3b82f6;font-weight:600;font-size:14px;">✉️ Message:</td>
                <td style="vertical-align:top;padding:10px 0;">
                  <div style="background:#fbfcfd;padding:14px;border-radius:10px;border:1px solid #e6e9ee;color:#39404a;line-height:1.6;font-size:14px;">
                    ${message.replace(/\n/g, "<br/>")}
                  </div>
                </td>
              </tr>
            </table>

            <p style="margin-top:18px;font-size:14px;color:#5b6770;">🕒 Received at: ${receivedAt}</p>

            <p style="margin-top:14px;font-size:14px;color:#5b6770;">
              Best regards,<br/>
              <strong>CodeFusion Team</strong>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#fbfcfd;padding:14px 20px;color:#7a8894;font-size:12px;text-align:center;">
            © ${year} CodeFusion. All rights reserved.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;
};

export default contactUsTemplate;
