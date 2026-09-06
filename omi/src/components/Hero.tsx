import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="hero-bg relative overflow-hidden">
      <div className="page-container grid min-h-[620px] items-center gap-2 pt-14 lg:min-h-[720px] lg:grid-cols-[.86fr_1.14fr] lg:pt-0">
        <div className="relative z-10 py-8 lg:py-16">
          <p className="eyebrow">Agua mineral natural</p>
          <h1 id="hero-title" className="mt-4 max-w-xl text-5xl font-bold leading-[1.02] tracking-[-.045em] text-[#061643] sm:text-6xl lg:text-7xl">Pureza que acompaña tu día</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-700">Agua mineral pensada para acompañarte en casa, en el trabajo y en cada momento del día.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#formatos" className="button-primary">Conoce nuestros formatos</Link>
            <Link href="#contacto" className="button-secondary">Contáctanos</Link>
          </div>
        </div>
        <div className="relative z-10 min-h-[380px] w-full max-w-[720px] origin-bottom-left scale-[1.1] self-end sm:min-h-[470px] sm:scale-[1.12] lg:min-h-[600px] lg:scale-[1.15]" role="img" aria-label="Formatos de agua mineral OMI de 5 litros, 18 litros, 1,5 litros y 300 centímetros cúbicos">
          <div className="absolute bottom-[2%] left-0 z-30 w-[40%] lg:w-[42%]">
            <Image src="/images/products/water-5l.png" alt="" width={1122} height={1402} loading="eager" unoptimized sizes="(max-width: 1024px) 40vw, 25vw" className="h-auto w-full object-contain" />
          </div>
          <div className="absolute bottom-0 left-[18%] z-20 w-[54%] lg:left-[19%] lg:w-[56%]">
            <Image src="/images/products/water-18l.png" alt="" width={1122} height={1402} priority unoptimized sizes="(max-width: 1024px) 54vw, 34vw" className="h-auto w-full object-contain" />
          </div>
          <div className="absolute bottom-[3%] left-[49%] z-40 w-[33%] lg:left-[49%] lg:w-[34%]">
            <Image src="/images/products/water-1-5l.png" alt="" width={1122} height={1402} unoptimized sizes="(max-width: 1024px) 33vw, 20vw" className="h-auto w-full object-contain" />
          </div>
          <div className="absolute bottom-[5%] left-[68%] z-30 w-[20%] lg:left-[68%] lg:w-[20%]">
            <Image src="/images/products/water-300cc.png" alt="" width={1024} height={1536} unoptimized sizes="(max-width: 1024px) 20vw, 12vw" className="h-auto w-full object-contain" />
          </div>
        </div>
      </div>
      <div className="wave" aria-hidden="true" />
    </section>
  );
}
