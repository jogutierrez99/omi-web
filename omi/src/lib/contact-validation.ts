export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacyAccepted: boolean;
  website: string;
}

export type ContactField = keyof ContactFormData;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactApiResponse =
  | { success: true }
  | {
      success: false;
      error: "INVALID_FORM" | "RATE_LIMIT" | "INTERNAL_ERROR";
      fields?: ContactErrors;
    };

export const emptyContactForm: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  privacyAccepted: false,
  website: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()./-]*$/;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function parseContactForm(value: unknown): ContactFormData | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (
    !isString(input.name) ||
    !isString(input.email) ||
    !isString(input.phone) ||
    !isString(input.subject) ||
    !isString(input.message) ||
    typeof input.privacyAccepted !== "boolean" ||
    !isString(input.website)
  ) {
    return null;
  }

  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    privacyAccepted: input.privacyAccepted,
    website: input.website.trim(),
  };
}

export function validateContactForm(data: ContactFormData): ContactErrors {
  const errors: ContactErrors = {};

  if (!data.name) errors.name = "Introduce tu nombre.";
  else if (data.name.length < 2) errors.name = "El nombre debe contener al menos 2 caracteres.";
  else if (data.name.length > 100) errors.name = "El nombre no puede superar los 100 caracteres.";

  if (!data.email || data.email.length > 254 || !emailPattern.test(data.email)) {
    errors.email = "Introduce un correo electrónico válido.";
  }

  if (data.phone && (data.phone.length > 30 || !phonePattern.test(data.phone))) {
    errors.phone = "Introduce un número de teléfono válido.";
  }

  if (!data.subject) errors.subject = "Introduce un asunto.";
  else if (data.subject.length > 150) errors.subject = "El asunto no puede superar los 150 caracteres.";

  if (!data.message) errors.message = "Introduce tu mensaje.";
  else if (data.message.length < 10) errors.message = "El mensaje debe contener al menos 10 caracteres.";
  else if (data.message.length > 5000) errors.message = "El mensaje no puede superar los 5000 caracteres.";

  if (!data.privacyAccepted) errors.privacyAccepted = "Debes aceptar la política de privacidad.";
  return errors;
}
