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

const formatPrice = (price: number) => `$${price}M`;

const PropertyCard = ({ property, viewMode }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
          <Badge className="absolute top-3 right-3 bg-success text-success-foreground font-bold">
            {property.discount}% OFF
          </Badge>
        </div>
        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {property.title}
            </h3>
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
                COP {formatPrice(property.originalPrice)}
              </p>
              <p className="text-xl font-bold text-foreground">
                COP {formatPrice(property.currentPrice)}
              </p>
              <Badge
                variant="outline"
                className="mt-1 text-primary border-primary"
              >
                ROI: {property.roi}%
              </Badge>
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
        <Badge className="absolute top-3 right-3 bg-success text-success-foreground font-bold">
          {property.discount}% OFF
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-foreground mb-1 truncate">
          {property.title}
        </h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5" /> {property.city},{" "}
          {property.neighborhood}
        </p>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm text-muted-foreground line-through">
            COP {formatPrice(property.originalPrice)}
          </span>
        </div>
        <p className="text-xl font-bold text-foreground mb-2">
          COP {formatPrice(property.currentPrice)}
        </p>

        <Badge variant="outline" className="text-primary border-primary mb-3">
          ROI: {property.roi}%
        </Badge>

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
