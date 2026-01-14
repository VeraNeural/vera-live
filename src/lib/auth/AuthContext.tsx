"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Tier } from "./tiers";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  tier: Tier;
  loading: boolean;
  refreshTier: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<Tier>("anonymous");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Fetch tier from database (source of truth)
  async function fetchTier(userId: string): Promise<Tier> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("tier")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.error("Error fetching tier:", error);
        return "free"; // Default for authenticated users
      }

      return (data.tier as Tier) || "free";
    } catch (err) {
      console.error("Exception fetching tier:", err);
      return "free";
    }
  }

  async function refreshTier() {
    if (user) {
      const newTier = await fetchTier(user.id);
      setTier(newTier);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setTier("anonymous");
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const userTier = await fetchTier(session.user.id);
        setTier(userTier);
      } else {
        setUser(null);
        setTier("anonymous");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userTier = await fetchTier(session.user.id);
        setTier(userTier);
      } else {
        setUser(null);
        setTier("anonymous");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    tier,
    loading,
    refreshTier,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
