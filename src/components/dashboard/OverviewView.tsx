import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Droplets, Sun, Sprout, Bell, AlertTriangle, CheckCircle2, Leaf, TrendingUp, Building2, Wheat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { listFarms, listLogs, listHarvests } from "@/services/db";
import { EmptyState } from "./EmptyState";

export function OverviewView() {
  const { data: farms = [], isLoading: loadingFarms } = useQuery({ queryKey: ["farms-list"], queryFn: () => listFarms() });
  const { data: logs = [], isLoading: loadingLogs } = useQuery({ queryKey: ["logs", "all", "", "", 0], queryFn: () => listLogs({ limit: 8, offset: 0 }) });
  const { data: allLogs = [] } = useQuery({ queryKey: ["logs-all-stats"], queryFn: () => listLogs({ limit: 500, offset: 0 }) });
  const { data: harvests = [] } = useQuery({ queryKey: ["harvests", "all", "", "", 0], queryFn: () => listHarvests({ limit: 50, offset: 0 }) });

  const latest = logs[0];
  const totalG = useMemo(() => harvests.reduce((s, h) => s + (h.quantity ?? 0), 0), [harvests]);
  const avgWater = useMemo(() => {
    if (allLogs.length === 0) return 0;
    return Math.round(allLogs.reduce((s, l) => s + (l.water_level ?? 0), 0) / allLogs.length);
  }, [allLogs]);
  const loading = loadingFarms || loadingLogs;

  const alerts = useMemo(() => {
    const arr: { tone: "warning" | "success" | "info"; title: string; desc: string; icon: typeof AlertTriangle }[] = [];
    logs.forEach((l) => {
      if (l.water_level < 35) arr.push({ tone: "warning", title: "Water level low", desc: `${(l as any).farms?.name ?? "Tower"} at ${l.water_level}%`, icon: AlertTriangle });
      if (l.growth_stage === "Harvest") arr.push({ tone: "success", title: "Ready for harvest", desc: `${(l as any).farms?.name ?? "Tower"} — harvest now`, icon: CheckCircle2 });
    });
    return arr.slice(0, 5);
  }, [logs]);

  if (farms.length === 0) {
    return (
      <EmptyState
        icon={Sprout}
        title="Welcome to VertiGrow OS 🌿"
        description="Get started by adding your first rooftop farm. Once you've added a farm you can log conditions and track harvests."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Overview</h2>
        <p className="text-sm text-muted-foreground">A quick pulse on every tower you grow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Droplets} label="Water level" value={latest ? `${latest.water_level}%` : "—"} progress={latest?.water_level ?? 0} tone="sky" />
        <StatCard icon={Sun} label="Sunlight today" value={latest ? `${latest.sunlight_hours} hrs` : "—"} progress={latest ? Math.min(100, latest.sunlight_hours * 8) : 0} tone="amber" />
        <StatCard icon={Sprout} label="Growth stage" value={latest?.growth_stage ?? "—"} progress={latest?.growth_stage === "Mid" ? 50 : latest?.growth_stage === "Harvest" ? 90 : 20} tone="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 p-6 shadow-card lg:col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Total harvested</h3>
              <p className="text-sm text-muted-foreground">Across {farms.length} farm{farms.length === 1 ? "" : "s"}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tabular-nums">{totalG} g</div>
              {harvests.length > 0 && (
                <div className="flex items-center justify-end gap-1 text-xs font-medium text-success">
                  <TrendingUp className="h-3 w-3" /> {harvests.length} entries
                </div>
              )}
            </div>
          </div>
          {harvests.length > 0 ? (
            <div className="mt-8 flex h-40 items-end gap-1.5">
              {harvests.slice(0, 24).reverse().map((h, i) => {
                const max = Math.max(...harvests.map((x) => x.quantity || 1));
                return (
                  <div key={h.id} className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary transition-all hover:from-primary/50 hover:to-primary-glow" style={{ height: `${((h.quantity || 0) / max) * 100}%` }} title={`${h.date}: ${h.quantity}g`} />
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">No harvests logged yet.</p>
          )}
        </Card>

        <Card className="border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Bell className="h-4 w-4" /> Smart alerts</h3>
            <Badge variant="secondary" className="rounded-full">{alerts.length}</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {alerts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                <Leaf className="mx-auto h-5 w-5 text-success" />
                <p className="mt-2">All systems healthy. No alerts right now.</p>
              </div>
            ) : alerts.map((a, i) => (
              <AlertItem key={i} {...a} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, progress, tone }: { icon: any; label: string; value: string; progress: number; tone: "sky" | "amber" | "emerald" }) {
  const tones = {
    sky: "from-sky-400 to-cyan-500",
    amber: "from-amber-400 to-orange-500",
    emerald: "from-emerald-400 to-teal-500",
  } as const;
  return (
    <Card className="border-border/60 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]} text-white shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-4xl font-bold">{value}</div>
      </div>
      <Progress value={progress} className="mt-4 h-1.5" />
    </Card>
  );
}

function AlertItem({ icon: Icon, title, desc, tone }: { icon: any; title: string; desc: string; tone: "warning" | "success" | "info" }) {
  const tones = {
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    info: "bg-primary/15 text-primary",
  } as const;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <p className="truncate text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
