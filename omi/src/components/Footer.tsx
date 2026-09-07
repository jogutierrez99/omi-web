import Image from "next/image";
import Link from "next/link";
export function Footer() {
  return <footer className="bg-white py-10 text-[#061643]"><div className="page-container grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-center"><div><Image src="/images/brand/omi-logo.png" alt="OMI" width={1962} height={802} sizes="112px" className="h-12 w-auto object-contain" /><p className="mt-3 text-sm italic text-slate-600">Tu salud lo vale</p></div><nav aria-label="Navegación del pie de página" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600 md:justify-end"><Link href="#nuestra-agua">Nuestra agua</Link><Link href="#productos">Productos</Link><Link href="#franquicias">Franquicias</Link><Link href="#contacto">Contacto</Link></nav></div><div className="page-container mt-8 border-t border-blue-100 pt-6 text-xs text-slate-500">© OMI · Embotelladora OMI C.A.</div></footer>;
}
