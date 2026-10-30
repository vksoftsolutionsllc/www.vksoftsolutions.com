// Shared by the browser forms and the /api/submit function so both sides
// agree on what a valid submission looks like.

export const SERVICE_OPTIONS = [
  { value: "it-consulting", label: "IT consulting & advisory" },
  { value: "software-development", label: "Custom software development" },
  { value: "ai-data", label: "AI, data & analytics" },
  { value: "cloud-devops", label: "Cloud & DevOps" },
  { value: "enterprise-applications", label: "Enterprise applications (Salesforce, Workday, SAP…)" },
  { value: "quality-engineering", label: "Quality engineering & testing" },
  { value: "staffing", label: "IT staffing & talent solutions" },
  { value: "not-sure", label: "Not sure yet — let’s talk" },
] as const;

export const INQUIRY_KINDS = ["project", "hire_talent", "general"] as const;
export type InquiryKind = (typeof INQUIRY_KINDS)[number];

export const ENGAGEMENT_TYPES = ["Contract", "Contract-to-hire", "Direct hire", "Dedicated team", "Not sure"] as const;
export const HEADCOUNT_OPTIONS = ["1", "2–5", "6–10", "11–25", "25+"] as const;
export const TIMELINE_OPTIONS = ["Immediately", "Within 30 days", "1–3 months", "Exploring"] as const;

export const WORK_AUTH_OPTIONS = [
  "US Citizen",
  "Green Card holder",
  "H-1B (transfer)",
  "EAD (OPT / H4 / L2 / other)",
  "Require sponsorship",
  "Indian citizen (India roles)",
  "Other",
] as const;

export const RESUME_MAX_BYTES = 2.5 * 1024 * 1024;
export const RESUME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export function serviceLabel(value: string) {
  return SERVICE_OPTIONS.find(s => s.value === value)?.label ?? value;
}

export type SubmitResponse = { ok: true; id?: string } | { ok: false; error: string; fields?: Record<string, string> };
