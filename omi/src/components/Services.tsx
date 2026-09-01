const services = [
  {
    title: "Servicio personalizado",
    description: "Atención adaptada a tus necesidades.",
  },
  {
    title: "Calidad",
    description: "Una propuesta centrada en la confianza y el cuidado.",
  },
  { title: "Cercanía", description: "Un equipo disponible para ayudarte." },
];

export function Services() {
  return (
    <section id="servicios" aria-labelledby="services-title">
      <h2 id="services-title">Servicios</h2>
      <div>
        {services.map((service) => (
          <article key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
