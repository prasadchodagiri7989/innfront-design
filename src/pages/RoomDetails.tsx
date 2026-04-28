import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Maximize2, Users, BedDouble, Check, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { roomsApi } from "@/lib/api";
import { roomImages } from "@/lib/rooms";
import type { DateRange } from "react-day-picker";
import { addDays, eachDayOfInterval, isBefore, isWithinInterval, startOfDay, format } from "date-fns";

const typeToImage = (type: string): string => {
  if (type === "Suite") return "suite";
  if (type === "Deluxe AC") return "deluxe";
  return "standard";
};

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["room", id],
    queryFn: () => roomsApi.getById(id!),
    enabled: !!id,
  });

  const room = data?.data;

  const { data: bookedData } = useQuery({
    queryKey: ["room-booked-dates", id],
    queryFn: () => roomsApi.getBookedDates(id!),
    enabled: !!id,
  });

  const bookedRanges = useMemo(() => {
    if (!bookedData?.data) return [];
    return bookedData.data.map((b) => ({
      from: startOfDay(new Date(b.checkInDate)),
      to: startOfDay(addDays(new Date(b.checkOutDate), -1)),
    }));
  }, [bookedData]);

  const bookedDays = useMemo(() => {
    const days: Date[] = [];
    for (const r of bookedRanges) {
      try {
        eachDayOfInterval({ start: r.from, end: r.to }).forEach((d) => days.push(d));
      } catch { /* ignore invalid ranges */ }
    }
    return days;
  }, [bookedRanges]);

  const isDateBooked = (date: Date) =>
    bookedRanges.some((r) => isWithinInterval(startOfDay(date), { start: r.from, end: r.to }));

  const disabledDays = (date: Date) =>
    isBefore(startOfDay(date), startOfDay(new Date())) || isDateBooked(date);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-page py-8 md:py-12">
          <Skeleton className="mb-4 h-9 w-24 rounded-full" />
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div>
              <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
              <div className="mt-8 space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isError || !room) {
    return (
      <PageLayout>
        <div className="container-page py-20 text-center text-muted-foreground">
          Room not found.{" "}
          <button onClick={() => navigate("/rooms")} className="text-primary underline">
            Browse all rooms
          </button>
        </div>
      </PageLayout>
    );
  }

  const gallery = [
    room.images?.[0] || roomImages[typeToImage(room.type)],
    roomImages["suite"],
    roomImages["deluxe"],
    roomImages["standard"],
  ];

  const nights =
    dateRange?.from && dateRange?.to
      ? Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const subtotal = room.price * nights;
  const gstAmount = Math.round(subtotal * 0.12);
  const total = subtotal + gstAmount;

  return (
    <PageLayout>
      <div className="container-page py-8 md:py-12">
        <Button variant="ghost" className="mb-4 -ml-2 rounded-full" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            {/* Gallery */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-card">
              <img
                src={gallery[galleryIndex]}
                alt={room.type}
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
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Room Info */}
            <div className="mt-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-deep">
                    {room.type}
                  </span>
                  <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                    Room {room.roomNumber} &mdash; {room.type}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {(room.rating?.average ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        {room.rating.average.toFixed(1)} ({room.rating.count} reviews)
                      </span>
                    )}
                    {room.size && (
                      <span className="flex items-center gap-1.5"><Maximize2 className="h-4 w-4" /> {room.size}</span>
                    )}
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Up to {room.capacity}</span>
                    {room.beds && (
                      <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {room.beds}</span>
                    )}
                  </div>
                </div>
              </div>

              {room.description && (
                <p className="mt-6 leading-relaxed text-muted-foreground">{room.description}</p>
              )}

              <div className="mt-8">
                <h3 className="font-display text-xl font-semibold">What this room offers</h3>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(room.amenities ?? []).map((f) => (
                    <li key={f} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Availability Calendar */}
              <div className="mt-8">
                <h3 className="font-display text-xl font-semibold">Availability</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select your check-in and check-out dates below.
                </p>
                <div className="mt-4 inline-block rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={disabledDays}
                    modifiers={{ booked: bookedDays }}
                    modifiersClassNames={{ booked: "rdp-day_booked" }}
                    className="p-0 pointer-events-auto"
                  />
                  <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 rounded-sm bg-destructive/80" />
                      Booked
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
                      Selected
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 rounded-sm bg-muted-foreground/30" />
                      Unavailable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold">&#8377;{room.price.toLocaleString("en-IN")}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
              {(room.rating?.average ?? 0) > 0 && (
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span className="font-medium">{room.rating.average.toFixed(1)}</span>
                  <span className="text-muted-foreground">&middot; {room.rating.count} reviews</span>
                </div>
              )}

              <div className="mt-5 space-y-3 rounded-xl border border-border p-3 text-sm">
                <Row label="Floor" value={`Floor ${room.floor}`} />
                <Row label="Capacity" value={`Up to ${room.capacity} guests`} />
                {room.beds && <Row label="Bed type" value={room.beds} />}
              </div>

              {dateRange?.from && dateRange?.to && (
                <div className="mt-4 rounded-xl bg-primary-soft px-4 py-3 text-sm">
                  <div className="flex justify-between text-primary-deep">
                    <span className="font-medium">Check-in</span>
                    <span>{format(dateRange.from, "dd MMM yyyy")}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-primary-deep">
                    <span className="font-medium">Check-out</span>
                    <span>{format(dateRange.to, "dd MMM yyyy")}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  const params = new URLSearchParams({ roomId: room._id });
                  if (dateRange?.from) params.set("checkIn", format(dateRange.from, "yyyy-MM-dd"));
                  if (dateRange?.to) params.set("checkOut", format(dateRange.to, "yyyy-MM-dd"));
                  navigate(`/booking?${params.toString()}`);
                }}
                disabled={!dateRange?.from || !dateRange?.to}
                className="mt-4 w-full rounded-full bg-gradient-sky py-6 text-base text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dateRange?.from && dateRange?.to ? "Book Now" : "Select Dates Above"}
              </Button>

              {!dateRange?.from && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Choose dates in the Availability calendar
                </p>
              )}

              {nights > 0 && (
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>&#8377;{room.price.toLocaleString("en-IN")} &times; {nights} night{nights !== 1 ? "s" : ""}</span>
                    <span>&#8377;{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (12%)</span>
                    <span>&#8377;{gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground">
                    <span>Total</span>
                    <span>&#8377;{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
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