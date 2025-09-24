const passwordChangedTemplate = (email: string): string => {
    const year = new Date().getFullYear();
    const changedAt = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });

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
          <td style="padding:28px;color:#39404a;">
            <h1 style="font-size:20px;color:#0f1720;margin-bottom:14px;font-weight:600;">Password Changed Successfully</h1>
            <p style="font-size:15px;color:#555b63;line-height:1.5;">
              Hello, the password for your account <strong>${email}</strong> has been changed successfully. If you did not perform this action, please reset your password immediately or contact our support team.
            </p>
            <p style="margin-top:20px;font-size:14px;color:#5b6770;">🕒 Changed at: ${changedAt}</p>
            <p style="margin-top:16px;font-size:14px;color:#5b6770;">
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

export default passwordChangedTemplate;
