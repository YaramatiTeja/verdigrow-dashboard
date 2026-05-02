import { Sprout } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
        <Sprout className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight">VertiGrow</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">OS</span>
      </div>
    </div>
  );
}
