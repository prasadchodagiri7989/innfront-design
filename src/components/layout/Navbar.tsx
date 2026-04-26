import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/booking", label: "Booking" },
  { to: "/my-bookings", label: "My Bookings" },
  { to: "/profile", label: "Profile" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-sky shadow-glow transition-transform group-hover:scale-105">
            <Hotel className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Abhijeeth
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Hotel · INN
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-soft text-primary-deep"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" className="rounded-full">Login</Button>
          <Button className="rounded-full bg-gradient-sky text-primary-foreground shadow-glow hover:opacity-95">
            Sign Up
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden animate-fade-up">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-soft text-primary-deep"
                      : "text-foreground hover:bg-muted"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 rounded-full">Login</Button>
              <Button className="flex-1 rounded-full bg-gradient-sky text-primary-foreground">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
