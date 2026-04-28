import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Calendar as CalIcon, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { roomsApi, bookingsApi, ApiError } from "@/lib/api";
import { roomImages } from "@/lib/rooms";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

const typeToImage = (type: string): string => {
  if (type === "Suite") return "suite";
  if (type === "Deluxe AC") return "deluxe";
  return "standard";
};

const steps = ["Dates & Guests", "Your Details", "Summary", "Confirmation"];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    checkInParam ? new Date(checkInParam + "T12:00:00") : new Date()
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    checkOutParam ? new Date(checkOutParam + "T12:00:00") : undefined
  );
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [apiError, setApiError] = useState("");

  // Pre-fill from logged-in user
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const { data: roomData, isLoading: roomLoading } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => roomsApi.getById(roomId!),
    enabled: !!roomId,
  });

  const room = roomData?.data;

  const nights = checkIn && checkOut
    ? Math.max(1, differenceInCalendarDays(checkOut, checkIn))
    : 1;
  const subtotal = room ? room.price * nights : 0;
  const gst = Math.round(subtotal * 0.12);
  const total = subtotal + gst;

  const bookingMutation = useMutation({
    mutationFn: () =>
      bookingsApi.create({
        roomId: roomId!,
        checkInDate: checkIn!.toISOString(),
        checkOutDate: checkOut!.toISOString(),
        guests: parseInt(guests, 10),
        specialRequests,
      }),
    onSuccess: (res: any) => {
      setCreatedBooking(res.data);
      setStep(3);
      setApiError("");
    },
    onError: (err) => {
      if (err instanceof ApiError) setApiError(err.message);
      else setApiError("Booking failed. Please try again.");
    },
  });

  const next = () => {
    if (step === 2) {
      if (!user) {
        setAuthModalOpen(true);
        return;
      }
      bookingMutation.mutate();
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  if (!roomId) {
    return (
      <PageLayout>
        <div className="container-page py-20 text-center text-muted-foreground">
          No room selected.{" "}
          <Link to="/rooms" className="text-primary underline">Browse rooms</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="login"
      />

      <section className="border-b border-border bg-muted/40 py-12">
        <div className="container-page">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reservation</span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Complete your booking
          </h1>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        {/* Stepper */}
        <ol className="mb-10 flex items-center justify-between gap-2 overflow-x-auto">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-3">
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                i < step && "bg-primary text-primary-foreground",
                i === step && "bg-gradient-sky text-primary-foreground shadow-glow",
                i > step && "bg-muted text-muted-foreground"
              )}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                "hidden whitespace-nowrap text-sm font-medium md:inline",
                i <= step ? "text-foreground" : "text-muted-foreground"
              )}>{s}</span>
              {i < steps.length - 1 && (
                <div className={cn("h-px flex-1 transition-colors", i < step ? "bg-primary" : "bg-border")} />
              )}
            </li>
          ))}
        </ol>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            {step === 0 && (
              <div className="space-y-6 animate-fade-up">
                <h2 className="font-display text-2xl font-semibold">When are you staying?</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <DateField label="Check-in" value={checkIn} onChange={setCheckIn} />
                  <DateField label="Check-out" value={checkOut} onChange={setCheckOut} />
                </div>
                <div>
                  <Label className="text-sm font-medium">Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="mt-2 h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} guest{n > 1 ? "s" : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <h2 className="font-display text-2xl font-semibold">Your details</h2>
                {!user && (
                  <div className="rounded-xl border border-primary/30 bg-primary-soft/50 p-4 text-sm text-primary-deep">
                    You'll be asked to sign in before confirming your booking.
                  </div>
                )}
                <div>
                  <Label>Full name</Label>
                  <Input className="mt-1.5 h-12 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Patel" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Phone</Label>
                    <Input className="mt-1.5 h-12 rounded-xl" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" className="mt-1.5 h-12 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <Label>Special requests (optional)</Label>
                  <Input className="mt-1.5 h-12 rounded-xl" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="e.g. early check-in, ground floor..." />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-up">
                <h2 className="font-display text-2xl font-semibold">Review your booking</h2>
                <div className="rounded-xl border border-border p-5">
                  <SummaryRow label="Guest" value={name || "—"} />
                  <SummaryRow label="Email" value={email || "—"} />
                  <SummaryRow label="Phone" value={phone || "—"} />
                  <SummaryRow label="Room" value={room ? `${room.type} (Room ${room.roomNumber})` : "—"} />
                  <SummaryRow label="Check-in" value={checkIn ? format(checkIn, "PPP") : "—"} />
                  <SummaryRow label="Check-out" value={checkOut ? format(checkOut, "PPP") : "—"} />
                  <SummaryRow label="Nights" value={String(nights)} />
                  <SummaryRow label="Guests" value={`${guests} guest${parseInt(guests) > 1 ? "s" : ""}`} />
                  <SummaryRow label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} />
                  <SummaryRow label="GST (12%)" value={`₹${gst.toLocaleString("en-IN")}`} />
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-3 font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                {apiError && (
                  <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{apiError}</p>
                )}
              </div>
            )}

            {step === 3 && createdBooking && (
              <div className="space-y-5 text-center animate-scale-in">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
                  <CheckCircle2 className="h-10 w-10 text-primary-deep" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-3xl font-semibold">Booking Confirmed!</h2>
                <p className="mx-auto max-w-md text-muted-foreground">
                  Your stay at Hotel Abhitej Inn is confirmed. A confirmation has been sent to <strong>{email}</strong>.
                </p>
                <div className="mx-auto max-w-md rounded-xl bg-muted/60 p-5 text-left">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booking ID</div>
                  <div className="mt-1 font-display text-xl font-semibold">{createdBooking.bookingId}</div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Room</div>
                      <div className="font-medium">{createdBooking.room?.type ?? room?.type}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total</div>
                      <div className="font-medium">₹{createdBooking.totalAmount?.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Check-in</div>
                      <div className="font-medium">{format(new Date(createdBooking.checkInDate), "dd MMM yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Check-out</div>
                      <div className="font-medium">{format(new Date(createdBooking.checkOutDate), "dd MMM yyyy")}</div>
                    </div>
                  </div>
                </div>
                <Button asChild className="rounded-full bg-gradient-sky text-primary-foreground">
                  <Link to="/my-bookings">View My Bookings <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              </div>
            )}

            {step < 3 && (
              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <Button variant="ghost" disabled={step === 0} onClick={back} className="rounded-full">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={next}
                  disabled={
                    bookingMutation.isPending ||
                    (step === 0 && (!checkIn || !checkOut))
                  }
                  className="rounded-full bg-gradient-sky text-primary-foreground shadow-glow"
                >
                  {bookingMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</>
                  ) : step === 2 ? (
                    !user ? "Sign In & Confirm" : "Confirm Booking"
                  ) : (
                    "Continue"
                  )}
                  {!bookingMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {roomLoading ? (
                <div>
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-24 w-full mt-3" />
                  </div>
                </div>
              ) : room ? (
                <>
                  <img
                    src={room.images?.[0] || roomImages[typeToImage(room.type)]}
                    alt={room.type}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Your selection</div>
                    <h3 className="mt-1 font-display text-lg font-semibold">{room.type}</h3>
                    <p className="text-xs text-muted-foreground">Room {room.roomNumber} · Floor {room.floor}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate</span>
                        <span>₹{room.price.toLocaleString("en-IN")}/night</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nights</span>
                        <span>{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (12%)</span>
                        <span>₹{gst.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="mt-3 flex justify-between border-t border-border pt-3 font-display text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

const DateField = ({ label, value, onChange }: { label: string; value?: Date; onChange: (d?: Date) => void }) => (
  <div>
    <Label className="text-sm font-medium">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mt-1.5 h-12 w-full justify-start rounded-xl text-left font-normal">
          <CalIcon className="mr-2 h-4 w-4 text-primary" />
          {value ? format(value, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default Booking;

