import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Calendar as CalIcon, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import data from "@/data/data.json";
import { roomImages } from "@/lib/rooms";

const steps = ["Dates & Guests", "Your Details", "Summary", "Confirmation"];

const Booking = () => {
  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const room = data.rooms[0];

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <PageLayout>
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
                      {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n} guests</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <h2 className="font-display text-2xl font-semibold">Your details</h2>
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-up">
                <h2 className="font-display text-2xl font-semibold">Review your booking</h2>
                <div className="rounded-xl border border-border p-5">
                  <SummaryRow label="Guest" value={name || "—"} />
                  <SummaryRow label="Email" value={email || "—"} />
                  <SummaryRow label="Phone" value={phone || "—"} />
                  <SummaryRow label="Check-in" value={checkIn ? format(checkIn, "PPP") : "—"} />
                  <SummaryRow label="Check-out" value={checkOut ? format(checkOut, "PPP") : "—"} />
                  <SummaryRow label="Guests" value={`${guests} guests`} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 text-center animate-scale-in">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
                  <CheckCircle2 className="h-10 w-10 text-primary-deep" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-3xl font-semibold">Booking Confirmed</h2>
                <p className="mx-auto max-w-md text-muted-foreground">
                  Your stay at Hotel Abhijeeth INN is locked in. We've sent the confirmation to {email || "your email"}.
                </p>
                <div className="mx-auto max-w-md rounded-xl bg-muted/60 p-5 text-left">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booking ID</div>
                  <div className="mt-1 font-display text-xl font-semibold">BK-{Math.floor(1000 + Math.random()*9000)}</div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div><div className="text-muted-foreground">Room</div><div className="font-medium">{room.name}</div></div>
                    <div><div className="text-muted-foreground">Guests</div><div className="font-medium">{guests}</div></div>
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
                <Button onClick={next} className="rounded-full bg-gradient-sky text-primary-foreground shadow-glow">
                  {step === 2 ? "Confirm Booking" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <img src={roomImages[room.image]} alt={room.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Your selection</div>
                <h3 className="mt-1 font-display text-lg font-semibold">{room.name}</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Room rate</span><span>₹{room.price.toLocaleString("en-IN")}/night</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Nights</span><span>2</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span>₹350</span></div>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 font-display text-lg font-semibold">
                    <span>Total</span><span>₹{(room.price * 2 + 350).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
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
