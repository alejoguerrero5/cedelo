"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { mockProperties } from "@/data/mockProperties";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CREATED_PROJECTS_KEY, OVERRIDES_KEY } from "@/lib/adminStorage";

type PropertyOverrides = Record<number, Partial<Property>>;
type PropertyStatus = Property["status"];
type PropertyType = Property["type"];

type ProjectFormValues = {
  title: string;
  city: string;
  neighborhood: string;
  currentPrice: number;
  originalPrice: number;
  roi: number;
  discount: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  status: PropertyStatus;
  type: PropertyType;
  completionPercent: number;
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const paramId = params.id;
  const isCreateMode = paramId === "nuevo";
  const numericId = Number(paramId);

  const [createdProjects, setCreatedProjects] = useState<Property[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      city: "",
      neighborhood: "",
      currentPrice: 0,
      originalPrice: 0,
      roi: 0,
      discount: 0,
      area: 70,
      bedrooms: 2,
      bathrooms: 2,
      status: "en-planos",
      type: "apartamento",
      completionPercent: 0,
    },
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CREATED_PROJECTS_KEY);
      const list: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) setCreatedProjects(list as Property[]);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const base = useMemo(() => {
    if (isCreateMode) return null;
    const fromMock = mockProperties.find((p) => p.id === numericId);
    if (fromMock) return fromMock;
    return createdProjects.find((p) => p.id === numericId) ?? null;
  }, [createdProjects, isCreateMode, numericId]);

  useEffect(() => {
    if (isCreateMode) return;
    if (!base) return;

    const isCreated = createdProjects.some((p) => p.id === base.id);
    let override: Partial<Property> | null = null;
    if (!isCreated) {
      try {
        const raw = localStorage.getItem(OVERRIDES_KEY);
        const ov = raw ? (JSON.parse(raw) as PropertyOverrides) : {};
        override = ov?.[base.id] ?? null;
      } catch {
        // ignore
      }
    }

    const merged = { ...base, ...(override ?? {}) };
    form.reset({
      title: merged.title,
      city: merged.city,
      neighborhood: merged.neighborhood,
      currentPrice: merged.currentPrice,
      originalPrice: merged.originalPrice,
      roi: merged.roi,
      discount: merged.discount,
      area: merged.area,
      bedrooms: merged.bedrooms,
      bathrooms: merged.bathrooms,
      status: merged.status,
      type: merged.type,
      completionPercent: merged.completionPercent,
    });
  }, [base, createdProjects, form, isCreateMode]);

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">Cargando proyecto...</p>
      </div>
    );
  }

  if (!isCreateMode && (!base || !Number.isFinite(numericId))) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">Proyecto no encontrado.</p>
      </div>
    );
  }

  const save = (values: ProjectFormValues) => {
    try {
      if (isCreateMode) {
        const allExisting = [...mockProperties, ...createdProjects];
        const nextId = Math.max(...allExisting.map((p) => p.id), 0) + 1;
        const createdAt = new Date().toISOString().slice(0, 10);
        const newProject: Property = {
          id: nextId,
          image: "/placeholder.svg",
          isVIS: false,
          createdAt,
          ...values,
        };
        const updated = [...createdProjects, newProject];
        localStorage.setItem(CREATED_PROJECTS_KEY, JSON.stringify(updated));
        toast.success("Proyecto creado");
      } else if (base) {
        const isCreated = createdProjects.some((p) => p.id === base.id);
        if (isCreated) {
          const updated = createdProjects.map((p) =>
            p.id === base.id
              ? {
                  ...p,
                  ...values,
                }
              : p,
          );
          localStorage.setItem(CREATED_PROJECTS_KEY, JSON.stringify(updated));
        } else {
          const raw = localStorage.getItem(OVERRIDES_KEY);
          const current = raw ? (JSON.parse(raw) as PropertyOverrides) : {};
          const next: PropertyOverrides = {
            ...(current ?? {}),
            [base.id]: { ...values },
          };
          localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
        }
        toast.success("Cambios guardados");
      }
      router.push("/admin");
      router.refresh();
    } catch {
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
            Cambios guardados localmente (por ahora).
          </p>
        </div>
        <Badge variant="outline" className="border-primary text-primary">
          {isCreateMode ? "Nuevo" : `ID ${base?.id}`}
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
              {...form.register("currentPrice", { valueAsNumber: true, min: 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Precio original (M)</label>
            <Input
              type="number"
              {...form.register("originalPrice", { valueAsNumber: true, min: 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">ROI (%)</label>
            <Input
              type="number"
              {...form.register("roi", { valueAsNumber: true, min: 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Descuento (%)</label>
            <Input
              type="number"
              {...form.register("discount", { valueAsNumber: true, min: 0 })}
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
          <div className="space-y-2">
            <label className="text-sm font-medium">% Construcción</label>
            <Input
              type="number"
              {...form.register("completionPercent", {
                valueAsNumber: true,
                min: 0,
                max: 100,
              })}
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

