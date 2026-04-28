import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export const AuthModal = ({ open, onClose, defaultMode = "login" }: AuthModalProps) => {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      }
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border border-border bg-card p-0 shadow-elevated">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-display text-2xl font-semibold">
            {mode === "login" ? "Welcome back" : "Create account"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login"
              ? "Sign in to manage your bookings at Hotel Abhitej Inn"
              : "Join us for seamless hotel experiences"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {mode === "register" && (
            <div>
              <Label>Full name</Label>
              <Input
                className="mt-1.5 h-12 rounded-xl"
                placeholder="Aarav Patel"
                value={form.name}
                onChange={set("name")}
                required
              />
            </div>
          )}

          <div>
            <Label>Email address</Label>
            <Input
              type="email"
              className="mt-1.5 h-12 rounded-xl"
              placeholder="you@email.com"
              value={form.email}
              onChange={set("email")}
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <Label>Phone (optional)</Label>
              <Input
                type="tel"
                className="mt-1.5 h-12 rounded-xl"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
          )}

          <div>
            <Label>Password</Label>
            <div className="relative mt-1.5">
              <Input
                type={showPassword ? "text" : "password"}
                className="h-12 rounded-xl pr-12"
                placeholder={mode === "register" ? "Min 8 chars, 1 uppercase, 1 number" : "Your password"}
                value={form.password}
                onChange={set("password")}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-gradient-sky text-primary-foreground shadow-glow text-base"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={switchMode} className="font-medium text-primary hover:underline">
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
