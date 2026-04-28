import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight, MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, bookingsApi, type Booking } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ACTIVE = new Set(["pending", "confirmed", "checked_in"]);

const MyBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => usersApi.getMyBookings(),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => bookingsApi.cancel(bookingId),
    onMutate: (id) => setCancelId(id),
    onSettled: () => {
      setCancelId(null);
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });

  const bookings: Booking[] = data?.data ?? [];
  const upcoming = bookings.filter((b) => ACTIVE.has(b.status));
  const past = bookings.filter((b) => !ACTIVE.has(b.status));

  if (!user) {
    return (
      <PageLayout>
        <div className="container-page py-20 text-center text-muted-foreground">
          Please <Link to="/" className="text-primary underline">sign in</Link> to view your bookings.
        </div>
      </PageLayout>
    );
  }

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
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-muted-foreground">
            Failed to load bookings.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div>
              <h2 className="font-display text-2xl font-semibold">Upcoming</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {upcoming.length === 0 && (
                  <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                    No upcoming stays.{" "}
                    <Link to="/rooms" className="text-primary underline">Book a room</Link>
                  </div>
                )}
                {upcoming.map((b) => (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    cancelling={cancelId === b._id}
                    onCancel={() => {
                      if (window.confirm("Cancel this booking?")) cancelMutation.mutate(b._id);
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold">Past Stays</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {past.length === 0 && (
                  <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                    No past stays yet.
                  </div>
                )}
                {past.map((b) => (
                  <BookingCard key={b._id} booking={b} />
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </PageLayout>
  );
};

interface CardProps {
  booking: Booking;
  cancelling?: boolean;
  onCancel?: () => void;
}

const BookingCard = ({ booking: b, cancelling, onCancel }: CardProps) => {
  const roomName = typeof b.room === "object" ? (b.room as any).type ?? "Room" : b.room ?? "Room";
  const roomNumber = typeof b.room === "object" ? (b.room as any).roomNumber : null;
  const canCancel = ACTIVE.has(b.status) && onCancel;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card md:flex-row">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">{roomName}{roomNumber ? ` (Room ${roomNumber})` : ""}</h3>
          <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-semibold", STATUS_COLORS[b.status] ?? "bg-muted text-muted-foreground")}>
            {STATUS_LABELS[b.status] ?? b.status}
          </span>
        </div>

        <p className="text-xs font-mono text-muted-foreground">ID: {b.bookingId}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {format(new Date(b.checkInDate), "dd MMM yyyy")} → {format(new Date(b.checkOutDate), "dd MMM yyyy")}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {b.nights ?? 1} nights · {b.guests} guests
          </span>
        </div>

        <div className="mt-1 text-sm font-semibold">
          Total: ₹{b.totalAmount?.toLocaleString("en-IN")}
        </div>

        <div className="mt-3 flex items-center gap-3">
          {canCancel && (
            <Button
              size="sm"
              variant="destructive"
              className="rounded-full"
              onClick={onCancel}
              disabled={cancelling}
            >
              {cancelling ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              {cancelling ? "Cancelling..." : "Cancel Booking"}
            </Button>
          )}
          <Button asChild size="sm" variant="ghost" className="rounded-full">
            <Link to="/rooms">Browse Rooms <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;

