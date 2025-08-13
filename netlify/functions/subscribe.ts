import type { Handler } from "@netlify/functions";
import crypto from "node:crypto";

type Payload = {
  email?: string;
  firstName?: string;
  source?: string;   // e.g., "footer"
  honey?: string;    // honeypot
};

const {
  MAILCHIMP_API_KEY,
  MAILCHIMP_SERVER_PREFIX,
  MAILCHIMP_AUDIENCE_ID,
} = process.env;

const BASE = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

// Basic auth header: any username + API key as password
const authHeader = () => {
  const token = Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString("base64");
  return { Authorization: `Basic ${token}` };
};

const emailHash = (email: string) =>
  crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const TAGS = ["Website", "Footer"];

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, code: "METHOD_NOT_ALLOWED" });
  }

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_AUDIENCE_ID) {
    return json(500, { ok: false, code: "MISCONFIGURED", message: "Server not configured." });
  }

  let data: Payload = {};
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, code: "BAD_JSON", message: "Invalid JSON." });
  }

  // Honeypot: if filled, silently accept
  if (data.honey) return json(200, { ok: true, status: "ignored", message: "Thanks!" });

  const email = (data.email || "").trim();
  const firstName = (data.firstName || "").trim().slice(0, 80);
  const source = (data.source || "footer").slice(0, 40);

  if (!isValidEmail(email)) {
    return json(400, { ok: false, code: "INVALID_EMAIL", message: "Please enter a valid email." });
  }

  // Try to ADD as pending (triggers Mailchimp confirmation email)
  try {
    const addRes = await fetch(`${BASE}/lists/${MAILCHIMP_AUDIENCE_ID}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        email_address: email,
        status: "pending", // double opt-in
        merge_fields: { FNAME: firstName || undefined, SOURCE: source },
      }),
    });

    const addJson = await addRes.json().catch(() => ({}));

    if (addRes.ok) {
      // Apply tags (optional)
      if (TAGS.length) {
        const hash = addJson.id || emailHash(email);
        await fetch(`${BASE}/lists/${MAILCHIMP_AUDIENCE_ID}/members/${hash}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify({ tags: TAGS.map((name) => ({ name, status: "active" })) }),
        }).catch(() => {});
      }
      return json(200, {
        ok: true,
        status: "pending",
        message: "Almost there — check your inbox to confirm.",
      });
    }

    // If member already exists, check their current status
    if (addRes.status === 400 && typeof addJson?.title === "string" && /exists/i.test(addJson.title)) {
      const hash = emailHash(email);
      const getRes = await fetch(`${BASE}/lists/${MAILCHIMP_AUDIENCE_ID}/members/${hash}`, {
        headers: { ...authHeader() },
      });
      const member = await getRes.json().catch(() => ({} as any));

      // Best-effort tag application for existing members
      if (TAGS.length) {
        await fetch(`${BASE}/lists/${MAILCHIMP_AUDIENCE_ID}/members/${hash}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify({ tags: TAGS.map((name) => ({ name, status: "active" })) }),
        }).catch(() => {});
      }

      const status = String(member?.status || "").toLowerCase();

      if (status === "subscribed") {
        return json(200, { ok: true, status: "subscribed", message: "You’re already on the list!" });
      }

      if (status === "pending") {
        return json(409, {
          ok: false,
          code: "PENDING",
          message: "You’re already pending — check your inbox or spam.",
        });
      }

      if (status === "unsubscribed") {
        // Attempt to flip back to pending to send a fresh confirmation
        const putRes = await fetch(`${BASE}/lists/${MAILCHIMP_AUDIENCE_ID}/members/${hash}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify({
            email_address: email,
            status: "pending",
            merge_fields: { FNAME: firstName || member?.merge_fields?.FNAME, SOURCE: source },
          }),
        });
        if (putRes.ok) {
          return json(200, {
            ok: true,
            status: "pending",
            message: "Almost there — check your inbox to confirm.",
          });
        }
      }

      // cleaned/archived/unknown
      return json(409, {
        ok: false,
        code: "EXISTS_OTHER_STATUS",
        message: "We couldn’t resubscribe this address automatically. Please contact me and I’ll fix it.",
      });
    }

    // Unknown error shape
    return json(500, {
      ok: false,
      code: "MAILCHIMP_ERROR",
      message: "Something went wrong. Please try again.",
      mc: addJson?.detail || addJson?.title || undefined,
    });
  } catch (err) {
    return json(500, { ok: false, code: "NETWORK_ERROR", message: "Server error. Try again later." });
  }
};
