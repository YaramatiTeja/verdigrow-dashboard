import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Welcome back to VertiGrow OS 🌿");
      navigate({ to: "/dashboard" });
    }, 800);
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="relative">
          <Link to="/" className="text-primary-foreground"><Logo /></Link>
        </div>
        <div className="relative max-w-md text-primary-foreground">
          <Sparkles className="h-8 w-8 opacity-80" />
          <p className="mt-4 font-display text-3xl font-bold leading-tight">
            "We cut our herb costs by 42% in the first month. The basil tastes better, too."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary-foreground/20" />
            <div>
              <div className="font-semibold">Maya Okafor</div>
              <div className="text-sm opacity-80">Head Chef · Rooftop &amp; Co.</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <div className="absolute right-6 top-6"><ThemeToggle /></div>
        <Card className="w-full max-w-md border-border/60 p-8 shadow-elegant">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in to monitor your rooftop farm.</p>

          <Tabs defaultValue="signin" className="mt-7">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="chef@restaurant.com" required defaultValue="demo@vertigrow.os" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" required defaultValue="demo1234" />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-glow hover:opacity-90">
                  {loading ? "Signing in…" : <>Sign in <ArrowRight className="ml-1.5 h-4 w-4" /></>}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Restaurant name</Label>
                  <Input id="name" placeholder="Rooftop & Co." required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email2">Email</Label>
                  <Input id="email2" type="email" placeholder="chef@restaurant.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password2">Password</Label>
                  <Input id="password2" type="password" placeholder="At least 8 characters" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-glow hover:opacity-90">
                  {loading ? "Creating…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our <a href="#" className="underline-offset-2 hover:underline">Terms</a> &amp; <a href="#" className="underline-offset-2 hover:underline">Privacy</a>.
          </p>
        </Card>
      </main>
    </div>
  );
}
