import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [formLoading, setFormLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!loading && user) {
      console.log("[Login] User authenticated, redirecting to dashboard");
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading) return; // Prevent double submission
    
    setFormLoading(true);
    try {
      console.log(`[Login] Attempting to ${mode} with email: ${email}`);
      
      const { error } =
        mode === "signin" ? await signIn(email, password) : await signUp(email, password, name);
      
      if (error) {
        console.error(`[Login] ${mode} failed:`, error);
        toast.error(error.message || "Authentication failed");
        setFormLoading(false);
        return;
      }

      console.log(`[Login] ${mode} successful, waiting for auth state update...`);
      
      if (mode === "signup") {
        toast.success("Welcome to VertiGrow OS 🌿 — you're in!");
      } else {
        toast.success("Welcome back 🌱");
      }

      // Wait a bit for auth state listener to update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("[Login] Unexpected error:", err);
      toast.error("An unexpected error occurred. Check the console for details.");
      setFormLoading(false);
    }
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

      <main className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <div className="absolute right-6 top-6"><ThemeToggle /></div>
        <Card className="w-full max-w-md border-border/60 p-8 shadow-elegant">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <h1 className="font-display text-3xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to monitor your rooftop farm." : "Start growing fresh in minutes."}
          </p>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")} className="mt-7">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            {(["signin", "signup"] as const).map((m) => (
              <TabsContent key={m} value={m} className="mt-6">
                <form onSubmit={submit} className="space-y-4">
                  {m === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor={`name-${m}`}>Name</Label>
                      <Input id={`name-${m}`} type="text" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor={`email-${m}`}>Email</Label>
                    <Input id={`email-${m}`} type="email" placeholder="chef@restaurant.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`pw-${m}`}>Password</Label>
                    <Input id={`pw-${m}`} type="password" placeholder={m === "signup" ? "At least 8 characters" : "••••••••"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={formLoading} className="w-full bg-gradient-primary shadow-glow hover:opacity-90">
                    {formLoading ? "Please wait…" : m === "signin" ? <>Sign in <ArrowRight className="ml-1.5 h-4 w-4" /></> : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our <a href="#" className="underline-offset-2 hover:underline">Terms</a> &amp; <a href="#" className="underline-offset-2 hover:underline">Privacy</a>.
          </p>
        </Card>
      </main>
    </div>
  );
}
