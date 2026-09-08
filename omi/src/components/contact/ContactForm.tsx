"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  emptyContactForm,
  validateContactForm,
  type ContactApiResponse,
  type ContactErrors,
  type ContactField,
  type ContactFormData,
} from "@/src/lib/contact-validation";

const inputClass = "mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-[#061643] outline-none transition placeholder:text-slate-400 focus:border-[#0873ce] focus:ring-3 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(emptyContactForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("No hemos podido enviar el mensaje. Inténtalo de nuevo en unos minutos.");

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const field = event.target.name as ContactField;
    const value = event.target instanceof HTMLInputElement && event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle") setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const normalized: ContactFormData = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };
    const clientErrors = validateContactForm(normalized);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstField = Object.keys(clientErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError("No hemos podido enviar el mensaje. Inténtalo de nuevo en unos minutos.");
    setErrors({});
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const result = (await response.json()) as ContactApiResponse;
      if (!response.ok || !result.success) {
        if (!result.success && result.error === "INVALID_FORM" && result.fields) {
          setErrors(result.fields);
          const firstInvalidField = Object.keys(result.fields)[0];
          requestAnimationFrame(() => document.getElementById(firstInvalidField)?.focus());
        }
        if (!result.success && result.error === "RATE_LIMIT") {
          setSubmitError("Has enviado varios mensajes en poco tiempo. Espera unos minutos antes de volver a intentarlo.");
        }
        setStatus("error");
        return;
      }
      setForm(emptyContactForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const errorFor = (field: ContactField) => errors[field] ? `${field}-error` : undefined;

  return (
    <div className="rounded-[2rem] border border-blue-100 bg-[#f8fcff] p-7 sm:p-10">
      <p className="eyebrow">Escríbenos</p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#061643]">¿Cómo podemos ayudarte?</h2>
      <p className="mt-3 leading-7 text-slate-600">Completa el formulario y nuestro equipo revisará tu consulta.</p>

      <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Sitio web</label>
          <input id="website" name="website" value={form.website} onChange={updateField} tabIndex={-1} autoComplete="off" />
        </div>
        <Field label="Nombre" name="name" error={errors.name} required>
          <input className={inputClass} id="name" name="name" type="text" autoComplete="name" maxLength={100} value={form.name} onChange={updateField} disabled={status === "submitting"} aria-invalid={Boolean(errors.name)} aria-describedby={errorFor("name")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" name="email" error={errors.email} required>
            <input className={inputClass} id="email" name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={updateField} disabled={status === "submitting"} aria-invalid={Boolean(errors.email)} aria-describedby={errorFor("email")} />
          </Field>
          <Field label="Teléfono" name="phone" error={errors.phone}>
            <input className={inputClass} id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={form.phone} onChange={updateField} disabled={status === "submitting"} aria-invalid={Boolean(errors.phone)} aria-describedby={errorFor("phone")} />
          </Field>
        </div>
        <Field label="Asunto" name="subject" error={errors.subject} required>
          <select className={inputClass} id="subject" name="subject" value={form.subject} onChange={updateField} disabled={status === "submitting"} aria-invalid={Boolean(errors.subject)} aria-describedby={errorFor("subject")}>
            <option value="">Selecciona una opción</option>
            <option value="Productos y disponibilidad">Productos y disponibilidad</option>
            <option value="Recargas">Recargas</option>
            <option value="Información mayorista">Información mayorista</option>
            <option value="Franquicias">Franquicias</option>
            <option value="Otra consulta">Otra consulta</option>
          </select>
        </Field>
        <Field label="Mensaje" name="message" error={errors.message} required>
          <textarea className={`${inputClass} min-h-40 resize-y`} id="message" name="message" minLength={10} maxLength={5000} value={form.message} onChange={updateField} disabled={status === "submitting"} aria-invalid={Boolean(errors.message)} aria-describedby={errorFor("message")} />
        </Field>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
            <input className="mt-1 size-4 shrink-0 accent-[#0873ce] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#58aceb]" id="privacyAccepted" name="privacyAccepted" type="checkbox" checked={form.privacyAccepted} onChange={updateField} disabled={status === "submitting"} aria-invalid={Boolean(errors.privacyAccepted)} aria-describedby={errorFor("privacyAccepted")} />
            <span>He leído y acepto el tratamiento de mis datos para responder a esta consulta. <span aria-hidden="true">*</span></span>
          </label>
          {errors.privacyAccepted && <p id="privacyAccepted-error" className="mt-2 text-sm font-medium text-red-700"><span aria-hidden="true">⚠ </span>{errors.privacyAccepted}</p>}
        </div>
        <div aria-live="polite" aria-atomic="true">
          {status === "success" && <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-900">Mensaje enviado correctamente. Nos pondremos en contacto contigo lo antes posible.</p>}
          {status === "error" && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-900">{submitError}</p>}
        </div>
        <button type="submit" disabled={status === "submitting"} className="button-primary w-full disabled:cursor-wait disabled:opacity-65 sm:w-auto">
          {status === "submitting" ? "Enviando..." : "Enviar mensaje"}
        </button>
        <p className="text-xs leading-5 text-slate-500">Los campos marcados con * son obligatorios.</p>
      </form>
    </div>
  );
}

function Field({ label, name, error, required = false, children }: { label: string; name: ContactField; error?: string; required?: boolean; children: React.ReactNode }) {
  return <div><label htmlFor={name} className="text-sm font-bold text-[#061643]">{label}{required && <span aria-hidden="true"> *</span>}</label>{children}{error && <p id={`${name}-error`} className="mt-2 text-sm font-medium text-red-700"><span aria-hidden="true">⚠ </span>{error}</p>}</div>;
}
