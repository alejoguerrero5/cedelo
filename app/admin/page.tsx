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
  return `COP $${price}`;
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

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
        <Table>
          <TableHeader className="bg-white/90 [&_tr]:border-border/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 text-foreground/70">
                Proyecto
              </TableHead>
              <TableHead className="text-foreground/70">Ubicación</TableHead>
              <TableHead className="text-foreground/70">Precio</TableHead>
              <TableHead className="text-foreground/70">ROI</TableHead>
              <TableHead className="text-foreground/70">Estado</TableHead>
              <TableHead className="text-foreground/70">Creado</TableHead>
              <TableHead className="px-6 text-right text-foreground/70">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="[&_tr:last-child]:border-b-0">
            {rows.length === 0 ? (
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableCell
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No hay proyectos activos.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-border/40 bg-gray-50/85 hover:bg-white/95"
                >
                  <TableCell className="px-6">
                    <div className="font-semibold text-foreground">
                      {p.projectName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.type} · {p.area}m² · {p.bedrooms} hab · {p.bathrooms}{" "}
                      baños
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-foreground">{p.city}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.neighborhood}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {formatPrice(p.currentPrice)}
                    </div>
                    <div className="text-xs text-muted-foreground line-through">
                      {formatPrice(p.originalPrice)}
                    </div>
                    <div className="text-xs font-semibold text-success">
                      {p.discount}% OFF
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-primary/25 bg-primary/5 text-primary"
                    >
                      {p.roi}%
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusVariant(p.status)}>
                      {statusLabel(p.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {p.createdAt}
                  </TableCell>

                  <TableCell className="px-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-white shadow-sm"
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
