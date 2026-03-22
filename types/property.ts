export interface Property {
  id: number;
  title: string;
  city: string;
  neighborhood: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  roi: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: "apartamento" | "casa";
  status: "en-planos" | "en-construccion";
  completionPercent: number;
  image: string;
  isVIS: boolean;
  createdAt: string;
}

export interface Filters {
  city: string;
  priceMin: number;
  priceMax: number;
  types: string[];
  status: string;
  completionMin: number;
  completionMax: number;
  discountMin: number;
  roiMin: number;
  areaMin: number;
  areaMax: number;
  bedrooms: string;
  bathrooms: string;
}

export const defaultFilters: Filters = {
  city: "",
  priceMin: 50,
  priceMax: 800,
  types: [],
  status: "",
  completionMin: 0,
  completionMax: 100,
  discountMin: 0,
  roiMin: 0,
  areaMin: 30,
  areaMax: 300,
  bedrooms: "",
  bathrooms: "",
};
