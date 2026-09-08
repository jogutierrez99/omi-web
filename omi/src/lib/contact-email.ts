import type { ContactFormData } from "@/src/lib/contact-validation";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function emailLayout(content: string): string {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f2f9ff;color:#061643;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border:1px solid #cfe6f7;border-radius:20px;padding:32px"><div style="color:#0873ce;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">OMI · Agua mineral</div>${content}<p style="margin:28px 0 0;border-top:1px solid #e2edf5;padding-top:20px;color:#64748b;font-size:13px">Embotelladora OMI C.A. · Tu salud lo vale</p></div></div></body></html>`;
}

export function createContactEmail(data: ContactFormData, date: Date) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = data.phone ? escapeHtml(data.phone) : "No indicado";
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message).replace(/\r?\n/g, "<br>");
  const formattedDate = new Intl.DateTimeFormat("es-VE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Caracas",
  }).format(date);

  return {
    subject: `Nuevo mensaje desde la web de OMI — ${data.subject.replace(/[\r\n]+/g, " ")}`,
    html: emailLayout(`<h1 style="margin:18px 0 8px;font-size:26px">Nuevo mensaje recibido desde la web de OMI</h1><p style="margin:0 0 24px;color:#475569">${escapeHtml(formattedDate)}</p><table role="presentation" style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;font-weight:700;vertical-align:top">Nombre</td><td style="padding:8px 0">${name}</td></tr><tr><td style="padding:8px 0;font-weight:700;vertical-align:top">Email</td><td style="padding:8px 0">${email}</td></tr><tr><td style="padding:8px 0;font-weight:700;vertical-align:top">Teléfono</td><td style="padding:8px 0">${phone}</td></tr><tr><td style="padding:8px 0;font-weight:700;vertical-align:top">Asunto</td><td style="padding:8px 0">${subject}</td></tr></table><div style="margin-top:20px;border-radius:14px;background:#f8fcff;padding:20px"><strong>Mensaje</strong><p style="margin:10px 0 0;line-height:1.65">${message}</p></div>`),
  };
}

export function createAcknowledgementEmail(data: ContactFormData) {
  const name = escapeHtml(data.name);
  return {
    subject: "Hemos recibido tu mensaje — OMI",
    html: emailLayout(`<h1 style="margin:18px 0 16px;font-size:26px">Hola ${name},</h1><p style="color:#475569;line-height:1.7">Gracias por contactar con OMI.</p><p style="color:#475569;line-height:1.7">Hemos recibido correctamente tu mensaje y nuestro equipo lo revisará lo antes posible.</p><p style="color:#475569;line-height:1.7">No es necesario que vuelvas a enviar el formulario.</p><p style="margin-top:24px;line-height:1.7">Un saludo,<br><strong>Equipo OMI</strong></p>`),
  };
}
