import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { roomsApi } from "@/lib/api";
import { ROOM_TYPES } from "@/lib/constants";

const types = ["All", ...ROOM_TYPES];

const Rooms = () => {
  const [type, setType] = useState("All");
  const [price, setPrice] = useState<[number, number]>([1000, 6000]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const queryParams: Record<string, string> = {
    minPrice: String(price[0]),
    maxPrice: String(price[1]),
    limit: "50",
  };
  if (type !== "All") queryParams.type = type;
  if (availableOnly && (!checkIn || !checkOut)) queryParams.status = "available";

  const useDateSearch = !!(checkIn && checkOut);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rooms", queryParams, checkIn, checkOut],
    queryFn: () => {
      if (useDateSearch) {
        const availParams: Record<string, string> = {
          minPrice: String(price[0]),
          maxPrice: String(price[1]),
        };
        if (type !== "All") availParams.type = type;
        return roomsApi.getAvailable(checkIn, checkOut, availParams);
      }
      return roomsApi.getAll(queryParams);
    },
  });

  const rooms = data?.data ?? [];

  return (
    <PageLayout>
      <section className="border-b border-border bg-muted/40 py-12 md:py-16">
        <div className="container-page">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Rooms</span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Find your perfect retreat
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Browse our curated collection of rooms and suites — every space crafted for comfort and calm.
          </p>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-lg font-semibold">Filters</h3>

              {/* Date availability filter */}
              <div className="mt-5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Check-in
                </Label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="mt-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Check-out
                </Label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {checkIn && checkOut && (
                <p className="mt-2 text-xs font-medium text-primary">
                  Showing available rooms: {checkIn} → {checkOut}
                </p>
              )}

              <div className="mt-5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price range
                </Label>
                <div className="mt-3">
                  <Slider
                    value={price}
                    min={1000}
                    max={6000}
                    step={100}
                    onValueChange={(v) => setPrice(v as [number, number])}
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>₹{price[0].toLocaleString("en-IN")}</span>
                    <span>₹{price[1].toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Room type
                </Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        type === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary-deep"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/60 p-3">
                <Label htmlFor="avail" className="text-sm font-medium">Available only</Label>
                <Switch id="avail" checked={availableOnly} onCheckedChange={setAvailableOnly} />
              </div>

              <Button
                variant="ghost"
                className="mt-4 w-full rounded-full"
                onClick={() => { setType("All"); setPrice([1000, 6000]); setAvailableOnly(false); setCheckIn(""); setCheckOut(""); }}
              >
                Reset filters
              </Button>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {!isLoading && (
                  <><span className="font-medium text-foreground">{rooms.length}</span> rooms found</>
                )}
              </p>
            </div>

            {isError && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-muted-foreground">
                Failed to load rooms. Is the backend running?
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {rooms.map((r) => <RoomCard key={r._id} room={r} />)}
                </div>
                {rooms.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                    No rooms match your filters.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Rooms;

