"use client";
import { UserPlus, CheckCircle2, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Regístrate y publica tu proyecto",
    description:
      "Crea tu cuenta gratuita y comparte los detalles de tu propiedad sobre planos en minutos.",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Verificamos y promovemos tu propiedad",
    description:
      "Nuestro equipo verifica la información y promociona tu inmueble a nuestra red de inversionistas.",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Conectamos con inversionistas",
    description:
      "Te presentamos compradores calificados y te acompañamos en todo el proceso de cesión.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="section-padding bg-background">
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
            Proceso Simple
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cómo funciona CEDELO?
          </h2>
          <p className="text-lg text-muted-foreground">
            En tres simples pasos puedes comenzar a recuperar tu inversión y
            generar ganancias.
          </p>
        </motion.div>

        {/* Steps */}

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 h-full group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-8 bg-[#22C55E] text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full">
                  Paso {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow for Mobile/Tablet */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center -mt-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
