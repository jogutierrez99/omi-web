import Image from "next/image";
const formats = [
  { name:"Personal", copy:"Práctica y ligera, ideal para llevar a donde vayas.", src:"/images/generated/water-personal.png", alt:"Botella personal OMI" },
  { name:"1,5 L", copy:"El tamaño perfecto para acompañar tu día.", src:"/images/generated/water-1-5l.png", alt:"Botella OMI de 1,5 litros" },
  { name:"5 L", copy:"Comodidad y rendimiento para tu hogar.", src:"/images/generated/water-5l.png", alt:"Botellón OMI de 5 litros" },
  { name:"18 L", copy:"Nuestro formato de mayor capacidad.", src:"/images/generated/water-18l.png", alt:"Botellón OMI de 18 litros" },
];
export function RechargePromotion() {
  return <section id="formatos" aria-labelledby="formats-title" className="section-space bg-[#f8fcff]"><div className="page-container"><h2 id="formats-title" className="section-title">Formatos para cada momento</h2><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{formats.map(format => <article key={format.name} className="product-card"><h3 className="text-xl font-bold text-[#061643]">{format.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{format.copy}</p><div className="relative mt-4 h-72"><Image src={format.src} alt={format.alt} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" className="object-contain object-bottom transition-transform duration-300 hover:scale-[1.03]" /></div><span className="absolute bottom-4 left-4 grid size-10 place-items-center rounded-full bg-[#0873ce] text-white" aria-hidden="true">○</span></article>)}</div></div></section>;
}
