import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCard } from "@/components/booking/SearchCard";
import heroImg from "@/assets/hero.jpg";

export const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="relative h-[640px] w-full md:h-[720px]">
      <img
        src={heroImg}
        alt="Hotel Abhijeeth INN exterior at golden hour"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="container-page relative z-10 flex h-full flex-col justify-center pt-8">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-1.5 text-xs font-medium text-primary-deep backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Now booking for spring & summer 2026
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
            Stay where every<br />moment feels rare.
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/85 md:text-lg">
            Hotel Abhijeeth INN is a calm, contemporary retreat — designed for travelers who notice the details.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-7 text-foreground hover:bg-white/95">
              <Link to="/rooms">Explore rooms <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 px-7 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              <Link to="/booking">Book a stay</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div className="container-page relative z-20 -mt-24 pb-2 md:-mt-20">
      <SearchCard />
    </div>
  </section>
);
