import { Core } from "../lib/base44/integrations/core";
import { siteConfig } from "../src/lib/site";

interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * POST /api/contact
 * Sends a contact-form enquiry to the hotel inbox.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = (await req.json()) as ContactBody;

    if (!body.name || !body.email || !body.message) {
      return Response.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;color:#15271C;max-width:600px;margin:0 auto;">
        <div style="background:#0C3B24;padding:20px;border-radius:10px 10px 0 0;">
          <h1 style="margin:0;color:#FAF6EF;font-size:18px;">New Contact Enquiry</h1>
        </div>
        <div style="background:#fff;padding:20px;border:1px solid #eee;border-top:none;border-radius:0 0 10px 10px;">
          <p><strong>From:</strong> ${body.name} (${body.email})${body.phone ? ` · ${body.phone}` : ""}</p>
          ${body.subject ? `<p><strong>Subject:</strong> ${body.subject}</p>` : ""}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
          <p style="white-space:pre-wrap;">${body.message}</p>
        </div>
      </div>`;

    const adminEmail = process.env.ADMIN_EMAIL;
    const recipients = [siteConfig.emails.info];
    if (adminEmail) recipients.push(adminEmail);

    const result = await Core.SendEmail({
      to: recipients,
      subject: `Website enquiry — ${body.subject || body.name}`,
      html,
      from_name: "Izzy Place Inn & Suites",
    });

    return Response.json({ ok: true, id: result.id });
  } catch (error) {
    console.error("[contact]", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 }
    );
  }
}
