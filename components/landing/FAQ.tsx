"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "¿Qué es la cesión de contrato?",
    answer:
      "La cesión de contrato es un proceso legal mediante el cual transfieres tus derechos y obligaciones de un contrato de compraventa de vivienda sobre planos a un tercero. Esto te permite recuperar la inversión realizada y, en muchos casos, obtener una ganancia por la valorización del proyecto.",
  },
  {
    question: "¿Cuánto cobran por el servicio?",
    answer:
      "Publicar tu propiedad en CEDELO es completamente gratis. Solo cobramos una comisión del éxito una vez se concrete la cesión. Nuestras tarifas son competitivas y transparentes, sin costos ocultos.",
  },
  {
    question: "¿Cuánto tiempo tarda el proceso?",
    answer:
      "El tiempo puede variar según el proyecto, ubicación y precio. En promedio, nuestros clientes logran ceder sus contratos entre 30 y 90 días. Proyectos en zonas de alta demanda suelen tener tiempos más cortos.",
  },
  {
    question: "¿Qué documentos necesito?",
    answer:
      "Necesitarás el contrato de promesa de compraventa original, documentos de identificación, comprobantes de los pagos realizados a la constructora, y el paz y salvo de cuotas. Nuestro equipo te guiará en la recopilación de todos los documentos necesarios.",
  },
  {
    question: "¿Es legal ceder mi contrato?",
    answer:
      "Sí, la cesión de contrato es completamente legal en Colombia, siempre que esté permitida en tu contrato original y se realice siguiendo los procedimientos establecidos. Contamos con un equipo jurídico especializado que garantiza que todo el proceso cumpla con la normativa vigente.",
  },
  {
    question: "¿Puedo cancelar la publicación?",
    answer:
      "Por supuesto. Puedes retirar tu publicación en cualquier momento sin ningún costo ni penalidad. Entendemos que las circunstancias pueden cambiar y respetamos tu decisión.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-section">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Tienes dudas?
          </h2>
          <p className="text-lg text-muted-foreground">
            Resolvemos las preguntas más comunes sobre la cesión de contratos
            inmobiliarios.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border/50 px-6 shadow-sm data-[state=open]:shadow-card transition-all"
              >
                <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:text-primary py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
