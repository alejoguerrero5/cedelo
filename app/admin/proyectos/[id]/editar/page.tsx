"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type PropertyStatus = Property["status"];
type PropertyType = Property["type"];

type ProjectFormValues = {
  title: string;
  city: string;
  neighborhood: string;
  currentPrice: number;
  originalPrice: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  status: PropertyStatus;
  type: PropertyType;
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const paramId = params.id;
  const isCreateMode = paramId === "nuevo";

  const [loading, setLoading] = useState(!isCreateMode);
  const [property, setProperty] = useState<Property | null>(null);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      city: "",
      neighborhood: "",
      currentPrice: 0,
      originalPrice: 0,
      area: 70,
      bedrooms: 2,
      bathrooms: 2,
      status: "en-planos",
      type: "apartamento",
    },
  });

  useEffect(() => {
    if (isCreateMode) return;

    const loadProperty = async () => {
      const res = await fetch(`/api/properties/${paramId}`);
      if (!res.ok) {
        toast.error("No se pudo cargar el proyecto");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProperty(data);
      form.reset({
        title: data.title || "",
        city: data.city || "",
        neighborhood: data.neighborhood || "",
        currentPrice: data.current_price || 0,
        originalPrice: data.original_price || 0,
        area: data.area || 70,
        bedrooms: data.bedrooms || 2,
        bathrooms: data.bathrooms || 2,
        status: data.status || "en-planos",
        type: data.type || "apartamento",
      });
      setLoading(false);
    };

    loadProperty();
  }, [isCreateMode, paramId, form]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">Cargando proyecto...</p>
      </div>
    );
  }

  if (!isCreateMode && !property) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">Proyecto no encontrado.</p>
      </div>
    );
  }

  const save = async (values: ProjectFormValues) => {
    const payload = {
      title: values.title,
      city: values.city,
      neighborhood: values.neighborhood,
      currentPrice: values.currentPrice,
      originalPrice: values.originalPrice,
      area: values.area,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      status: values.status,
      type: values.type,
      isVIS: false, // Asumiendo por defecto
    };

    try {
      let res: Response;
      if (isCreateMode) {
        res = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/properties/${paramId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar");
      }

      toast.success(isCreateMode ? "Proyecto creado" : "Cambios guardados");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar los cambios");
    }
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-card">
      <div className="flex flex-col gap-4 border-b border-border/50 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {isCreateMode ? "Crear proyecto" : "Editar proyecto"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Los cambios se guardan en la base de datos.
          </p>
        </div>
        <Badge variant="outline" className="border-primary text-primary">
          {isCreateMode ? "Nuevo" : `ID ${property?.id}`}
        </Badge>
      </div>

      <form onSubmit={form.handleSubmit(save)}>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input {...form.register("title", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ciudad</label>
            <Input {...form.register("city", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Barrio</label>
            <Input {...form.register("neighborhood", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Input {...form.register("type", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Input {...form.register("status", { required: true })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Precio actual (M)</label>
            <Input
              type="number"
              {...form.register("currentPrice", {
                valueAsNumber: true,
                min: 0,
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Precio original (M)</label>
            <Input
              type="number"
              {...form.register("originalPrice", {
                valueAsNumber: true,
                min: 0,
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Área (m²)</label>
            <Input
              type="number"
              {...form.register("area", { valueAsNumber: true, min: 1 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Habitaciones</label>
            <Input
              type="number"
              {...form.register("bedrooms", { valueAsNumber: true, min: 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Baños</label>
            <Input
              type="number"
              {...form.register("bathrooms", { valueAsNumber: true, min: 0 })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/50 p-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
