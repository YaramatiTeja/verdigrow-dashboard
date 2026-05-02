import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="/#preview" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</a>
          <a href="/#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="bg-gradient-primary shadow-glow hover:opacity-90">
            <Link to="/dashboard">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
