"use client";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Filters, Property, defaultFilters } from "@/types/property";
import FilterSidebar from "@/components/properties/FilterSideBar";
import PropertyCard from "@/components/properties/PropertyCard";

const ITEMS_PER_PAGE = 6;

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) throw new Error("No se pudieron cargar propiedades");
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city && filters.city !== "all") count++;
    if (
      filters.priceMin !== defaultFilters.priceMin ||
      filters.priceMax !== defaultFilters.priceMax
    )
      count++;
    if (filters.types.length > 0) count++;
    if (filters.status && filters.status !== "all") count++;
    if (filters.discountMin > 0) count++;
    if (filters.roiMin > 0) count++;
    if (
      filters.areaMin !== defaultFilters.areaMin ||
      filters.areaMax !== defaultFilters.areaMax
    )
      count++;
    if (filters.bedrooms && filters.bedrooms !== "all") count++;
    if (filters.bathrooms && filters.bathrooms !== "all") count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    let result = [...properties];

    if (filters.city && filters.city !== "all")
      result = result.filter((p) => p.city === filters.city);
    if (
      filters.priceMin !== defaultFilters.priceMin ||
      filters.priceMax !== defaultFilters.priceMax
    ) {
      result = result.filter(
        (p) =>
          p.currentPrice >= filters.priceMin &&
          p.currentPrice <= filters.priceMax,
      );
    }
    if (filters.types.length > 0)
      result = result.filter((p) => filters.types.includes(p.type));
    if (filters.status && filters.status !== "all")
      result = result.filter((p) => p.status === filters.status);
    if (filters.discountMin > 0)
      result = result.filter((p) => p.discount >= filters.discountMin);
    if (filters.roiMin > 0)
      result = result.filter((p) => p.roi >= filters.roiMin);
    if (
      filters.areaMin !== defaultFilters.areaMin ||
      filters.areaMax !== defaultFilters.areaMax
    ) {
      result = result.filter(
        (p) => p.area >= filters.areaMin && p.area <= filters.areaMax,
      );
    }
    if (filters.bedrooms && filters.bedrooms !== "all") {
      const b = parseInt(filters.bedrooms);
      result = result.filter((p) =>
        b >= 4 ? p.bedrooms >= 4 : p.bedrooms === b,
      );
    }
    if (filters.bathrooms && filters.bathrooms !== "all") {
      const b = parseInt(filters.bathrooms);
      result = result.filter((p) =>
        b >= 4 ? p.bathrooms >= 4 : p.bathrooms === b,
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;
      case "roi":
        result.sort((a, b) => b.roi - a.roi);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return result;
  }, [filters, properties, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="container-section">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Propiedades disponibles
        </h1>
        <p className="text-muted-foreground">
          Encuentra la mejor oportunidad de inversión en cesión de contratos
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-card rounded-2xl border border-border/50 p-6 shadow-card">
            <FilterSidebar
              filters={filters}
              onFiltersChange={(f) => {
                setFilters(f);
                setPage(1);
              }}
              activeCount={activeFilterCount}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card rounded-xl border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      filters={filters}
                      onFiltersChange={(f) => {
                        setFilters(f);
                        setPage(1);
                      }}
                      activeCount={activeFilterCount}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">{filtered.length}</strong>{" "}
                propiedades encontradas
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-9 bg-gray-50 shadow text-sm text-foreground">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mas reciente</SelectItem>
                  <SelectItem value="price-asc">Menor precio</SelectItem>
                  <SelectItem value="discount">Mayor descuento</SelectItem>
                  <SelectItem value="roi">Mayor ROI</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Cargando propiedades...
              </p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                No se encontraron propiedades con los filtros seleccionados.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilters(defaultFilters)}
              >
                <X className="w-4 h-4 mr-1" /> Limpiar filtros
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {paginated.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.max(1, page - 1));
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.min(totalPages, page + 1));
                      }}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
