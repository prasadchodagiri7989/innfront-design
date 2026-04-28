import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Hotel, User, LogOut, ChevronDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

const links = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/booking", label: "Booking" },
  { to: "/my-bookings", label: "My Bookings" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: "login" | "register" }>({
    open: false,
    mode: "login",
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const openLogin = () => setAuthModal({ open: true, mode: "login" });
  const openRegister = () => setAuthModal({ open: true, mode: "register" });
  const closeAuth = () => setAuthModal((s) => ({ ...s, open: false }));

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-sky shadow-glow transition-transform group-hover:scale-105">
            <Hotel className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Abhitej
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

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-sky text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-bookings" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" /> My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full" onClick={openLogin}>Login</Button>
              <Button
                className="rounded-full bg-gradient-sky text-primary-foreground shadow-glow hover:opacity-95"
                onClick={openRegister}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
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
            <div className="mt-2 flex gap-2 pt-2 border-t border-border">
              {user ? (
                <div className="w-full space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted"
                  >
                    <User className="h-4 w-4" /> {user.name}
                  </Link>
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setOpen(false); openLogin(); }}>
                    Login
                  </Button>
                  <Button
                    className="flex-1 rounded-full bg-gradient-sky text-primary-foreground"
                    onClick={() => { setOpen(false); openRegister(); }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        open={authModal.open}
        onClose={closeAuth}
        defaultMode={authModal.mode}
      />
    </header>
  );
};
