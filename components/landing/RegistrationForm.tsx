"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { toast } from "sonner";

const cities = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Santa Marta",
  "Manizales",
  "Villavicencio",
  "Ibagué",
  "Otra ciudad",
];

const propertyTypes = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
];

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  tipoProyecto: string;
  esVIS: string;
  aceptaTerminos: boolean;
};

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      ciudad: "",
      tipoProyecto: "",
      esVIS: "",
      aceptaTerminos: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Simula llamada API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmittedData(data);
    setIsSubmitted(true);
    console.log("Datos del formulario:", data);
    toast.success("¡Registro exitoso! Te contactaremos pronto.");
  };

  if (isSubmitted && submittedData) {
    const isVIS = submittedData.esVIS === "vis";
    return (
      <section id="registro" className="section-padding bg-secondary">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center bg-card rounded-3xl p-12 shadow-card"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isVIS ? "bg-destructive/10" : "bg-success/10"
              }`}
            >
              <CheckCircle2
                className={`w-10 h-10 ${
                  isVIS ? "text-destructive" : "text-success"
                }`}
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {isVIS ? "Registro no permitido" : "¡Gracias por registrarte!"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isVIS
                ? "Lamentablemente, por el momento no es posible registrar propiedades de tipo VIS."
                : "Hemos recibido tu información. Un asesor de CEDELO se comunicará contigo en las próximas 24 horas."}
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                reset();
              }}
              variant="outline"
            >
              Registrar otra propiedad
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="registro" className="section-padding bg-secondary">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
            Comienza Ahora
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Publica tu propiedad gratis
          </h2>
          <p className="text-lg text-muted-foreground">
            Completa el formulario y un asesor te contactará para ayudarte a
            ceder tu contrato.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border/50"
          >
            <div className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label
                  htmlFor="nombre"
                  className="text-sm font-medium text-foreground"
                >
                  Nombre completo
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Carlos Rodríguez"
                  className={`h-12 bg-secondary border-border focus:border-primary ${
                    errors.nombre ? "border-destructive" : ""
                  }`}
                  {...register("nombre", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {errors.nombre && (
                  <p className="text-sm text-destructive">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className={`h-12 bg-secondary border-border focus:border-primary ${
                    errors.email ? "border-destructive" : ""
                  }`}
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un email válido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label
                  htmlFor="telefono"
                  className="text-sm font-medium text-foreground"
                >
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="300 123 4567"
                  className={`h-12 bg-secondary border-border focus:border-primary ${
                    errors.telefono ? "border-destructive" : ""
                  }`}
                  {...register("telefono", {
                    required: "El teléfono es requerido",
                    pattern: {
                      value: /^\d{10,10}$/,
                      message: "Ingresa un teléfono válido",
                    },
                  })}
                />
                {errors.telefono && (
                  <p className="text-xs text-destructive">
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              {/* Ciudad & Tipo */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Ciudad */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Ciudad
                  </Label>
                  <Controller
                    name="ciudad"
                    control={control}
                    rules={{ required: "Selecciona una ciudad" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`h-12 bg-secondary border-border ${
                            errors.ciudad ? "border-destructive" : ""
                          }`}
                        >
                          <SelectValue placeholder="Selecciona ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.ciudad && (
                    <p className="text-xs text-destructive">
                      {errors.ciudad.message}
                    </p>
                  )}
                </div>

                {/* Tipo Proyecto */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Tipo de proyecto
                  </Label>
                  <Controller
                    name="tipoProyecto"
                    control={control}
                    rules={{ required: "Selecciona el tipo de proyecto" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`h-12 bg-secondary border-border ${
                            errors.tipoProyecto ? "border-destructive" : ""
                          }`}
                        >
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipoProyecto && (
                    <p className="text-xs text-destructive">
                      {errors.tipoProyecto.message}
                    </p>
                  )}
                </div>
              </div>

              {/* VIS / No VIS */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Tipo de vivienda
                </Label>
                <Controller
                  name="esVIS"
                  control={control}
                  rules={{
                    required: "Selecciona si el proyecto es VIS o No VIS",
                  }}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="vis" id="vis" />
                        <Label
                          htmlFor="vis"
                          className="text-sm text-foreground cursor-pointer"
                        >
                          VIS (Vivienda de Interés Social)
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no-vis" id="no-vis" />
                        <Label
                          htmlFor="no-vis"
                          className="text-sm text-foreground cursor-pointer"
                        >
                          No VIS
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.esVIS && (
                  <p className="text-xs text-destructive">
                    {errors.esVIS.message}
                  </p>
                )}
              </div>

              {/* Términos */}
              <div className="space-y-2">
                <Controller
                  name="aceptaTerminos"
                  control={control}
                  rules={{
                    required: "Debes aceptar los términos y condiciones",
                  }}
                  render={({ field }) => (
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terminos"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="terminos"
                        className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                      >
                        Acepto los{" "}
                        <a href="#" className="text-primary hover:underline">
                          términos y condiciones
                        </a>{" "}
                        y la{" "}
                        <a href="#" className="text-primary hover:underline">
                          política de privacidad
                        </a>
                      </Label>
                    </div>
                  )}
                />
                {errors.aceptaTerminos && (
                  <p className="text-xs text-destructive">
                    {errors.aceptaTerminos.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-14 text-base font-semibold gradient-cta shadow-blue hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  <>
                    Quiero ceder mi propiedad
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationForm;
