"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import type { Tier } from "./tiers";

interface AuthContextType {
  userId: string | null;
  isLoggedIn: boolean;
  // NOTE: Tier/limits are enforced server-side in /api/chat.
  // This value is non-authoritative and must not be used for gating decisions.
  tier: Tier;
  loading: boolean;
  refreshTier: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();

  const value = useMemo<AuthContextType>(() => {
    return {
      userId: user?.id ?? null,
      isLoggedIn: Boolean(isSignedIn),
      tier: isSignedIn ? ("free" as Tier) : ("anonymous" as Tier),
      loading: !isLoaded,
      refreshTier: async () => {},
      signOut: async () => {},
    };
  }, [isLoaded, isSignedIn, user?.id]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
