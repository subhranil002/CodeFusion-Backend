const contactUsTemplate = (name, email, message) => {
    const receivedAt = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });
    const year = new Date().getFullYear();
    return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width:600px; margin:20px auto; color:#333;">
    <div style="background:#f0f4f8; padding:40px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      
      <h2 style="color:#1e3a8a; font-size:24px; margin-bottom:30px; border-bottom:2px solid #3b82f6; padding-bottom:10px; display:flex; align-items:center;">
        📬 New Contact Message
      </h2>

      <div style="margin-bottom:30px;">
        <div style="display:flex; align-items:center; margin-bottom:15px;">
          <span style="width:90px; color:#3b82f6; font-weight:600; font-size:16px;">👤 Name:</span>
          <span style="font-size:16px;">${name}</span>
        </div>

        <div style="display:flex; align-items:center; margin-bottom:15px;">
          <span style="width:90px; color:#3b82f6; font-weight:600; font-size:16px;">📧 Email:</span>
          <span style="font-size:16px;">${email}</span>
        </div>

        <div style="margin-top:25px;">
          <h3 style="color:#3b82f6; margin-bottom:15px; font-size:18px;">✉️ Message:</h3>
          <p style="background:#ffffff; padding:18px; border-radius:10px; line-height:1.7; border:1px solid #d1d5db; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
            ${message}
          </p>
        </div>
      </div>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">

      <div style="text-align:center; color:#6b7280; font-size:14px;">
        <p>This message was sent from the contact form at <strong>CodeFusion</strong></p>
        <p style="margin-top:10px;">🕒 Received at: ${receivedAt}</p>
      </div>
    </div>

    <div style="text-align:center; color:#9ca3af; font-size:12px; margin-top:20px;">
      <p>© ${year} CodeFusion. All rights reserved.</p>
    </div>
  </div>
  `;
};
export default contactUsTemplate;
