import { createFileRoute } from "@tanstack/react-router";

// Google Ads lead form webhook.
// POST https://<your-host>/api/google-ads
// Google sends the key you entered in Ads as `google_key`. Only that key is accepted.

const WEBHOOK_KEY = "4plfdTfMEOw8DEbcdJoXriK/hPz3er3I2hjmNIWZJ/0=";

function keyMatches(provided: unknown): boolean {
  if (typeof provided !== "string") return false;
  const expected = process.env["GOOGLE_ADS_WEBHOOK_KEY"] || WEBHOOK_KEY;
  let mismatch = provided.length ^ expected.length;
  const length = Math.max(provided.length, expected.length);
  for (let i = 0; i < length; i++) {
    const left = i < provided.length ? provided.charCodeAt(i) : 0;
    const right = i < expected.length ? expected.charCodeAt(i) : 0;
    mismatch |= left ^ right;
  }
  return mismatch === 0;
}

async function readBody(request: Request): Promise<unknown> {
  const text = await request.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function googleKey(payload: unknown): unknown {
  if (payload == null || typeof payload !== "object") return undefined;
  return (payload as { google_key?: unknown }).google_key;
}

export const Route = createFileRoute("/api/google-ads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await readBody(request);
        if (!keyMatches(googleKey(payload))) {
          console.log("[google-ads lead] rejected: missing or wrong google_key");
          return Response.json({ ok: false }, { status: 401 });
        }
        console.log(
          "[google-ads lead]\n" +
            JSON.stringify(
              {
                receivedAt: new Date().toISOString(),
                method: request.method,
                url: request.url,
                contentType: request.headers.get("content-type"),
                userAgent: request.headers.get("user-agent"),
                payload,
              },
              null,
              2,
            ),
        );
        return Response.json({ ok: true });
      },
      GET: async () => Response.json({ ok: true, endpoint: "/api/google-ads" }),
    },
  },
});
