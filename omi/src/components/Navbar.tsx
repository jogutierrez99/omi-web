import Link from "next/link";

const navigationItems = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#sobre-nosotros", label: "Sobre nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  return (
    <header>
      <nav aria-label="Navegación principal">
        <Link href="#inicio" aria-label="OMI, ir al inicio">
          OMI
        </Link>
        <ul>
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
