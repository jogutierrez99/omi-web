"use client";

import Link from "next/link";
import { useState } from "react";

const links = [["#inicio", "Inicio"], ["#nuestra-agua", "Nuestra agua"], ["#formatos", "Formatos"], ["#calidad", "Calidad"], ["#sostenibilidad", "Sostenibilidad"], ["#contacto", "Contacto"]];

function Logo() {
  return <span className="flex items-center gap-2 text-2xl font-extrabold tracking-[-.07em] text-[#061643]"><span className="grid size-10 place-items-center rounded-full bg-[#061643] text-lg text-white">O</span>OMI</span>;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur"><nav aria-label="Navegación principal" className="page-container flex h-20 items-center justify-between lg:h-24"><Link href="#inicio" aria-label="OMI, ir al inicio"><Logo /></Link><ul className="hidden items-center gap-7 text-sm font-medium text-[#061643] lg:flex">{links.map(([href,label], index) => <li key={href}><Link href={href} aria-current={index === 0 ? "page" : undefined} className={`nav-link ${index === 0 ? "active" : ""}`}>{label}</Link></li>)}</ul><div className="relative lg:hidden"><button type="button" aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setIsOpen(open => !open)} className="grid size-11 place-items-center rounded-full border border-blue-200 text-[#061643] hover:bg-blue-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#58aceb]"><span className="text-2xl" aria-hidden="true">{isOpen ? "×" : "☰"}</span></button>{isOpen && <div id="mobile-navigation" className="absolute right-0 top-14 w-64 rounded-2xl border border-blue-100 bg-white p-2 shadow-xl">{links.map(([href,label]) => <Link key={href} href={href} onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#061643] hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#58aceb]">{label}</Link>)}</div>}</div></nav></header>;
}
