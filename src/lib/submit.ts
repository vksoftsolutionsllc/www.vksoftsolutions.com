import type { SubmitResponse } from "../shared/forms";

export async function submitForm(payload: Record<string, unknown>): Promise<SubmitResponse> {
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, sourcePage: window.location.pathname }),
    });
    const data = (await res.json().catch(() => null)) as SubmitResponse | null;
    if (!data) return { ok: false, error: "Unexpected response from the server. Please try again." };
    return data;
  } catch {
    return { ok: false, error: "We couldn’t reach the server. Check your connection and try again — your details are still here." };
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
