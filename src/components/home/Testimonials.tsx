import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "Aarav Patel", location: "Mumbai", rating: 5, text: "A wonderful stay at Hotel Abhitej Inn. The rooms are immaculate, the staff exceptionally attentive, and the ambiance truly serene." },
  { name: "Ananya Sharma", location: "Bangalore", rating: 5, text: "From the moment we arrived, every detail was perfect. The Suite exceeded all our expectations — absolutely worth it." },
  { name: "Rohan Mehta", location: "Delhi", rating: 4, text: "Great location and spotlessly clean rooms. The restaurant food was delicious and the check-in was smooth." },
  { name: "Priya Nair", location: "Hyderabad", rating: 5, text: "The warm hospitality and attention to detail makes this hotel stand out. Will definitely return!" },
];

export const Testimonials = () => {
  const [i, setI] = useState(0);
  const items = TESTIMONIALS;

  return (
    <section className="bg-muted/50 py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Guest Stories
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Loved by travelers
          </h2>
        </div>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card md:p-12">
            <Quote className="h-10 w-10 text-primary/30" />
            <p className="mt-4 font-display text-xl leading-relaxed text-foreground md:text-2xl">
              "{items[i].text}"
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">{items[i].name}</div>
                <div className="text-sm text-muted-foreground">{items[i].location}</div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: items[i].rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setI((i - 1 + items.length) % items.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((i + 1) % items.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
