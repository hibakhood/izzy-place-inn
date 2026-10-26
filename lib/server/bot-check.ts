import { HttpError, text } from './http';
export async function verifyBotCheck(value: unknown, action: 'booking' | 'contact') {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new HttpError(503,'Online requests are temporarily unavailable. Please call reception.');
  const token = text(value,'the security check',2048);
  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,response:token}),signal:AbortSignal.timeout(10000),
  });
  if (!result.ok) throw new HttpError(503,'The security check is unavailable. Please try again.');
  const data = await result.json() as {success?:boolean;hostname?:string;action?:string};
  const hostname = new URL(process.env.SITE_ORIGIN || 'https://izzyplaceinn.com').hostname;
  if (!data.success || data.hostname !== hostname || data.action !== action) throw new HttpError(400,'Please complete a new security check and try again.');
}
