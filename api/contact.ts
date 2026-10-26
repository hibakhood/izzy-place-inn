import { verifyBotCheck } from "../lib/server/bot-check";
import { createHash } from "node:crypto";
import { Core, requireEmailConfiguration } from "../lib/base44/integrations/core";
import { email, failure, jsonBody, rateLimit, response, text, HttpError } from "../lib/server/http";
import { escapeHtml } from "../lib/server/html";
import { hotelRecipients } from "../lib/server/notifications";

export async function POST(req: Request): Promise<Response> {
  if (req.method !== "POST") return response({ error: "Method not allowed" },405);
  try {
    const body = await jsonBody(req);
    const name = text(body.name,"your name",120);
    const sender = email(body.email);
    const phone = text(body.phone,"your phone number",40,true);
    const subject = text(body.subject,"the subject",120,true).replace(/[\r\n]/g," ");
    const message = text(body.message,"your message",4000);
    if (body.website) throw new HttpError(400,"Please check your message.");
    requireEmailConfiguration();
    await rateLimit(req,"contact");
    await verifyBotCheck(body.bot_token,"contact");
    const fingerprint = createHash("sha256").update(JSON.stringify([name,sender,phone,subject,message,Math.floor(Date.now()/3600000)])).digest("hex");
    const html = `<h1>New website enquiry</h1><p>From: ${escapeHtml(name)} (${escapeHtml(sender)})</p><p>Phone: ${escapeHtml(phone)}</p><p>Subject: ${escapeHtml(subject)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;
    await Core.SendEmail({ to: hotelRecipients(), subject: `Website enquiry: ${subject || "New message"}`, html, replyTo: sender, idempotencyKey: `contact/${fingerprint}` });
    return response({ ok: true });
  } catch(error) { return failure(error); }
}
