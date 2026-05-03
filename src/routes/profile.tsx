import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  // If no profile row yet (older account), create one lazily
  if (!data) {
    const { data: created, error: insErr } = await supabase
      .from("profiles")
      .insert({ user_id: userId, name: "" })
      .select()
      .single();
    if (insErr) throw insErr;
    return created;
  }
  return data;
}

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) setName(profile.name ?? "");
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (newName: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ name: newName })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Profile updated successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const initial = (profile?.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account details.</p>
      </div>

      <Card className="p-6 shadow-card">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate(name.trim());
            }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarFallback className="bg-gradient-primary text-xl text-primary-foreground">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{profile?.name || "Unnamed grower"}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email ?? ""} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Okafor"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateMutation.isPending || name === (profile?.name ?? "")}
                className="bg-gradient-primary shadow-glow hover:opacity-90"
              >
                {updateMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> Save changes</>
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Card className="flex items-center gap-3 border-dashed p-4 text-sm text-muted-foreground">
        <UserIcon className="h-4 w-4" />
        Your profile is private and only visible to you.
      </Card>
    </div>
  );
}
