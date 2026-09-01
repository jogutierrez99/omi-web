import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <p>OMI</p>
      <nav aria-label="Navegación del pie de página">
        <Link href="#servicios">Servicios</Link>
        <Link href="#sobre-nosotros">Sobre nosotros</Link>
        <Link href="#contacto">Contacto</Link>
      </nav>
    </footer>
  );
}
