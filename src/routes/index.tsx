import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, Droplets, Sun, Sprout, Bell, LineChart, ShieldCheck, Check, Leaf, TrendingDown, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <DashboardPreview />
      <Pricing />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft" />
      <div className="absolute inset-0 grid-pattern opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container relative mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary">
            <Leaf className="h-3 w-3" /> Now serving 240+ urban kitchens
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Grow Fresh Herbs <br />
            on Your <span className="text-gradient">Rooftop</span> 🌿
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            Smart vertical farming system for modern restaurants. Monitor every leaf, every drop, every harvest — from one beautiful dashboard.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="h-12 rounded-full bg-gradient-primary px-7 text-base shadow-glow hover:opacity-90">
              <Link to="/dashboard">
                Start Free <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 rounded-full px-7 text-base">
              <a href="#preview"><Play className="mr-1.5 h-4 w-4" /> View Demo</a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">No credit card required · Free for the first 30 days</p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-elegant">
            <div className="absolute inset-0 bg-gradient-hero mix-blend-multiply z-10" />
            <img src={heroImg} alt="Rooftop vertical farm with smart dashboard overlays" className="h-[420px] w-full object-cover md:h-[560px]" width={1920} height={1280} />
            <div className="absolute inset-0 z-20 grid grid-cols-2 gap-4 p-6 md:grid-cols-4 md:p-10">
              {[
                { icon: Droplets, label: "Water", value: "70%", tone: "text-sky-200" },
                { icon: Sun, label: "Sunlight", value: "6 hrs", tone: "text-amber-200" },
                { icon: Sprout, label: "Stage", value: "Mid", tone: "text-emerald-200" },
                { icon: TrendingDown, label: "Cost", value: "−42%", tone: "text-emerald-200" },
              ].map((s, i) => (
                <div key={s.label} className="glass animate-float rounded-2xl p-4 text-white" style={{ animationDelay: `${i * 0.4}s` }}>
                  <s.icon className={`h-5 w-5 ${s.tone}`} />
                  <div className="mt-2 text-2xl font-bold">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider opacity-80">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    { icon: TrendingDown, title: "High cost of herbs", desc: "Imported basil costs 4× more than what your kitchen needs to keep margins healthy." },
    { icon: Zap, title: "Inconsistent supply", desc: "Weather, logistics, seasons — your herb shelf is empty exactly when you need it most." },
    { icon: MapPin, title: "Limited space", desc: "City restaurants have 2 m² to spare, not a whole farm. Until now." },
  ];
  return (
    <section className="border-y border-border/40 bg-muted/20 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">The problem</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Restaurants are starved <br />of consistent, fresh herbs.</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((p) => (
            <Card key={p.title} className="group relative overflow-hidden border-border/60 p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="py-24">
      <div className="container mx-auto grid gap-14 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">The solution</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">A whole farm, <br />in your pocket.</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            VertiGrow OS turns your unused rooftop into a self-managing herb farm. Sensors track every variable, AI handles the schedule, and you just walk upstairs to harvest.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Real-time monitoring of water, light, and growth",
              "Predictive harvest scheduling for kitchen demand",
              "Automated alerts before anything goes wrong",
              "70% less water than traditional farming",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-primary opacity-20 blur-3xl" />
          <Card className="relative overflow-hidden border-border/60 p-2 shadow-elegant">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live · Tower 03
              </div>
              <div className="mt-6 space-y-5">
                {[
                  { icon: Droplets, label: "Water", val: 70, color: "from-sky-400 to-cyan-500" },
                  { icon: Sun, label: "Light", val: 85, color: "from-amber-400 to-orange-500" },
                  { icon: Sprout, label: "Growth", val: 62, color: "from-emerald-400 to-teal-500" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium"><m.icon className="h-4 w-4 text-muted-foreground" />{m.label}</span>
                      <span className="font-semibold tabular-nums">{m.val}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: LineChart, title: "Monitoring Dashboard", desc: "Track water, sunlight, temperature and growth across every tower in real time." },
    { icon: Sprout, title: "Harvest Tracking", desc: "Beautiful logs of every yield — predict your next harvest before service rush." },
    { icon: Bell, title: "Smart Alerts", desc: "We message your team the second a tower needs attention. Never lose a crop." },
    { icon: ShieldCheck, title: "Food-safe by design", desc: "Closed hydroponic loop. No pesticides. Lab-tested water quality reports." },
    { icon: Zap, title: "Energy efficient", desc: "LED scheduling cuts power use by 38% versus baseline indoor farms." },
    { icon: Leaf, title: "12+ herb varieties", desc: "Basil, mint, cilantro, thyme, oregano, parsley… one farm, every menu." },
  ];
  return (
    <section id="features" className="border-y border-border/40 bg-muted/20 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Everything your kitchen needs.</h2>
          <p className="mt-4 text-lg text-muted-foreground">From seedling to plate, VertiGrow handles the science. You handle the menu.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group border-border/60 p-7 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section id="preview" className="py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">The dashboard</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">A control room for your rooftop.</h2>
        </div>
        <div className="relative mx-auto mt-14 max-w-6xl">
          <div className="absolute -inset-10 rounded-[2rem] bg-gradient-primary opacity-15 blur-3xl" />
          <Card className="relative overflow-hidden border-border/60 p-0 shadow-elegant">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="ml-3 text-xs text-muted-foreground">app.vertigrow.os/dashboard</span>
            </div>
            <div className="grid grid-cols-12 gap-0">
              <aside className="col-span-3 hidden border-r border-border/60 bg-muted/20 p-5 md:block">
                <div className="space-y-1 text-sm">
                  {["Dashboard", "Farms", "Analytics", "Settings"].map((i, idx) => (
                    <div key={i} className={`rounded-lg px-3 py-2 ${idx === 0 ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"}`}>{i}</div>
                  ))}
                </div>
              </aside>
              <div className="col-span-12 space-y-4 p-6 md:col-span-9">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "Water", v: "70%", i: Droplets, c: "text-sky-500" },
                    { l: "Sunlight", v: "6 hrs", i: Sun, c: "text-amber-500" },
                    { l: "Growth", v: "Mid", i: Sprout, c: "text-emerald-500" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border/60 p-4">
                      <s.i className={`h-4 w-4 ${s.c}`} />
                      <div className="mt-2 text-xl font-bold">{s.v}</div>
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <div className="text-sm font-semibold">Yield this month</div>
                      <div className="text-xs text-muted-foreground">+24% vs last month</div>
                    </div>
                    <div className="text-2xl font-bold tabular-nums">38.4 kg</div>
                  </div>
                  <div className="flex h-24 items-end gap-1.5">
                    {[40, 55, 35, 60, 70, 50, 80, 65, 75, 85, 70, 92].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For trying out a single tower.", features: ["1 tower", "Basic monitoring", "Email alerts", "Community support"], cta: "Start free", highlighted: false },
    { name: "Pro", price: "$49", desc: "For working restaurants and cafés.", features: ["Up to 8 towers", "Real-time alerts", "Harvest forecasting", "Priority support", "Multi-user access"], cta: "Start Pro trial", highlighted: true },
    { name: "Premium", price: "$129", desc: "For multi-location kitchens.", features: ["Unlimited towers", "AI yield optimization", "Custom integrations", "Dedicated agronomist", "99.9% SLA"], cta: "Talk to sales", highlighted: false },
  ];
  return (
    <section id="pricing" className="border-y border-border/40 bg-muted/20 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Simple, leafy pricing.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when your kitchen scales.</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.name} className={`relative p-8 shadow-card transition-all hover:-translate-y-1 ${t.highlighted ? "border-primary shadow-glow" : "border-border/60"}`}>
              {t.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary px-3">Most popular</Badge>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-bold">{t.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-7 w-full ${t.highlighted ? "bg-gradient-primary shadow-glow hover:opacity-90" : ""}`} variant={t.highlighted ? "default" : "outline"}>
                <Link to="/dashboard">{t.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 text-center shadow-glow md:p-20">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative mx-auto max-w-2xl text-primary-foreground">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Start growing smarter today.</h2>
            <p className="mt-4 text-lg opacity-90">Set up your first tower in under 24 hours. Harvest fresh by next week's service.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" variant="secondary" asChild className="h-12 rounded-full px-7 text-base">
                <Link to="/dashboard">Start free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 rounded-full border-primary-foreground/30 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
