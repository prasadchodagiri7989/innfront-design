import { Link } from "react-router-dom";
import { Star, ArrowUpRight, Users, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roomImages } from "@/lib/rooms";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  size: string;
  capacity: number;
  image: string;
  shortFeatures: string[];
}

export const RoomCard = ({ room }: { room: Room }) => {
  return (
    <article className="group hover-lift overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <Link to={`/rooms/${room.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={roomImages[room.image]}
          alt={room.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <Badge className="rounded-full border-0 bg-background/95 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
            {room.type}
          </Badge>
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {room.rating}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
              {room.name}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" /> {room.size}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {room.capacity} guests</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {room.shortFeatures.map((f) => (
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
          </div>
          <Button asChild size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
            <Link to={`/rooms/${room.id}`}>
              View Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};
