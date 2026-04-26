import * as Icons from "lucide-react";
import data from "@/data/data.json";

export const Amenities = () => (
  <section className="py-20 md:py-28">
    <div className="container-page">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Amenities
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
          Everything you need
        </h2>
        <p className="mt-4 text-muted-foreground">
          Thoughtful comforts and elevated services included with every stay.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {data.amenities.map((a) => {
          const Icon = (Icons as any)[a.icon] ?? Icons.Sparkles;
          return (
            <div
              key={a.label}
              className="hover-lift group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-deep transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <div className="text-sm font-medium text-foreground">{a.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
