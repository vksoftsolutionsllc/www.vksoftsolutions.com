const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = { success: boolean; codes: string[]; hostname?: string; action?: string };

export async function verifyTurnstile(token: string, ip: string | undefined, idempotencyKey: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not configured");
  const body = new URLSearchParams({ secret, response: token, idempotency_key: idempotencyKey });
  if (ip) body.set("remoteip", ip);
  const res = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(8_000) });
  const data = (await res.json()) as { success: boolean; "error-codes"?: string[]; hostname?: string; action?: string };
  return { success: data.success === true, codes: data["error-codes"] ?? [], hostname: data.hostname, action: data.action };
}
