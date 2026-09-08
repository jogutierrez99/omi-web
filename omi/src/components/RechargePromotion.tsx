import Image from "next/image";
import Link from "next/link";

const products = [
  { name:"330 cc", unit:"Gavera de 15 unidades", use:"Consumo personal, reuniones y eventos", src:"/images/products/water-330cc.webp", alt:"Botella OMI de 330 centímetros cúbicos" },
  { name:"1,5 L", unit:"Gavera de 6 unidades", use:"Hogar y consumo diario", src:"/images/products/water-1-5l.webp", alt:"Botella OMI de 1,5 litros" },
  { name:"5 L", unit:"Gavera de 2 unidades", use:"Hogares, oficinas y pequeños comercios", src:"/images/products/water-5l.webp", alt:"Botellón OMI de 5 litros" },
  { name:"18 L", unit:"Botellón individual", use:"Hogares, oficinas y negocios", src:"/images/products/water-18l.webp", alt:"Botellón OMI de 18 litros" },
];
export function RechargePromotion() {
  return <section id="productos" aria-labelledby="products-title" className="section-space bg-[#f2f9ff]"><div className="page-container"><div className="mx-auto max-w-3xl text-center"><p className="eyebrow justify-center">Nuestros productos</p><h2 id="products-title" className="mt-4 text-4xl font-bold tracking-tight text-[#061643]">Un formato para cada necesidad</h2><p className="mt-5 leading-7 text-slate-600">Ofrecemos recargas de botellones al detal y presentaciones para hogares, comercios y clientes mayoristas.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(product => <article key={product.name} className="product-card"><h3 className="text-xl font-bold text-[#061643]">{product.name}</h3><p className="mt-2 font-semibold text-[#0873ce]">{product.unit}</p><p className="mt-2 text-sm leading-6 text-slate-600">{product.use}</p><div className="relative mt-4 h-72"><Image src={product.src} alt={product.alt} fill unoptimized sizes="(max-width:640px) 90vw,(max-width:1024px) 45vw,22vw" className="object-contain object-bottom" /></div></article>)}</div><div className="mt-10 flex flex-wrap justify-center gap-3"><Link href="/contacto" className="button-primary">Consultar disponibilidad</Link><Link href="/contacto" className="button-secondary">Solicitar información mayorista</Link></div></div></section>;
}
