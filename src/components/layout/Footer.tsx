import { Hotel, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-sky shadow-glow">
              <Hotel className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-semibold">Hotel Abhijeeth INN</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Effortless luxury, thoughtful design, and warm hospitality — crafted for the modern traveler.
          </p>
          <div className="flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-semibold">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/rooms" className="hover:text-foreground">Rooms</Link></li>
            <li><Link to="/booking" className="hover:text-foreground">Booking</Link></li>
            <li><Link to="/my-bookings" className="hover:text-foreground">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-semibold">Support</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">FAQs</a></li>
            <li><a href="#" className="hover:text-foreground">Cancellation</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-semibold">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> 12 Lakeview Drive, Bengaluru</li>
            <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</li>
            <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-primary" /> stay@abhijeeth.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Hotel Abhijeeth INN. All rights reserved.</p>
          <p>Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
};
