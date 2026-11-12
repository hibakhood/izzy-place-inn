import { HttpError } from "../../server/http.js";

export interface SendEmailArgs {
  to: string[];
  subject: string;
  html: string;
  from_name?: string;
  from_email?: string;
  idempotencyKey?: string;
  replyTo?: string;
}
export function requireEmailConfiguration() {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new HttpError(503, "Email is temporarily unavailable. Please call reception.");
  }
}
export const Core = {
  async SendEmail({ to, subject, html, from_name = "Izzy Place Inn & Suites", from_email, idempotencyKey, replyTo }: SendEmailArgs): Promise<{ id: string }> {
    requireEmailConfiguration();
    if (!to.length) throw new Error("Missing recipients");
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify({ from: `${from_name} <${from_email || process.env.RESEND_FROM_EMAIL}>`, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
      signal: AbortSignal.timeout(15000),
    });
    if (!result.ok) throw new Error("Email provider did not accept the message");
    const data = await result.json() as { id?: string };
    if (!data.id) throw new Error("Email provider did not return a message ID");
    return { id: data.id };
  },
};
export default Core;
