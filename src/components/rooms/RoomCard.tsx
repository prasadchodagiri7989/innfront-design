import { Link } from "react-router-dom";
import { Star, ArrowUpRight, Users, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roomImages } from "@/lib/rooms";
import type { Room } from "@/lib/api";

/** Map a backend room type to a local image key */
const typeToImage = (type: string): string => {
  if (type === "Suite") return "suite";
  if (type === "Deluxe AC") return "deluxe";
  if (type === "Deluxe Non AC") return "standard";
  return "standard";
};

export const RoomCard = ({ room }: { room: Room }) => {
  const imgSrc = room.images?.[0] || roomImages[typeToImage(room.type)];
  const rating = room.rating?.average ?? 0;
  const reviewCount = room.rating?.count ?? 0;

  return (
    <article className="group hover-lift overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <Link to={`/rooms/${room._id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={room.type}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <Badge className="rounded-full border-0 bg-background/95 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
            {room.type}
          </Badge>
        </div>
        {rating > 0 && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            <Star className="h-3 w-3 fill-warning text-warning" />
            {rating.toFixed(1)}
          </div>
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
              {room.type}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              {room.size && <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" /> {room.size}</span>}
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {room.capacity} guests</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(room.amenities ?? []).slice(0, 3).map((f) => (
            <span key={f} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary-deep">
              {f}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="font-display text-2xl font-semibold text-foreground">
              ₹{room.price.toLocaleString("en-IN")}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/ night</span>
            </div>
            {reviewCount > 0 && (
              <div className="mt-0.5 text-xs text-muted-foreground">{reviewCount} reviews</div>
            )}
          </div>
          <Button asChild size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
            <Link to={`/rooms/${room._id}`}>
              View Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

