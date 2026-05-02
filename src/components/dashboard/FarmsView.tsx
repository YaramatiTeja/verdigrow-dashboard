import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Sprout, MapPin, Leaf, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { listFarms, createRecord, updateRecord, deleteRecord } from "@/services/db";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { EmptyState } from "./EmptyState";

type Farm = Tables<"farms">;

export function FarmsView() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Farm | null>(null);
  const [open, setOpen] = useState(false);

  const { data: farms, isLoading } = useQuery({
    queryKey: ["farms", search],
    queryFn: () => listFarms(search),
  });

  const saveMut = useMutation({
    mutationFn: async (values: { id?: string; name: string; location: string; crop_type: string }) => {
      if (values.id) {
        return updateRecord("farms", values.id, { name: values.name, location: values.location, crop_type: values.crop_type });
      }
      return createRecord("farms", { user_id: user!.id, name: values.name, location: values.location, crop_type: values.crop_type });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["farms"] });
      toast.success(editing ? "Farm updated" : "Farm added");
      setOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteRecord("farms", id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["farms"] });
      toast.success("Farm deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Farms</h2>
          <p className="text-sm text-muted-foreground">Manage every tower on your rooftop.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-10 w-64 pl-9" placeholder="Search farms…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-glow hover:opacity-90"><Plus className="mr-1 h-4 w-4" /> Add farm</Button>
            </DialogTrigger>
            <FarmDialog editing={editing} onSubmit={(v) => saveMut.mutate(v)} loading={saveMut.isPending} />
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : !farms || farms.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No farms yet"
          description="Add your first vertical tower to start tracking water, light, and harvests."
          action={<Button onClick={() => setOpen(true)} className="bg-gradient-primary shadow-glow"><Plus className="mr-1 h-4 w-4" /> Add your first farm</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <Card key={farm.id} className="group border-border/60 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Sprout className="h-5 w-5" />
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(farm); setOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {farm.name}?</AlertDialogTitle>
                        <AlertDialogDescription>This will also delete all logs and harvests for this farm. This action can't be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => delMut.mutate(farm.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{farm.name}</h3>
              <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {farm.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{farm.location}</div>}
                {farm.crop_type && <div className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5" />{farm.crop_type}</div>}
              </div>
              <Badge variant="secondary" className="mt-4 border-0 bg-success/15 text-success">Active</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FarmDialog({ editing, onSubmit, loading }: { editing: Farm | null; onSubmit: (v: { id?: string; name: string; location: string; crop_type: string }) => void; loading: boolean }) {
  const [name, setName] = useState(editing?.name ?? "");
  const [location, setLocation] = useState(editing?.location ?? "");
  const [crop, setCrop] = useState(editing?.crop_type ?? "");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editing ? "Edit farm" : "Add a new farm"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onSubmit({ id: editing?.id, name: name.trim(), location: location.trim(), crop_type: crop.trim() });
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="name">Farm name</Label>
          <Input id="name" placeholder="Tower 01 — Rooftop A" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="loc">Location</Label>
          <Input id="loc" placeholder="Brooklyn, NY" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="crop">Crop type</Label>
          <Input id="crop" placeholder="Basil, Mint" value={crop} onChange={(e) => setCrop(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading} className="bg-gradient-primary shadow-glow hover:opacity-90">
            {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            {editing ? "Save changes" : "Add farm"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-border/60 p-6">
          <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
          <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
        </Card>
      ))}
    </div>
  );
}
