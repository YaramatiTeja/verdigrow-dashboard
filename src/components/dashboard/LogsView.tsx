import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { listLogs, listFarms, createRecord, updateRecord, deleteRecord } from "@/services/db";
import { toast } from "sonner";
import { EmptyState } from "./EmptyState";
import type { Tables } from "@/integrations/supabase/types";

type Log = Tables<"logs"> & { farms?: { name: string } | null };
const PAGE_SIZE = 8;
const STAGES = ["Seedling", "Mid", "Harvest"] as const;

export function LogsView() {
  const qc = useQueryClient();
  const [farmFilter, setFarmFilter] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Log | null>(null);
  const [open, setOpen] = useState(false);

  const { data: farms } = useQuery({ queryKey: ["farms-list"], queryFn: () => listFarms() });
  const { data: logs, isLoading } = useQuery({
    queryKey: ["logs", farmFilter, from, to, page],
    queryFn: () => listLogs({
      farm_id: farmFilter === "all" ? undefined : farmFilter,
      from: from || undefined,
      to: to || undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
  });

  const hasNext = useMemo(() => (logs?.length ?? 0) === PAGE_SIZE, [logs]);

  const saveMut = useMutation({
    mutationFn: async (v: { id?: string; farm_id: string; water_level: number; sunlight_hours: number; growth_stage: string; date: string }) => {
      if (v.id) return updateRecord("logs", v.id, v);
      return createRecord("logs", v);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logs"] });
      toast.success(editing ? "Log updated" : "Log added");
      setOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteRecord("logs", id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["logs"] }); toast.success("Log deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const noFarms = (farms?.length ?? 0) === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Daily logs</h2>
          <p className="text-sm text-muted-foreground">Water, light, and growth stage — every day, every tower.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button disabled={noFarms} className="bg-gradient-primary shadow-glow hover:opacity-90"><Plus className="mr-1 h-4 w-4" /> Add log</Button>
          </DialogTrigger>
          <LogDialog editing={editing} farms={farms ?? []} onSubmit={(v) => saveMut.mutate(v)} loading={saveMut.isPending} />
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-border/60 p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Farm</Label>
            <Select value={farmFilter} onValueChange={(v) => { setFarmFilter(v); setPage(0); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All farms</SelectItem>
                {farms?.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">From</Label>
            <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">To</Label>
            <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} />
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => { setFarmFilter("all"); setFrom(""); setTo(""); setPage(0); }}>Reset</Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-6"><div className="h-40 animate-pulse rounded bg-muted" /></Card>
      ) : noFarms ? (
        <EmptyState icon={FileText} title="No farms yet" description="You need at least one farm before adding logs." />
      ) : !logs || logs.length === 0 ? (
        <EmptyState icon={FileText} title="No logs yet" description="Try adjusting filters or add your first daily log." action={<Button onClick={() => setOpen(true)} className="bg-gradient-primary shadow-glow"><Plus className="mr-1 h-4 w-4" /> Add log</Button>} />
      ) : (
        <Card className="overflow-hidden border-border/60 shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>Farm</TableHead>
                <TableHead>Water</TableHead>
                <TableHead>Sunlight</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{log.date}</TableCell>
                  <TableCell className="text-muted-foreground">{log.farms?.name ?? "—"}</TableCell>
                  <TableCell>
                    <span className="font-medium tabular-nums mr-2">{log.water_level}%</span>
                    <WaterBadge level={log.water_level} />
                  </TableCell>
                  <TableCell><span className="tabular-nums">{log.sunlight_hours} hrs</span></TableCell>
                  <TableCell><Badge variant="secondary" className="border-0 bg-primary/10 text-primary">{log.growth_stage}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(log); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this log?</AlertDialogTitle>
                          <AlertDialogDescription>This action can't be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => delMut.mutate(log.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {logs && (logs.length > 0 || page > 0) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {page + 1}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}><ChevronLeft className="h-4 w-4" /> Prev</Button>
            <Button size="sm" variant="outline" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

function WaterBadge({ level }: { level: number }) {
  if (level > 60) return <Badge className="border-0 bg-success/15 text-success hover:bg-success/20">Good</Badge>;
  if (level >= 30) return <Badge className="border-0 bg-warning/15 text-warning hover:bg-warning/20">Moderate</Badge>;
  return <Badge className="border-0 bg-destructive/15 text-destructive hover:bg-destructive/20">Low</Badge>;
}

function LogDialog({ editing, farms, onSubmit, loading }: { editing: Log | null; farms: Tables<"farms">[]; onSubmit: (v: { id?: string; farm_id: string; water_level: number; sunlight_hours: number; growth_stage: string; date: string }) => void; loading: boolean }) {
  const [farmId, setFarmId] = useState(editing?.farm_id ?? farms[0]?.id ?? "");
  const [water, setWater] = useState(String(editing?.water_level ?? 70));
  const [sun, setSun] = useState(String(editing?.sunlight_hours ?? 6));
  const [stage, setStage] = useState(editing?.growth_stage ?? "Seedling");
  const [date, setDate] = useState(editing?.date ?? new Date().toISOString().slice(0, 10));

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{editing ? "Edit log" : "Add daily log"}</DialogTitle></DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!farmId) return;
          onSubmit({
            id: editing?.id, farm_id: farmId,
            water_level: Math.max(0, Math.min(100, parseInt(water) || 0)),
            sunlight_hours: Math.max(0, Math.min(24, parseInt(sun) || 0)),
            growth_stage: stage, date,
          });
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label>Farm</Label>
          <Select value={farmId} onValueChange={setFarmId}>
            <SelectTrigger><SelectValue placeholder="Select a farm" /></SelectTrigger>
            <SelectContent>{farms.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Water level (%)</Label>
            <Input type="number" min={0} max={100} value={water} onChange={(e) => setWater(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Sunlight (hrs)</Label>
            <Input type="number" min={0} max={24} value={sun} onChange={(e) => setSun(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Growth stage</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading || !farmId} className="bg-gradient-primary shadow-glow hover:opacity-90">
            {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            {editing ? "Save changes" : "Add log"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
