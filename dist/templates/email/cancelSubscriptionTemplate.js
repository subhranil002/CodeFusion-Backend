import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
const cancelSubscriptionTemplate = (name, email, planName, expiresOn) => {
    const year = new Date().getFullYear();
    const cancelledAt = format(toZonedTime(new Date(), "Asia/Kolkata"), "dd/MM/yyyy, hh:mm a");
    const effectiveUntil = format(toZonedTime(expiresOn, "Asia/Kolkata"), "dd/MM/yyyy");
    const planFeaturesMap = {
        free: [
            "Up to 5 collaborative rooms",
            "Basic editor tools",
            "10 code runs per day",
            "5 AI interactions per day",
            "Standard compilation priority",
            "Community support",
        ],
        basic: [
            "Unlimited collaborative rooms",
            "Advanced editor tools",
            "50 code runs per day",
            "25 AI interactions per day",
            "Higher compilation priority",
            "Email support with faster response",
        ],
        pro: [
            "Unlimited collaborative rooms",
            "All advanced editor tools",
            "Unlimited code runs",
            "Unlimited AI interactions",
            "Highest compilation priority",
            "24/7 priority support & early access to features",
        ],
    };
    const features = planFeaturesMap[planName] || [];
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
            <h1 style="font-size:20px;color:#0f1720;margin-bottom:14px;font-weight:600;">Subscription Cancelled</h1>

            <p style="font-size:15px;color:#555b63;line-height:1.5;">
              Hello <strong>${name}</strong> - we’ve processed the cancellation for the <strong>${planName}</strong> plan tied to <strong>${email}</strong>.
            </p>

            <p style="font-size:15px;color:#555b63;line-height:1.5;margin-top:8px;">
              <strong>Requested on:</strong> ${cancelledAt}<br/>
              <strong>Access valid until:</strong> ${effectiveUntil}
            </p>

            <p style="font-size:15px;color:#555b63;line-height:1.5;margin-top:12px;">No refund is applicable for this cancellation.</p>

            ${features.length
        ? `
              <p style="font-size:15px;color:#555b63;line-height:1.5;margin-top:12px;">
                <strong>Plan details (what you had):</strong>
              </p>
              <ul style="font-size:15px;color:#555b63;line-height:1.5;margin:8px 0 0 18px;padding:0;">
                ${features
            .map((f) => `<li style="margin-bottom:6px;">${f}</li>`)
            .join("")}
              </ul>
            `
        : ""}

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
export default cancelSubscriptionTemplate;
