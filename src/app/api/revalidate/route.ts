import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CMS_TAG } from "@/lib/content";

/**
 * Optional Sanity webhook: publishes show up on the site immediately instead of
 * within ~1 minute. Configure in sanity.io/manage → API → Webhooks with this URL,
 * method POST, and the same secret as SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ ok: false, error: "SANITY_REVALIDATE_SECRET is not configured." }, { status: 503 });
  }
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
    if (!isValidSignature) {
      return Response.json({ ok: false, error: "Invalid signature." }, { status: 401 });
    }
    // Expire immediately so the next visitor sees the new content.
    revalidateTag(CMS_TAG, { expire: 0 });
    return Response.json({ ok: true, revalidated: CMS_TAG, type: body?._type ?? null });
  } catch (error) {
    console.error("[revalidate] failed", error);
    return Response.json({ ok: false, error: "Could not process webhook." }, { status: 400 });
  }
}
