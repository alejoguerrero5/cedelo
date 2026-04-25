import { useState } from "react";
import { Property } from "@/types/property";
import { Heart, MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import InterestModal from "./InterestModal";
import Image from "next/image";

interface PropertyCardProps {
  property: Property;
  viewMode: "grid" | "list";
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const getSalePrice = (currentPrice: number, originalPrice: number) =>
  currentPrice - (currentPrice - originalPrice) / 2;

const getDiscountPercent = (currentPrice: number, originalPrice: number) => {
  if (currentPrice <= 0) return 0;
  const salePrice = getSalePrice(currentPrice, originalPrice);
  return ((currentPrice - salePrice) / currentPrice) * 100;
};

const getMainRoiPercent = (currentPrice: number, originalPrice: number) => {
  const salePrice = getSalePrice(currentPrice, originalPrice);
  if (salePrice <= 0) return 0;
  const potentialProfit = currentPrice - salePrice;
  return (potentialProfit / salePrice) * 100;
};

const getCesionRoiPercent = (currentPrice: number, originalPrice: number) => {
  const potentialProfit = (currentPrice - originalPrice) / 2;
  const cesionCost = originalPrice * 0.3 + potentialProfit;
  if (cesionCost <= 0) return 0;
  return (potentialProfit / cesionCost) * 100;
};

const PropertyCard = ({ property, viewMode }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const salePrice = getSalePrice(property.currentPrice, property.originalPrice);
  const discountPercent = getDiscountPercent(
    property.currentPrice,
    property.originalPrice,
  );
  const mainRoiPercent = getMainRoiPercent(
    property.currentPrice,
    property.originalPrice,
  );
  const cesionRoiPercent = getCesionRoiPercent(
    property.currentPrice,
    property.originalPrice,
  );

  if (viewMode === "list") {
    return (
      <div className="bg-card rounded-2xl border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 flex overflow-hidden group">
        <InterestModal
          property={property}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
        {/* Image */}
        <div className="relative w-64 min-h-50 shrink-0 bg-muted overflow-hidden">
          <Image
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fill
          />
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
            />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {property.title}
            </h3>
            <Badge className="mb-2 bg-success text-success-foreground font-bold">
              {discountPercent.toFixed(1)}% OFF
            </Badge>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
              <MapPin className="w-3.5 h-3.5" /> {property.city},{" "}
              {property.neighborhood}
            </p>
            <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" /> {property.area}m²
              </span>
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" /> {property.bedrooms} hab
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> {property.bathrooms} baños
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(property.currentPrice)}
              </p>
              <p className="text-xl font-bold text-foreground">
                {formatPrice(salePrice)}
              </p>
              <Badge
                variant="outline"
                className="mt-1 text-primary border-primary"
              >
                ROI: {mainRoiPercent.toFixed(1)}%
              </Badge>
              <p className="mt-1 text-xs text-muted-foreground">
                ROI cesión: {cesionRoiPercent.toFixed(1)}%
              </p>
            </div>
            <Button
              className="gradient-cta text-primary-foreground"
              onClick={() => setModalOpen(true)}
            >
              Me interesa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
      <InterestModal
        property={property}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fill
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-foreground mb-1 truncate">
          {property.title}
        </h3>
        <Badge className="mb-2 bg-success text-success-foreground font-bold">
          {discountPercent.toFixed(1)}% OFF
        </Badge>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5" /> {property.city},{" "}
          {property.neighborhood}
        </p>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(property.currentPrice)}
          </span>
        </div>
        <p className="text-xl font-bold text-foreground mb-2">
          {formatPrice(salePrice)}
        </p>

        <Badge variant="outline" className="text-primary border-primary mb-1">
          ROI: {mainRoiPercent.toFixed(1)}%
        </Badge>
        <p className="text-xs text-muted-foreground mb-3">
          ROI cesión: {cesionRoiPercent.toFixed(1)}%
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 border-t border-border/50 pt-3">
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3 h-3" /> {property.area}m²
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="w-3 h-3" /> {property.bedrooms} hab
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" /> {property.bathrooms} baños
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Construcción</span>
            <span>{property.completionPercent}%</span>
          </div>
          <Progress value={property.completionPercent} className="h-2" />
        </div>

        <Button
          className="w-full gradient-cta text-primary-foreground"
          onClick={() => setModalOpen(true)}
        >
          Me interesa
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
