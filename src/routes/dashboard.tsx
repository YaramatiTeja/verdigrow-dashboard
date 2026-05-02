import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Sprout, BarChart3, Settings, Droplets, Sun, Leaf, Bell, AlertTriangle, CheckCircle2, TrendingUp, Search, Plus, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" as const },
  { label: "Farms", icon: Sprout, href: "/dashboard" as const },
  { label: "Analytics", icon: BarChart3, href: "/dashboard" as const },
  { label: "Settings", icon: Settings, href: "/dashboard" as const },
];

function Dashboard() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="px-2 py-3"><Link to="/"><Logo /></Link></div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item, i) => {
            const active = i === 0;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> All systems healthy
          </div>
          <p className="mt-2 text-xs text-muted-foreground">3 towers online · last sync 2s ago</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-bold">Good afternoon, Chef Maya 🌱</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search farms, harvests…" className="h-9 w-72 pl-9" />
            </div>
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <ThemeToggle />
            <Avatar className="h-9 w-9 border-2 border-border">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">MO</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {/* Stat cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard icon={Droplets} label="Water Level" value="70%" trend="+5% today" tone="sky" progress={70} />
            <StatCard icon={Sun} label="Sunlight" value="6 hrs" trend="On schedule" tone="amber" progress={75} />
            <StatCard icon={Sprout} label="Growth Stage" value="Mid" trend="Day 14 of 28" tone="emerald" progress={50} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Yield chart */}
            <Card className="border-border/60 p-6 shadow-card lg:col-span-2">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">Yield · last 12 weeks</h3>
                  <p className="text-sm text-muted-foreground">Harvested kilograms across all towers</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold tabular-nums">38.4 kg</div>
                  <div className="flex items-center justify-end gap-1 text-xs font-medium text-success">
                    <TrendingUp className="h-3 w-3" /> +24% MoM
                  </div>
                </div>
              </div>
              <div className="mt-8 flex h-48 items-end gap-2">
                {[40, 55, 35, 60, 70, 50, 80, 65, 75, 85, 70, 92].map((h, i) => (
                  <div key={i} className="group relative flex-1">
                    <div
                      className="rounded-t bg-gradient-to-t from-primary/30 to-primary transition-all hover:from-primary/50 hover:to-primary-glow"
                      style={{ height: `${h}%` }}
                    />
                    <span className="mt-1.5 block text-center text-[10px] text-muted-foreground">W{i + 1}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Alerts */}
            <Card className="border-border/60 p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Smart alerts</h3>
                <Badge variant="secondary" className="rounded-full">3 new</Badge>
              </div>
              <div className="mt-5 space-y-3">
                <AlertItem
                  icon={AlertTriangle}
                  tone="warning"
                  title="Water level low"
                  desc="Tower 02 — Basil bed at 28%"
                  time="2m ago"
                />
                <AlertItem
                  icon={CheckCircle2}
                  tone="success"
                  title="Ready for harvest"
                  desc="Tower 01 — Mint, 1.2 kg estimated"
                  time="14m ago"
                />
                <AlertItem
                  icon={Sun}
                  tone="info"
                  title="Light cycle adjusted"
                  desc="Auto: extended to 6.5 hrs/day"
                  time="1h ago"
                />
                <AlertItem
                  icon={Leaf}
                  tone="success"
                  title="New growth detected"
                  desc="Tower 03 — Cilantro sprouts +12"
                  time="3h ago"
                />
              </div>
            </Card>
          </div>

          {/* Farm list + harvest table */}
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="border-border/60 p-6 shadow-card lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Your farms</h3>
                <Button size="sm" variant="outline" className="rounded-full"><Plus className="mr-1 h-3.5 w-3.5" /> Add</Button>
              </div>
              <div className="mt-4 space-y-3">
                {farms.map((f) => (
                  <div key={f.name} className="flex items-center justify-between rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                        <Sprout className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{f.name}</div>
                        <div className="text-xs text-muted-foreground">{f.location} · {f.crop}</div>
                      </div>
                    </div>
                    <Badge variant={f.status === "Healthy" ? "secondary" : "outline"} className={f.status === "Healthy" ? "border-0 bg-success/15 text-success" : f.status === "Attention" ? "border-0 bg-warning/15 text-warning" : ""}>
                      {f.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/60 p-6 shadow-card lg:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">Recent harvests</h3>
                  <p className="text-sm text-muted-foreground">The last week of fresh delivery to your kitchen.</p>
                </div>
                <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead>Date</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Tower</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {harvests.map((h) => (
                      <TableRow key={h.date + h.crop} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{h.date}</TableCell>
                        <TableCell><div className="flex items-center gap-2"><Leaf className="h-3.5 w-3.5 text-primary" /> {h.crop}</div></TableCell>
                        <TableCell className="text-muted-foreground">{h.tower}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">{h.qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, tone, progress }: { icon: any; label: string; value: string; trend: string; tone: "sky" | "amber" | "emerald"; progress: number }) {
  const tones = {
    sky: "from-sky-400 to-cyan-500 text-sky-500",
    amber: "from-amber-400 to-orange-500 text-amber-500",
    emerald: "from-emerald-400 to-teal-500 text-emerald-500",
  } as const;
  return (
    <Card className="group relative overflow-hidden border-border/60 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]} text-white shadow-md`}>
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="secondary" className="rounded-full bg-muted text-xs">{trend}</Badge>
      </div>
      <div className="mt-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-4xl font-bold">{value}</div>
      </div>
      <Progress value={progress} className="mt-4 h-1.5" />
    </Card>
  );
}

function AlertItem({ icon: Icon, title, desc, time, tone }: { icon: any; title: string; desc: string; time: string; tone: "warning" | "success" | "info" }) {
  const tones = {
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    info: "bg-primary/15 text-primary",
  } as const;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold">{title}</div>
          <span className="shrink-0 text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p className="truncate text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

const farms = [
  { name: "Tower 01 — Rooftop A", location: "Brooklyn, NY", crop: "Mint, Basil", status: "Healthy" },
  { name: "Tower 02 — Rooftop A", location: "Brooklyn, NY", crop: "Basil, Thyme", status: "Attention" },
  { name: "Tower 03 — Rooftop B", location: "Queens, NY", crop: "Cilantro, Parsley", status: "Healthy" },
  { name: "Tower 04 — Rooftop B", location: "Queens, NY", crop: "Oregano, Sage", status: "Healthy" },
];

const harvests = [
  { date: "May 02, 2026", crop: "Basil", tower: "Tower 01", qty: "1.4 kg" },
  { date: "May 01, 2026", crop: "Mint", tower: "Tower 01", qty: "0.9 kg" },
  { date: "Apr 30, 2026", crop: "Cilantro", tower: "Tower 03", qty: "1.1 kg" },
  { date: "Apr 28, 2026", crop: "Thyme", tower: "Tower 02", qty: "0.6 kg" },
  { date: "Apr 27, 2026", crop: "Parsley", tower: "Tower 03", qty: "1.2 kg" },
  { date: "Apr 25, 2026", crop: "Oregano", tower: "Tower 04", qty: "0.8 kg" },
];
