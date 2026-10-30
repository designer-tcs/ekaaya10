import { createFileRoute } from "@tanstack/react-router";

// Google Ads lead form webhook.
// POST https://<your-host>/api/google-ads
// Each request is printed in the server console. Always returns 200 so Ads accepts the URL.

async function readBody(request: Request): Promise<unknown> {
  const text = await request.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export const Route = createFileRoute("/api/google-ads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await readBody(request);
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
