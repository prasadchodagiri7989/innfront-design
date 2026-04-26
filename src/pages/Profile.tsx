import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, BedDouble, CalendarCheck, Mail } from "lucide-react";
import data from "@/data/data.json";

const Profile = () => {
  const [user, setUser] = useState(data.user);

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
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-deep">
              <Award className="h-3.5 w-3.5" /> {user.tier} Member · Since {user.memberSince}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat icon={<CalendarCheck className="h-4 w-4" />} label="Stays" value={String(data.bookings.length)} />
            <Stat icon={<BedDouble className="h-4 w-4" />} label="Nights" value="9" />
          </div>
        </aside>

        {/* Edit form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <h3 className="font-display text-xl font-semibold">Personal information</h3>
          <p className="text-sm text-muted-foreground">Update your details to keep your account current.</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <Label>Full name</Label>
              <Input className="mt-1.5 h-12 rounded-xl" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            </div>
            <div>
              <Label>Email address</Label>
              <Input className="mt-1.5 h-12 rounded-xl" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1.5 h-12 rounded-xl" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
            </div>
            <div>
              <Label>Membership tier</Label>
              <Input className="mt-1.5 h-12 rounded-xl bg-muted/60" value={user.tier} readOnly />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
            <Button className="rounded-full bg-gradient-sky text-primary-foreground shadow-glow">Save changes</Button>
            <Button variant="ghost" className="rounded-full">Cancel</Button>
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
