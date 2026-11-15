import Anthropic from "@anthropic-ai/sdk";
import { connection } from "next/server";
import { chatRequestSchema, demoReply, systemPromptFor, type ChatMode } from "@/lib/chat";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";

function currentMode(): ChatMode {
  return process.env.ANTHROPIC_API_KEY ? "live" : "demo";
}

/** Lets the widget show the correct badge before the first message. */
export async function GET() {
  await connection();
  return Response.json({ mode: currentMode() }, { headers: { "Cache-Control": "no-store" } });
}

const encoder = new TextEncoder();

function textStreamResponse(stream: ReadableStream<Uint8Array>, mode: ChatMode) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Chat-Mode": mode,
    },
  });
}

function jsonError(message: string, status: number, extra?: HeadersInit) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

export async function POST(req: Request) {
  const limit = rateLimit(`chat:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limit.ok) {
    return jsonError("You've sent a lot of messages. Please wait a few minutes and try again.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request.", 400);
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid chat message.", 400);

  const { scenario } = parsed.data;
  const messages = parsed.data.messages.slice(-12);
  // Trimming may leave an assistant message first; the API needs a user turn first.
  while (messages.length && messages[0].role !== "user") messages.shift();
  const last = messages[messages.length - 1].content;

  /* ── Demo mode: clearly-labelled scripted replies, no AI involved ── */
  if (currentMode() === "demo") {
    const words = demoReply(scenario, last).split(/(\s+)/);
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        for (const w of words) {
          controller.enqueue(encoder.encode(w));
          await new Promise((r) => setTimeout(r, 12));
        }
        controller.close();
      },
    });
    return textStreamResponse(stream, "demo");
  }

  /* ── Live mode: stream a real Claude response ── */
  const client = new Anthropic();
  const upstream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: await systemPromptFor(scenario),
    messages,
    output_config: { effort: "low" },
    // Server-side refusal fallback: if the model declines, the API retries on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  const iterator = upstream[Symbol.asyncIterator]();

  // Wait for the first event so auth/rate/overload errors return a proper HTTP error
  // instead of an empty 200 stream.
  let first: IteratorResult<Anthropic.Beta.Messages.BetaRawMessageStreamEvent>;
  try {
    first = await iterator.next();
  } catch (error) {
    return jsonError(...describeError(error));
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: Anthropic.Beta.Messages.BetaRawMessageStreamEvent) => {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      };
      try {
        if (!first.done) emit(first.value);
        for (let r = await iterator.next(); !r.done; r = await iterator.next()) emit(r.value);
        const final = await upstream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nSorry — I can't help with that request. Please ask about our services instead."));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("…"));
        }
      } catch (error) {
        console.error("[chat] stream error", error);
        controller.enqueue(encoder.encode("\n\n[Connection to the AI service was interrupted. Please try again.]"));
      } finally {
        controller.close();
      }
    },
    cancel() {
      upstream.abort();
    },
  });

  return textStreamResponse(stream, "live");
}

function describeError(error: unknown): [string, number] {
  console.error("[chat] request failed", error);
  if (error instanceof Anthropic.RateLimitError) return ["The AI service is busy right now. Please try again shortly.", 503];
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError)
    return ["The AI service is not configured correctly. Please contact us directly.", 503];
  if (error instanceof Anthropic.BadRequestError) return ["That message couldn't be processed. Please try rephrasing.", 400];
  if (error instanceof Anthropic.APIConnectionError) return ["Couldn't reach the AI service. Please try again.", 503];
  if (error instanceof Anthropic.APIError) return ["The AI service is temporarily unavailable. Please try again.", 503];
  return ["Something went wrong. Please try again.", 500];
}
