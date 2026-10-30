import type { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
};

/** Label + control + error, styled with the design's .contact-field rules. */
export default function FormField({ id, label, required, error, hint, children }: Props) {
  return (
    <div className="contact-field">
      <label htmlFor={id}>
        {label} {required ? <span aria-hidden="true">*</span> : <span className="contact-optional">(optional)</span>}
      </label>
      {children}
      {hint}
      {error && <span className="contact-field-error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}

export function fieldA11y(id: string, error?: string) {
  return { id, name: id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined };
}
