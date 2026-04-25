"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatPrice(price: number) {
  return `COP $${price}M`;
}

function statusLabel(status: Property["status"]) {
  if (status === "en-venta") return "En venta";
  if (status === "en-planos") return "En planos";
  return "En construcción";
}

function statusVariant(status: Property["status"]) {
  return status === "en-venta" ? ("default" as const) : ("secondary" as const);
}

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      const res = await fetch("/api/properties");
      if (!res.ok) {
        toast.error("No se pudieron cargar los proyectos");
        return;
      }

      const data = await res.json();
      setProperties(data ?? []);
    };

    loadProperties();
  }, []);

  const rows = useMemo(
    () =>
      [...properties].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [properties],
  );
  console.log("rows", rows);
  const softDelete = async (id: string) => {
    const property = rows.find((p) => p.id === id);
    if (!property) return;

    const ok = window.confirm(`¿Eliminar "${property.projectName}"?`);
    if (!ok) return;

    const res = await fetch(`/api/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_deleted: true }),
    });

    if (!res.ok) {
      toast.error("No se pudo eliminar el proyecto");
      return;
    }

    setProperties((prev) => prev.filter((item) => item.id !== id));
    toast.success("Proyecto eliminado");
  };

  return (
    <div className="space-y-6">
      <div className="group rounded-2xl border border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-semibold text-primary mb-2 tracking-wide uppercase">
                Panel
              </span>

              <h2 className="text-2xl font-bold text-foreground">Proyectos</h2>

              <p className="text-sm text-muted-foreground mt-1">
                Gestiona y administra tus propiedades publicadas
              </p>
            </div>

            <Badge variant="outline" className="border-primary text-primary">
              {rows.length} activos
            </Badge>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div />

            <Button asChild className="gap-2 shadow-blue">
              <Link href="/admin/proyectos/nuevo/editar">
                <Plus className="h-4 w-4" />
                Nuevo proyecto
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="overflow-hidden rounded-2xl border border-border/50">
          <Table>
            <TableHeader className="bg-secondary/60">
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {p.projectName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.type} · {p.area}m² · {p.bedrooms} hab · {p.bathrooms}{" "}
                      baños
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-foreground">{p.city}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.neighborhood}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold">
                      {formatPrice(p.currentPrice)}
                    </div>
                    <div className="text-xs text-muted-foreground line-through">
                      {formatPrice(p.originalPrice)}
                    </div>
                    <div className="text-xs text-success font-semibold">
                      {p.discount}% OFF
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-primary text-primary"
                    >
                      {p?.roi}%
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusVariant(p.status)}>
                      {statusLabel(p.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {p.createdAt}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Link href={`/admin/proyectos/${p.id}/editar`}>
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        onClick={() => softDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No hay proyectos activos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
