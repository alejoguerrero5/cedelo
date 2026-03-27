"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { mockProperties } from "@/data/mockProperties";
import type { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CREATED_PROJECTS_KEY,
  DELETED_IDS_KEY,
  OVERRIDES_KEY,
} from "@/lib/adminStorage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PropertyOverrides = Record<number, Partial<Property>>;

function formatPrice(price: number) {
  return `COP $${price}M`;
}

function statusLabel(status: Property["status"]) {
  return status === "en-planos" ? "En planos" : "En construcción";
}

function statusVariant(status: Property["status"]) {
  return status === "en-planos" ? ("secondary" as const) : ("default" as const);
}

export default function AdminDashboardPage() {
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [overrides, setOverrides] = useState<PropertyOverrides>({});
  const [createdProjects, setCreatedProjects] = useState<Property[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DELETED_IDS_KEY);
      const ids: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(ids)) {
        setDeletedIds(new Set(ids.filter((x) => typeof x === "number")));
      }
    } catch {
      // ignore
    }

    try {
      const raw = localStorage.getItem(OVERRIDES_KEY);
      const ov: unknown = raw ? JSON.parse(raw) : {};
      if (ov && typeof ov === "object") {
        const normalized: PropertyOverrides = {};
        for (const [k, v] of Object.entries(ov as Record<string, unknown>)) {
          const id = Number(k);
          if (!Number.isFinite(id)) continue;
          if (v && typeof v === "object")
            normalized[id] = v as Partial<Property>;
        }
        setOverrides(normalized);
      }
    } catch {
      // ignore
    }

    try {
      const raw = localStorage.getItem(CREATED_PROJECTS_KEY);
      const list: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        setCreatedProjects(list as Property[]);
      }
    } catch {
      // ignore
    }
  }, []);

  const rows = useMemo(() => {
    const base = [...mockProperties, ...createdProjects];
    return base
      .filter((p) => !deletedIds.has(p.id))
      .map((p) => ({ ...p, ...(overrides[p.id] ?? {}) }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [createdProjects, deletedIds, overrides]);

  const softDelete = (id: number) => {
    const property = rows.find((p) => p.id === id);
    if (!property) return;

    const ok = window.confirm(
      `¿Eliminar "${property.title}"? (soft delete, se puede recuperar luego)`,
    );
    if (!ok) return;

    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(next)));
      return next;
    });

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
                      {p.title}
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
                      {p.roi}%
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
