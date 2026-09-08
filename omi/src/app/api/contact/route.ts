import { NextResponse } from "next/server";
import { createAcknowledgementEmail, createContactEmail } from "@/src/lib/contact-email";
import { isRateLimited } from "@/src/lib/contact-rate-limit";
import { parseContactForm, validateContactForm, type ContactApiResponse } from "@/src/lib/contact-validation";
import { getResendClient } from "@/src/lib/resend";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 12_000;

function json(body: ContactApiResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

function requestIdentifier(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ success: false, error: "INVALID_FORM" }, 400);
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return json({ success: false, error: "INVALID_FORM" }, 400);

  let rawBody: unknown;
  try {
    const bodyText = await request.text();
    if (new TextEncoder().encode(bodyText).byteLength > MAX_BODY_BYTES) {
      return json({ success: false, error: "INVALID_FORM" }, 400);
    }
    rawBody = JSON.parse(bodyText);
  } catch {
    return json({ success: false, error: "INVALID_FORM" }, 400);
  }

  const data = parseContactForm(rawBody);
  if (!data) return json({ success: false, error: "INVALID_FORM" }, 400);
  if (data.website) return json({ success: true }, 200);

  const fields = validateContactForm(data);
  if (Object.keys(fields).length > 0) {
    return json({ success: false, error: "INVALID_FORM", fields }, 400);
  }
  if (isRateLimited(requestIdentifier(request))) {
    return json({ success: false, error: "RATE_LIMIT" }, 429, { "Retry-After": "600" });
  }

  const recipient = process.env.CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!recipient || !from) {
    console.error("Contact form email configuration is incomplete");
    return json({ success: false, error: "INTERNAL_ERROR" }, 500);
  }

  try {
    const resend = getResendClient();
    const notification = createContactEmail(data, new Date());
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      replyTo: data.email,
      subject: notification.subject,
      html: notification.html,
    });
    if (error) throw new Error("Primary contact email failed");

    const acknowledgement = createAcknowledgementEmail(data);
    try {
      const { error: acknowledgementError } = await resend.emails.send({
        from,
        to: data.email,
        subject: acknowledgement.subject,
        html: acknowledgement.html,
      });
      if (acknowledgementError) console.error("Contact acknowledgement email failed");
    } catch {
      console.error("Contact acknowledgement email failed");
    }

    return json({ success: true }, 200);
  } catch {
    console.error("Contact form email delivery failed");
    return json({ success: false, error: "INTERNAL_ERROR" }, 500);
  }
}
