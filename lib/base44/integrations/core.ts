import { Resend } from "resend";

export interface SendEmailArgs {
  to: string[];
  subject: string;
  html: string;
  from_name?: string;
  from_email?: string;
}

/**
 * base44.integrations.Core.SendEmail
 *
 * Shared email integration. Uses Resend behind a stable interface so the rest
 * of the app never talks to a vendor directly. Set RESEND_API_KEY in the
 * Vercel environment.
 */
export const Core = {
  SendEmail: async ({
    to,
    subject,
    html,
    from_name = "Izzy Place Inn & Suites",
    from_email = "bookings@izzyplaceinn.com",
  }: SendEmailArgs): Promise<{ id: string }> => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[base44.integrations.Core.SendEmail] RESEND_API_KEY is not set; skipping send.");
      return { id: "" };
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: `${from_name} <${from_email}>`,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(`base44 SendEmail failed: ${error.message}`);
    }

    return { id: data?.id ?? "" };
  },
};

export default Core;
