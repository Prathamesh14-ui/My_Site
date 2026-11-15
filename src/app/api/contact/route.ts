import { enquirySchema, fieldErrors } from "@/lib/enquiry";
import { deliverEnquiry } from "@/lib/enquiry-delivery";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const noStore = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const limit = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "Too many submissions. Please wait a few minutes, or contact us by email or WhatsApp." },
      { status: 429, headers: { ...noStore, "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400, headers: noStore });
  }

  // Honeypot: silently accept bot submissions without delivering them.
  if (typeof body?.website === "string" && body.website.length > 0) {
    return Response.json({ ok: true }, { headers: noStore });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) },
      { status: 422, headers: noStore },
    );
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 200) : "/contact";
  const result = await deliverEnquiry(parsed.data, source);

  if (!result.ok) {
    console.error(`[contact] delivery ${result.reason}`, result.errors);
    return Response.json(
      {
        ok: false,
        error:
          result.reason === "not_configured"
            ? "Our enquiry system is temporarily unavailable. Please email or WhatsApp us directly — your message was not sent."
            : "We couldn't send your enquiry right now. Please try again, or email or WhatsApp us directly.",
      },
      { status: result.reason === "not_configured" ? 503 : 502, headers: noStore },
    );
  }

  if (result.errors.length) console.warn("[contact] delivered via", result.channels, "but some channels failed:", result.errors);
  return Response.json({ ok: true }, { headers: noStore });
}
