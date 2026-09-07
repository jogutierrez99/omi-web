const qualities = [
  { icon: "◇", title: "Pozo profundo", text: "Un origen natural situado en Maracay." },
  { icon: "≈", title: "Mineralización suave", text: "Un perfil ligero para el consumo cotidiano." },
  { icon: "✓", title: "Calidad controlada", text: "Cuidado durante la captación, el embotellado y la distribución." },
];
export function Services() {
  return <section id="nuestra-agua" aria-labelledby="water-title" className="section-space bg-white"><div className="page-container"><div className="mx-auto max-w-3xl text-center"><p className="eyebrow justify-center">Nuestra agua</p><h2 id="water-title" className="mt-4 text-4xl font-bold tracking-tight text-[#061643]">De origen natural y mineralización suave</h2><p className="mt-5 leading-7 text-slate-600">El agua OMI procede de un pozo profundo y presenta características propias de un agua mineral. Su sabor ligero está pensado para acompañar el día a día.</p></div><div className="mt-12 grid gap-7 md:grid-cols-3">{qualities.map(item => <article key={item.title} className="rounded-2xl border border-blue-100 bg-[#f8fcff] p-7"><span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#0873ce] text-xl text-white">{item.icon}</span><h3 className="mt-5 text-xl font-bold text-[#061643]">{item.title}</h3><p className="mt-3 leading-7 text-slate-600">{item.text}</p></article>)}</div></div></section>;
}
