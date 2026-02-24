"use client";
import { TrendingUp, PiggyBank, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: PiggyBank,
    title: "Recupera tu inversión inicial",
    description:
      "Obtén de vuelta el dinero que has pagado a la constructora, más la valorización del proyecto.",
  },
  {
    icon: TrendingUp,
    title: "Genera ganancia adicional",
    description:
      "Aprovecha la valorización del proyecto y obtén rendimientos superiores a inversiones tradicionales.",
  },
  {
    icon: ShieldCheck,
    title: "Proceso legal seguro",
    description:
      "Contamos con un equipo jurídico experto que garantiza una cesión transparente y legalmente válida.",
  },
  {
    icon: Sparkles,
    title: "Sin complicaciones",
    description:
      "Nos encargamos de todo el proceso. Tú solo publicas y nosotros hacemos el resto.",
  },
];

const Benefits = () => {
  return (
    <section id="beneficios" className="section-padding bg-secondary">
      <div className="container-section">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
            Ventajas Exclusivas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Por qué ceder tu contrato con CEDELO?
          </h2>
          <p className="text-lg text-muted-foreground">
            Te ofrecemos la mejor plataforma para maximizar tu inversión
            inmobiliaria.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-8 h-full shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20">
                <div className="flex gap-5">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-r from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-blue group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
