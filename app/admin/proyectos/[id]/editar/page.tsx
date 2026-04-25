"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities, propertyTypes } from "@/data/options";

type PropertyType = Property["type"];

type LeadOption = {
  id: string;
  name: string | null;
  email: string | null;
};

type ProjectFormValues = {
  projectName: string;
  city: string;
  neighborhood: string;
  currentPrice: number;
  originalPrice: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: PropertyType;
  deliveryDate: string;
  isVIS: "vis" | "no-vis";
  images: string[];
  leadId: string;
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const paramId = params.id;
  const isCreateMode = paramId === "nuevo";

  const [loading, setLoading] = useState(!isCreateMode);
  const [uploading, setUploading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [property, setProperty] = useState<Property | null>(null);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      projectName: "",
      city: "",
      neighborhood: "",
      currentPrice: 0,
      originalPrice: 0,
      area: 70,
      bedrooms: 2,
      bathrooms: 2,
      type: "apartamento",
      deliveryDate: "",
      isVIS: "no-vis",
      images: [],
      leadId: "",
    },
  });

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("No se pudieron cargar los leads");
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los dueños");
      } finally {
        setLeadsLoading(false);
      }
    };

    loadLeads();
  }, []);

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
        projectName: data.projectName || data.title || "",
        city: data.city || "",
        neighborhood: data.neighborhood || "",
        currentPrice: data.currentPrice || data.current_price || 0,
        originalPrice: data.originalPrice || data.original_price || 0,
        area: data.area || 70,
        bedrooms: data.bedrooms || 2,
        bathrooms: data.bathrooms || 2,
        type: data.type || "apartamento",
        deliveryDate: data.deliveryDate || data.delivery_date || "",
        isVIS: Boolean(data.isVIS || data.is_vis) ? "vis" : "no-vis",
        images: Array.isArray(data.images) ? data.images : [],
        leadId: data.lead_id || "",
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

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/properties/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error subiendo imagen");
        }

        const data = await res.json();
        if (data?.url) uploadedUrls.push(data.url);
      }

      const current = form.getValues("images");
      form.setValue("images", [...current, ...uploadedUrls], {
        shouldDirty: true,
      });
      toast.success("Imágenes subidas");
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageUrl: string) => {
    const current = form.getValues("images");
    form.setValue(
      "images",
      current.filter((value) => value !== imageUrl),
      { shouldDirty: true },
    );
  };

  const save = async (values: ProjectFormValues) => {
    const payload = {
      projectName: values.projectName,
      city: values.city,
      neighborhood: values.neighborhood,
      currentPrice: values.currentPrice,
      originalPrice: values.originalPrice,
      area: values.area,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      type: values.type,
      isVIS: values.isVIS === "vis",
      deliveryDate: values.deliveryDate || null,
      status: "en-venta",
      images: values.images,
      ...(values.leadId.trim().length > 0
        ? { leadId: values.leadId.trim() }
        : {}),
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
            <label className="text-sm font-medium">Nombre del proyecto</label>
            <Input {...form.register("projectName", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ciudad</label>
            <Controller
              control={form.control}
              name="city"
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Barrio</label>
            <Input {...form.register("neighborhood", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Controller
              control={form.control}
              name="type"
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>
                        {pt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
            <label className="text-sm font-medium">Precio inicial (M)</label>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de entrega</label>
            <Input type="date" {...form.register("deliveryDate")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Dueño del proyecto</label>
            <Controller
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "__none__" ? "" : value)
                  }
                  value={field.value || "__none__"}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        leadsLoading
                          ? "Cargando dueños..."
                          : "Selecciona un dueño (opcional)"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sin dueño asociado</SelectItem>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name || "Sin nombre"}
                        {lead.email ? ` · ${lead.email}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Imágenes</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => uploadImages(e.target.files)}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-xs text-muted-foreground">Subiendo...</p>
            )}
            <div className="space-y-2">
              {form.watch("images").map((imageUrl) => (
                <div
                  key={imageUrl}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/50 px-3 py-2"
                >
                  <span className="truncate text-xs text-muted-foreground">
                    {imageUrl}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(imageUrl)}
                  >
                    Quitar
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Tipo de vivienda
            </Label>
            <Controller
              control={form.control}
              name="isVIS"
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="vis" id="project-vis" />
                    <Label htmlFor="project-vis" className="cursor-pointer">
                      VIS
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no-vis" id="project-no-vis" />
                    <Label htmlFor="project-no-vis" className="cursor-pointer">
                      No VIS
                    </Label>
                  </div>
                </RadioGroup>
              )}
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
