import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import data from "@/data/data.json";

const types = ["All", "Standard", "Deluxe", "Suite", "Family"];

const Rooms = () => {
  const [type, setType] = useState("All");
  const [price, setPrice] = useState<[number, number]>([1000, 6000]);
  const [available, setAvailable] = useState(true);

  const rooms = useMemo(() => {
    return data.rooms.filter(
      (r) =>
        (type === "All" || r.type === type) &&
        r.price >= price[0] &&
        r.price <= price[1]
    );
  }, [type, price, available]);

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
                <Switch id="avail" checked={available} onCheckedChange={setAvailable} />
              </div>

              <Button variant="ghost" className="mt-4 w-full rounded-full" onClick={() => { setType("All"); setPrice([1000, 6000]); }}>
                Reset filters
              </Button>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{rooms.length}</span> rooms available
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((r) => <RoomCard key={r.id} room={r} />)}
            </div>
            {rooms.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                No rooms match your filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Rooms;
