import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Sprout, FileText, Wheat, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { OverviewView } from "@/components/dashboard/OverviewView";
import { FarmsView } from "@/components/dashboard/FarmsView";
import { LogsView } from "@/components/dashboard/LogsView";
import { HarvestsView } from "@/components/dashboard/HarvestsView";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Tab = "overview" | "farms" | "logs" | "harvests";

function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const initial = (user.email ?? "?").charAt(0).toUpperCase();
  const items: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "farms", label: "Farms", icon: Sprout },
    { id: "logs", label: "Logs", icon: FileText },
    { id: "harvests", label: "Harvests", icon: Wheat },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="px-2 py-3"><Logo /></div>
        <nav className="mt-6 space-y-1">
          {items.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Connected
          </div>
          <p className="mt-2 truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Mobile tabs */}
            <div className="flex gap-1 md:hidden">
              {items.map((item) => (
                <button key={item.id} onClick={() => setTab(item.id)} className={`flex h-9 w-9 items-center justify-center rounded-lg ${tab === item.id ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <item.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <h1 className="hidden font-display text-xl font-bold md:block">
              {items.find((i) => i.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Avatar className="h-9 w-9 border-2 border-border">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">{initial}</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="ghost" onClick={async () => { await signOut(); toast.success("Signed out"); navigate({ to: "/" }); }} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">
          {tab === "overview" && <OverviewView />}
          {tab === "farms" && <FarmsView />}
          {tab === "logs" && <LogsView />}
          {tab === "harvests" && <HarvestsView />}
        </main>
      </div>
    </div>
  );
}
