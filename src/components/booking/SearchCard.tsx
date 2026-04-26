import { useState } from "react";
import { Calendar as CalendarIcon, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const SearchCard = ({ compact = false }: { compact?: boolean }) => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState("2");

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-4 sm:p-5",
        compact ? "" : "shadow-elevated"
      )}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:gap-2">
        <Field label="Check in">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full items-center gap-2 text-left text-sm font-medium text-foreground">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {checkIn ? format(checkIn, "EEE, dd MMM") : "Add date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Check out" border>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full items-center gap-2 text-left text-sm font-medium text-foreground">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {checkOut ? format(checkOut, "EEE, dd MMM") : "Add date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Guests" border>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="h-auto border-0 p-0 text-sm font-medium shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Field>

        <Button
          onClick={() => navigate("/rooms")}
          className="h-12 rounded-xl bg-gradient-sky px-6 text-primary-foreground shadow-glow hover:opacity-95 md:h-auto md:px-5"
        >
          <Search className="mr-2 h-4 w-4" />
          Search Rooms
        </Button>
      </div>
    </div>
  );
};

const Field = ({ label, children, border }: { label: string; children: React.ReactNode; border?: boolean }) => (
  <div className={cn("rounded-xl px-4 py-3", border && "md:border-l md:border-border md:pl-5")}>
    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </div>
    <div className="mt-1.5">{children}</div>
  </div>
);
