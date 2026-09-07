export function Location() {
  return (
    <section id="donde-estamos" aria-labelledby="location-title" className="section-space bg-[#f2f9ff]">
      <div className="page-container grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
        <div><p className="eyebrow">Dónde estamos</p><h2 id="location-title" className="mt-4 text-4xl font-bold tracking-tight text-[#061643]">Visítanos en Maracay</h2><p className="mt-5 leading-7 text-slate-600">Estamos en la Intercomunal Turmero-Maracay, sector La Providencia, Maracay, estado Aragua, Venezuela.</p><a className="button-primary mt-7" href="https://www.google.com/maps/search/?api=1&query=Intercomunal+Turmero-Maracay+sector+La+Providencia+Maracay+Aragua+Venezuela" target="_blank" rel="noreferrer">Cómo llegar</a></div>
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_20px_50px_rgba(6,22,67,.08)]"><iframe title="Mapa de la zona de OMI en Maracay" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Intercomunal+Turmero-Maracay+sector+La+Providencia+Maracay+Aragua+Venezuela&output=embed" className="h-[360px] w-full border-0" /></div>
      </div>
    </section>
  );
}
