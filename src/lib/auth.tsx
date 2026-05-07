import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: ReturnType<typeof supabase.auth.onAuthStateChange>['data']['subscription'] | null = null;

    const initAuth = async () => {
      try {
        // Set up listener BEFORE getting session
        const { data } = supabase.auth.onAuthStateChange((_event, s) => {
          if (mounted) {
            console.log("[Auth] State changed:", _event, s?.user?.id);
            setSession(s);
            setUser(s?.user ?? null);
          }
        });
        subscription = data.subscription;

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (mounted) {
          if (sessionError) {
            console.error("[Auth] Error getting session:", sessionError);
            setError(sessionError);
          } else {
            console.log("[Auth] Initial session loaded:", sessionData.session?.user?.id);
            setSession(sessionData.session);
            setUser(sessionData.session?.user ?? null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("[Auth] Initialization error:", err);
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("[Auth] Sign in error:", error.message);
      } else {
        console.log("[Auth] Sign in successful:", data.user?.id);
      }
      return { error };
    } catch (err) {
      console.error("[Auth] Sign in exception:", err);
      const error = err as Error;
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: name ? { name } : undefined,
        },
      });
      if (error) {
        console.error("[Auth] Sign up error:", error.message);
      } else {
        console.log("[Auth] Sign up successful:", data.user?.id);
      }
      return { error };
    } catch (err) {
      console.error("[Auth] Sign up exception:", err);
      const error = err as Error;
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[Auth] Sign out error:", error.message);
      } else {
        console.log("[Auth] Sign out successful");
      }
    } catch (err) {
      console.error("[Auth] Sign out exception:", err);
    }
  };

  return (
    <Ctx.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
