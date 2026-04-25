import type { Property } from "@/types/property";

type DbProperty = {
  id: string;
  project_name: string | null;
  city: string | null;
  neighborhood: string | null;
  original_price: number | null;
  current_price: number | null;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  type: string | null;
  delivery_date: string | null;
  images: string[] | null;
  is_vis: boolean | null;
  created_at: string | null;
  status: string | null;
};

export function mapDbPropertyToProperty(row: DbProperty): Property {
  const originalPrice = Number(row.original_price ?? 0);
  const currentPrice = Number(row.current_price ?? 0);
  const discount =
    originalPrice > 0
      ? Math.max(
          0,
          Math.round(((originalPrice - currentPrice) / originalPrice) * 100),
        )
      : 0;

  const title = row.project_name ?? "Proyecto sin nombre";
  const images = row.images ?? [];

  return {
    id: row.id,
    projectName: title,
    title,
    city: row.city ?? "",
    neighborhood: row.neighborhood ?? "",
    originalPrice,
    currentPrice,
    discount,
    roi: 0,
    area: Number(row.area ?? 0),
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    type: (row.type as Property["type"]) ?? "apartamento",
    status: (row.status as Property["status"]) ?? "en-venta",
    completionPercent: 0,
    image: images[0] ?? "/placeholder.svg",
    images,
    isVIS: Boolean(row.is_vis),
    createdAt: row.created_at ?? "",
    deliveryDate: row.delivery_date,
  };
}
