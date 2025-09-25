const forgotPasswordTemplate = (link, email) => {
    const year = new Date().getFullYear();
    return `
<!-- Preheader (hidden preview text) -->
<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  Reset your CodeFusion password — link valid for 15 minutes.
</span>

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
          <td style="padding:28px 28px 20px 28px;color:#39404a;">
            <h1 style="font-size:20px;margin:0 0 14px 0;color:#0f1720;font-weight:600;line-height:1.2;">
              Password reset request
            </h1>

            <p style="margin:0 0 16px 0;font-size:15px;color:#555b63;line-height:1.5;">
              We received a request to reset the password for the account associated with <strong style="color:#222;">${email}</strong>.
              If you made this request, click the button below to create a new password. The link will expire in <strong>15 minutes</strong>.
            </p>

            <div style="margin:22px 0;text-align:left;">
              <a href="${link}" target="_blank" style="background:#0b63d1;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;display:inline-block;font-weight:600;font-size:15px;">
                Reset password
              </a>
            </div>

            <p style="margin:6px 0 0 0;font-size:13px;color:#6b7280;line-height:1.4;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="word-break:break-all;font-size:13px;margin:6px 0 0 0;color:#2563eb;">
              <a href="${link}" target="_blank" style="color:#2563eb;text-decoration:underline;">${link}</a>
            </p>

            <hr style="border:0;border-top:1px solid #eef2f7;margin:22px 0;" />

            <p style="margin:0;font-size:14px;color:#5b6770;line-height:1.5;">
              If you didn't request a password reset, you can safely ignore this email - no changes were made.
            </p>

            <p style="margin:16px 0 0 0;font-size:14px;color:#5b6770;">
              Best regards,<br/>
              <strong>CodeFusion Team</strong>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#fbfcfd;padding:14px 20px 20px 20px;color:#7a8894;font-size:12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="margin-bottom:6px;">This email was sent to <strong>${email}</strong>.</div>
                  <div>If you need help, contact us at <a href="mailto:codefusion.subhranil@gmail.com" style="color:#0b63d1;text-decoration:underline;">codefusion.subhranil@gmail.com</a>.</div>
                </td>
                <td align="right" style="vertical-align:middle;padding-left:10px;">
                  <img src="https://nyibmtuweldv80cj.public.blob.vercel-storage.com/logo.jpeg" alt="" width="36" style="display:block;border:0;border-radius:6px;opacity:0.9;" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table role="presentation" width="600" style="max-width:600px;margin-top:14px;">
        <tr>
          <td style="text-align:center;font-size:12px;color:#98a0a8;">
            You received this email because you are registered with CodeFusion. &nbsp;·&nbsp; © ${year} CodeFusion
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;
};
export default forgotPasswordTemplate;
