import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import data from "@/data/data.json";
import { format } from "date-fns";

const MyBookings = () => {
  const upcoming = data.bookings.filter((b) => b.status === "Upcoming");
  const past = data.bookings.filter((b) => b.status !== "Upcoming");

  return (
    <PageLayout>
      <section className="border-b border-border bg-muted/40 py-12">
        <div className="container-page">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your Stays</span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            My Bookings
          </h1>
        </div>
      </section>

      <section className="container-page py-12 space-y-12">
        {/* Upcoming */}
        <div>
          <h2 className="font-display text-2xl font-semibold">Upcoming</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {upcoming.length === 0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                No upcoming stays.
              </div>
            )}
            {upcoming.map((b) => (
              <div key={b.id} className="hover-lift relative overflow-hidden rounded-2xl bg-gradient-sky p-6 text-primary-foreground shadow-elevated">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">{b.status}</span>
                    <span className="text-xs opacity-80">#{b.id}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold">{b.room}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm opacity-90">
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />
                      {format(new Date(b.checkIn), "dd MMM")} – {format(new Date(b.checkOut), "dd MMM yyyy")}
                    </span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Bengaluru</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="font-display text-xl font-semibold">₹{b.total.toLocaleString("en-IN")}</div>
                    <Button asChild size="sm" className="rounded-full bg-white text-foreground hover:bg-white/95">
                      <Link to="/my-bookings">View details <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="font-display text-2xl font-semibold">Booking History</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="hidden grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 border-b border-border bg-muted/40 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
              <div>Room</div>
              <div>Dates</div>
              <div>Guests</div>
              <div>Total</div>
              <div>Status</div>
            </div>
            {past.map((b) => (
              <div key={b.id} className="grid grid-cols-1 gap-2 border-b border-border px-6 py-4 last:border-0 md:grid-cols-[2fr_2fr_1fr_1fr_1fr] md:items-center md:gap-4">
                <div>
                  <div className="font-medium">{b.room}</div>
                  <div className="text-xs text-muted-foreground">#{b.id}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(b.checkIn), "dd MMM")} – {format(new Date(b.checkOut), "dd MMM yyyy")}
                </div>
                <div className="text-sm">{b.guests}</div>
                <div className="font-semibold">₹{b.total.toLocaleString("en-IN")}</div>
                <div>
                  <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-deep">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default MyBookings;
