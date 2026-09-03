const benefits = [
  { icon: "♢", title: "Pureza", text: "Una propuesta cuidada para disfrutar agua de calidad cada día." },
  { icon: "✓", title: "Confianza", text: "Cuidamos cada detalle para ofrecerte tranquilidad." },
  { icon: "♧", title: "Hidratación diaria", text: "El equilibrio que tu cuerpo necesita, todos los días." },
];
export function Services() {
  return <section id="nuestra-agua" aria-labelledby="water-title" className="section-space bg-white"><div className="page-container"><h2 id="water-title" className="section-title">Nuestra agua</h2><div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">{benefits.map(item => <article key={item.title} className="flex gap-5 px-4 md:border-r md:border-blue-100 md:last:border-0 lg:px-10"><span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-[#0873ce] text-2xl text-[#0873ce]">{item.icon}</span><div><h3 className="text-lg font-bold text-[#061643]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></div></article>)}</div></div></section>;
}
