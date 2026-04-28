import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/rooms/RoomCard";
import { useQuery } from "@tanstack/react-query";
import { roomsApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedRooms = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["rooms", "featured"],
    queryFn: () => roomsApi.getAll({ limit: "4" }),
  });

  const rooms = data?.data ?? [];

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Featured stays
            </span>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Rooms designed for stillness
            </h2>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/rooms">View all rooms <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))
            : rooms.map((r) => <RoomCard key={r._id} room={r} />)}
        </div>
      </div>
    </section>
  );
};

