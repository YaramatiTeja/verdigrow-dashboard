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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Use setTimeout to ensure this runs after render
    const timeoutId = setTimeout(() => {
      initAuth();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const initAuth = async () => {
    try {
      console.log("[Auth] Initializing auth...");
      
      if (!supabase || !supabase.auth) {
        console.warn("[Auth] Supabase not available");
        return;
      }

      // Set up listener
      try {
        const { data } = supabase.auth.onAuthStateChange((_event, s) => {
          console.log("[Auth] State changed:", _event);
          setSession(s);
          setUser(s?.user ?? null);
        });

        // Get initial session with timeout
        try {
          const result = await Promise.race([
            supabase.auth.getSession(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("timeout")), 5000)
            ),
          ]) as any;

          console.log("[Auth] Session loaded");
          setSession(result?.data?.session ?? null);
          setUser(result?.data?.session?.user ?? null);
        } catch (err) {
          console.warn("[Auth] Could not get session");
        }

        return () => data.subscription?.unsubscribe();
      } catch (err) {
        console.error("[Auth] Failed to setup listener:", err);
      }
    } catch (err) {
      console.error("[Auth] Init failed:", err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase?.auth) {
        return { error: new Error('Supabase not initialized') };
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      if (!supabase?.auth) {
        return { error: new Error('Supabase not initialized') };
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: name ? { name } : undefined,
        },
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      if (!supabase?.auth) return;
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[Auth] Sign out failed:", err);
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
