import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Property } from "@/types/property";
import { toast } from "sonner";

interface InterestModalProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  "Ibagué",
];

const InterestModal = ({
  property,
  open,
  onOpenChange,
}: InterestModalProps) => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    celular: "",
    ciudad: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      e.correo = "Ingresa un correo válido";
    if (
      !form.celular.trim() ||
      !/^\d{7,10}$/.test(form.celular.replace(/\s/g, ""))
    )
      e.celular = "Ingresa un celular válido";
    if (!form.ciudad) e.ciudad = "Selecciona una ciudad";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    toast.success("¡Gracias por tu interés! Te contactaremos pronto.");
    setForm({ nombre: "", correo: "", celular: "", ciudad: "" });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Me interesa esta propiedad</DialogTitle>
          <DialogDescription>
            {property?.title} — COP ${property?.currentPrice}M
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive mt-1">{errors.nombre}</p>
            )}
          </div>
          <div>
            <Label htmlFor="correo">Correo electrónico</Label>
            <Input
              id="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
            {errors.correo && (
              <p className="text-xs text-destructive mt-1">{errors.correo}</p>
            )}
          </div>
          <div>
            <Label htmlFor="celular">Celular</Label>
            <Input
              id="celular"
              type="tel"
              placeholder="3001234567"
              value={form.celular}
              onChange={(e) => setForm({ ...form, celular: e.target.value })}
            />
            {errors.celular && (
              <p className="text-xs text-destructive mt-1">{errors.celular}</p>
            )}
          </div>
          <div>
            <Label>Ciudad de residencia</Label>
            <Select
              value={form.ciudad}
              onValueChange={(v) => setForm({ ...form, ciudad: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu ciudad" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ciudad && (
              <p className="text-xs text-destructive mt-1">{errors.ciudad}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full gradient-cta text-primary-foreground"
          >
            Enviar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterestModal;
