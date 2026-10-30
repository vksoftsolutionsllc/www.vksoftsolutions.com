export type FieldErrors = Record<string, string>;

const EMAIL = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;

export function text(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  // Strip control characters except newlines/tabs, collapse surrounding space.
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export class Validator {
  errors: FieldErrors = {};

  required(field: string, value: string, label: string, min = 1) {
    if (!value) this.errors[field] = `${label} is required.`;
    else if (value.length < min) this.errors[field] = `${label} must be at least ${min} characters.`;
    return value;
  }

  email(field: string, value: string) {
    if (!value) this.errors[field] = "Email address is required.";
    else if (!EMAIL.test(value)) this.errors[field] = "Enter a valid email address.";
    return value.toLowerCase();
  }

  phone(field: string, value: string) {
    if (value && !/^[+()\d\s.-]{7,40}$/.test(value)) this.errors[field] = "Enter a valid phone number.";
    return value || null;
  }

  url(field: string, value: string) {
    if (!value) return null;
    try {
      const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
      return u.toString();
    } catch {
      this.errors[field] = "Enter a valid URL.";
      return null;
    }
  }

  oneOf<T extends string>(field: string, value: string, allowed: readonly T[], label: string): T {
    if (!allowed.includes(value as T)) this.errors[field] = `Choose a ${label.toLowerCase()}.`;
    return value as T;
  }

  get ok() {
    return Object.keys(this.errors).length === 0;
  }
}
