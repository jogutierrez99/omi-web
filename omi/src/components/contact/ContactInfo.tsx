import { contactDetails } from "@/src/data/contact";

export function ContactInfo() {
  return (
    <aside aria-labelledby="contact-info-title" className="rounded-[2rem] bg-[#061643] p-7 text-white shadow-[0_24px_70px_rgba(6,22,67,.16)] sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#73c5ff]">Información de contacto</p>
      <h2 id="contact-info-title" className="mt-4 text-3xl font-bold tracking-tight">Estamos cerca de ti</h2>
      <p className="mt-4 max-w-md leading-7 text-white/70">Cuéntanos qué necesitas y enviaremos tu consulta al equipo adecuado.</p>

      <dl className="mt-9 space-y-7">
        <div className="border-t border-white/15 pt-6">
          <dt className="text-sm font-bold text-[#73c5ff]">Empresa</dt>
          <dd className="mt-2 leading-7 text-white/85">{contactDetails.company}</dd>
        </div>
        <div className="border-t border-white/15 pt-6">
          <dt className="text-sm font-bold text-[#73c5ff]">Dirección</dt>
          <dd className="mt-2 leading-7 text-white/85">
            <address className="not-italic">{contactDetails.address.map((line) => <span key={line} className="block">{line}</span>)}</address>
          </dd>
        </div>
        {contactDetails.email && <div className="border-t border-white/15 pt-6"><dt className="text-sm font-bold text-[#73c5ff]">Email</dt><dd className="mt-2 text-white/85">{contactDetails.email}</dd></div>}
        {contactDetails.phone && <div className="border-t border-white/15 pt-6"><dt className="text-sm font-bold text-[#73c5ff]">Teléfono</dt><dd className="mt-2 text-white/85">{contactDetails.phone}</dd></div>}
        {contactDetails.schedule && <div className="border-t border-white/15 pt-6"><dt className="text-sm font-bold text-[#73c5ff]">Horario</dt><dd className="mt-2 text-white/85">{contactDetails.schedule}</dd></div>}
        {contactDetails.socialLinks.length > 0 && (
          <div className="border-t border-white/15 pt-6">
            <dt className="text-sm font-bold text-[#73c5ff]">Redes sociales</dt>
            <dd className="mt-3">
              <ul className="flex flex-wrap gap-3" aria-label="Perfiles sociales de OMI">
                {contactDetails.socialLinks.map((social) => (
                  <li key={social.href}>
                    <a href={social.href} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:border-[#73c5ff] hover:text-[#73c5ff] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#73c5ff]">
                      {social.label}<span className="sr-only"> (abre en una pestaña nueva)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}
