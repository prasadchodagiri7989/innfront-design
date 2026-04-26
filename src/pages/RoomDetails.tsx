import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Star, Maximize2, Users, BedDouble, Check, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import data from "@/data/data.json";
import { roomImages } from "@/lib/rooms";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = data.rooms.find((r) => r.id === id) ?? data.rooms[0];
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallery = [room.image, "suite", "deluxe", "family"];

  return (
    <PageLayout>
      <div className="container-page py-8 md:py-12">
        <Button variant="ghost" className="mb-4 -ml-2 rounded-full" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-card">
              <img
                src={roomImages[gallery[galleryIndex]]}
                alt={room.name}
                className="h-full w-full object-cover transition-opacity"
              />
              <button
                onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur shadow-soft hover:bg-background"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur shadow-soft hover:bg-background"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                    i === galleryIndex ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={roomImages[g]} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-deep">
                    {room.type}
                  </span>
                  <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                    {room.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> {room.rating} ({room.reviews} reviews)</span>
                    <span className="flex items-center gap-1.5"><Maximize2 className="h-4 w-4" /> {room.size}</span>
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Up to {room.capacity}</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {room.beds}</span>
                  </div>
                </div>
              </div>

              <p className="mt-6 leading-relaxed text-muted-foreground">{room.description}</p>

              <div className="mt-8">
                <h3 className="font-display text-xl font-semibold">What this room offers</h3>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {room.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="font-display text-xl font-semibold">Availability</h3>
                <div className="mt-4 inline-block rounded-2xl border border-border bg-card p-3 shadow-soft">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="p-0 pointer-events-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold">₹{room.price.toLocaleString("en-IN")}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-medium">{room.rating}</span>
                <span className="text-muted-foreground">· {room.reviews} reviews</span>
              </div>

              <div className="mt-5 space-y-3 rounded-xl border border-border p-3 text-sm">
                <Row label="Check-in" value="Fri, 02 May" />
                <Row label="Check-out" value="Sun, 04 May" />
                <Row label="Guests" value="2 adults" />
              </div>

              <Button asChild className="mt-5 w-full rounded-full bg-gradient-sky py-6 text-base text-primary-foreground shadow-glow hover:opacity-95">
                <Link to="/booking">Book Now</Link>
              </Button>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>₹{room.price.toLocaleString("en-IN")} × 2 nights</span><span>₹{(room.price * 2).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span>Service fee</span><span>₹350</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground"><span>Total</span><span>₹{(room.price * 2 + 350).toLocaleString("en-IN")}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default RoomDetails;
