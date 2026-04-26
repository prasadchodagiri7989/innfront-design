import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTA = () => (
  <section className="py-20 md:py-28">
    <div className="container-page">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-sky p-10 shadow-elevated md:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-2xl text-primary-foreground">
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
            Book your stay now and unwind in style.
          </h2>
          <p className="mt-4 text-base text-primary-foreground/90 md:text-lg">
            Best-rate guarantee. Flexible cancellation. Complimentary breakfast on every booking made this week.
          </p>
          <Button asChild size="lg" className="mt-7 rounded-full bg-white px-8 text-foreground hover:bg-white/95">
            <Link to="/booking">Book Your Stay Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
