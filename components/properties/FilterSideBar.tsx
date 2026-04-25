import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { defaultFilters, Filters } from "@/types/property";
import { cities } from "@/data/options";

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeCount: number;
}

const FilterSidebar = ({
  filters,
  onFiltersChange,
  activeCount,
}: FilterSidebarProps) => {
  const formatCOP = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const update = (partial: Partial<Filters>) =>
    onFiltersChange({ ...filters, ...partial });

  const toggleType = (type: string) => {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    update({ types });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtrar propiedades
          {activeCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              {activeCount}
            </Badge>
          )}
        </h3>
      </div>

      {/* Ciudad */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Ubicación</Label>
        <Select value={filters.city} onValueChange={(v) => update({ city: v })}>
          <SelectTrigger className="h-10 bg-gray-50 shadow text-foreground">
            <SelectValue placeholder="Todas las ciudades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ciudades</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Precio */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Rango de precio (COP)</Label>
        <Slider
          min={50_000_000}
          max={800_000_000}
          step={10_000_000}
          value={[filters.priceMin, filters.priceMax]}
          onValueChange={([min, max]) =>
            update({ priceMin: min, priceMax: max })
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCOP(filters.priceMin)}</span>
          <span>{formatCOP(filters.priceMax)}</span>
        </div>
      </div>

      {/* Tipo */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de propiedad</Label>
        <div className="space-y-2">
          {["apartamento", "casa"].map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                checked={filters.types.includes(type)}
                onCheckedChange={() => toggleType(type)}
                id={`type-${type}`}
              />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm cursor-pointer capitalize"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Estado del proyecto</Label>
        <Select
          value={filters.status}
          onValueChange={(v) => update({ status: v })}
        >
          <SelectTrigger className="h-10 bg-gray-50 shadow text-foreground">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="en-planos">En planos</SelectItem>
            <SelectItem value="en-construccion">En construcción</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Descuento */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Descuento mínimo: {filters.discountMin}%
        </Label>
        <Slider
          min={0}
          max={50}
          step={1}
          value={[filters.discountMin]}
          onValueChange={([v]) => update({ discountMin: v })}
        />
      </div>

      {/* ROI */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          ROI mínimo: {filters.roiMin}%
        </Label>
        <Slider
          min={0}
          max={40}
          step={1}
          value={[filters.roiMin]}
          onValueChange={([v]) => update({ roiMin: v })}
        />
      </div>

      {/* Área */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Área (m²)</Label>
        <Slider
          min={30}
          max={300}
          step={5}
          value={[filters.areaMin, filters.areaMax]}
          onValueChange={([min, max]) => update({ areaMin: min, areaMax: max })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{filters.areaMin}m²</span>
          <span>{filters.areaMax}m²</span>
        </div>
      </div>

      {/* Habitaciones */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Habitaciones</Label>
        <Select
          value={filters.bedrooms}
          onValueChange={(v) => update({ bedrooms: v })}
        >
          <SelectTrigger className="h-10 bg-gray-50 shadow text-foreground">
            <SelectValue placeholder="Cualquiera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquiera</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Baños */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Baños</Label>
        <Select
          value={filters.bathrooms}
          onValueChange={(v) => update({ bathrooms: v })}
        >
          <SelectTrigger className="h-10 bg-gray-50 shadow text-foreground">
            <SelectValue placeholder="Cualquiera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquiera</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <Button
          className="w-full gradient-cta text-primary-foreground"
          onClick={() => {}}
        >
          Aplicar filtros
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => onFiltersChange(defaultFilters)}
        >
          <X className="w-4 h-4 mr-1" />
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
