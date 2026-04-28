import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, BedDouble, CalendarCheck, Mail, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { usersApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: () => usersApi.updateProfile({ name, phone }),
    onSuccess: async () => {
      await refreshUser();
      setSaved(true);
      setSaveError("");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => {
      if (err instanceof ApiError) setSaveError(err.message);
      else setSaveError("Failed to save. Please try again.");
    },
  });

  if (!user) {
    return (
      <PageLayout>
        <div className="container-page py-20 text-center text-muted-foreground">
          Please <Link to="/" className="text-primary underline">sign in</Link> to view your profile.
        </div>
      </PageLayout>
    );
  }

  const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const memberYear = user.memberSince ? new Date(user.memberSince).getFullYear() : new Date().getFullYear();

  return (
    <PageLayout>
      <section className="border-b border-border bg-muted/40 py-12">
        <div className="container-page">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Account</span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Your profile
          </h1>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[320px_1fr]">
        {/* Identity card */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-sky font-display text-2xl font-semibold text-primary-foreground shadow-glow">
              {initials}
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-deep">
              <Award className="h-3.5 w-3.5" /> {user.loyaltyTier} Member Â· Since {memberYear}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat icon={<CalendarCheck className="h-4 w-4" />} label="Total Stays" value={String(user.totalStays ?? 0)} />
            <Stat icon={<BedDouble className="h-4 w-4" />} label="Tier" value={user.loyaltyTier ?? "Bronze"} />
          </div>
        </aside>

        {/* Edit form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <h3 className="font-display text-xl font-semibold">Personal information</h3>
          <p className="text-sm text-muted-foreground">Update your details to keep your account current.</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <Label>Full name</Label>
              <Input className="mt-1.5 h-12 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email address</Label>
              <Input className="mt-1.5 h-12 rounded-xl bg-muted/60" value={user.email} readOnly />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1.5 h-12 rounded-xl" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div>
              <Label>Membership tier</Label>
              <Input className="mt-1.5 h-12 rounded-xl bg-muted/60" value={user.loyaltyTier ?? "Bronze"} readOnly />
            </div>
          </div>

          {saveError && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{saveError}</p>
          )}
          {saved && (
            <p className="mt-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">Profile updated successfully.</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="rounded-full bg-gradient-sky text-primary-foreground shadow-glow"
            >
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saveMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => { setName(user.name); setPhone(user.phone ?? ""); }}>
              Cancel
            </Button>
          </div>

          <div className="mt-8 rounded-xl bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <div className="text-sm">
                <div className="font-medium">Stay informed</div>
                <p className="text-muted-foreground">We'll send booking confirmations and offers to {user.email}.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary-deep">{icon}</div>
    <div className="mt-3 font-display text-2xl font-semibold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default Profile;
