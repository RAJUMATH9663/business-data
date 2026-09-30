import nodemailer from "nodemailer";

interface SendResetEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({ to, userName, resetUrl }: SendResetEmailParams): Promise<boolean> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || `"NivoLeads" <${user || "support@nivoleads.com"}>`;

  // If SMTP credentials are not configured, return false so the caller knows to log/fallback
  if (!user || !pass) {
    console.log(`[Email Service] SMTP is not configured in .env. Falling back to on-screen/terminal link.`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="margin-bottom: 24px; text-align: center;">
          <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0;">Nivo<span style="color: #2563eb;">Leads</span></h1>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Verified Business Directory</p>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
          <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 12px 0;">Reset Your Password</h2>
          <p style="color: #475569; font-size: 14px; line-height: 22px; margin: 0 0 16px 0;">
            Hello ${userName || "there"},
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 22px; margin: 0 0 24px 0;">
            We received a request to reset the password for your NivoLeads account (${to}). Click the button below to choose a new password. This link is valid for <strong>30 minutes</strong>.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 18px; margin: 24px 0 8px 0;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; font-size: 11px; color: #2563eb; background-color: #f8fafc; padding: 8px; border-radius: 6px; margin: 0 0 24px 0;">
            ${resetUrl}
          </p>

          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>

        <div style="border-top: 1px solid #f1f5f9; margin-top: 32px; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
          © ${new Date().getFullYear()} NivoLeads. All rights reserved.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject: "Reset your NivoLeads password",
      html,
      text: `Hello ${userName || "there"},\n\nWe received a request to reset your NivoLeads password. Visit the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 30 minutes.\n\nIf you did not request this, you can ignore this message.`,
    });

    console.log(`[Email Service] Successfully dispatched password reset email to: ${to}`);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error sending email via SMTP:`, error);
    return false;
  }
}
