"use client";

import { useEffect, useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

type TrustTransparencySidebarProps = {
  isDark: boolean;
  colors: {
    bg: string;
    text: string;
    textMuted: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SectionId =
  | "what"
  | "why"
  | "access"
  | "sanctuary"
  | "build"
  | "memory"
  | "trust";

type AccessTier = "anonymous" | "free" | "sanctuary";

export default function TrustTransparencySidebar({
  isDark,
  colors,
  open,
  onOpenChange,
}: TrustTransparencySidebarProps) {
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();

  const accessTier: AccessTier = useMemo(() => {
    if (!isLoaded) return "anonymous";
    if (!isSignedIn) return "anonymous";

    // Display-only hint. Not authoritative for access, routing, or feature enablement.
    const md = (user?.publicMetadata ?? {}) as Record<string, unknown>;
    const rawTier = md.accessTier as unknown;

    if (typeof rawTier === "string") {
      const v = rawTier.trim().toLowerCase();
      if (v === "sanctuary") return "sanctuary";
      if (v === "free") return "free";
    }

    // If missing or any unexpected value, default to Free display for signed-in users.
    return "free";
  }, [isLoaded, isSignedIn, user?.publicMetadata]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) return;
    setOpenSection(null);
  }, [open]);

  const panelBg = useMemo(() => {
    if (isDark) return "rgba(20,20,28,0.92)";
    return "rgba(255,255,255,0.92)";
  }, [isDark]);

  const border = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  const sections: Array<{ id: SectionId; title: string; content: Array<string> }> = useMemo(() => {
    const base: Array<{ id: SectionId; title: string; content: Array<string> }> = [
      {
        id: "what",
        title: "What VERA is",
        content: [
          "VERA works through conversation. It listens for what is actually needed, then helps you move one step at a time.",
          "You do not need to write perfect prompts. You can start wherever you are — with a feeling, a question, or a half formed thought.",
          "When the intent becomes clear, VERA can help you plan, decide, and act with steadiness, not speed.",
        ],
      },
      {
        id: "why",
        title: "Why VERA feels different",
        content: [
          "VERA adapts to the moment, the context, and your pacing. It can be direct when you want clarity, and quiet when you need space.",
          "The goal is containment and steadiness. The conversation should feel grounded, not performative.",
          "If something does not feel safe or appropriate, VERA should slow down and say so plainly.",
        ],
      },
    ];

    const accessSection = (() => {
      if (accessTier === "anonymous") {
        return {
          id: "access" as const,
          title: "Anonymous conversations",
          content: [
            "You can talk with VERA without attaching your identity.",
            "Anonymous conversations are temporary: they are not saved as an account history, and they are not tied to you as a person.",
            "If you want continuity later, you can sign up at any time and continue from there.",
          ],
        };
      }

      if (accessTier === "free") {
        return {
          id: "access" as const,
          title: "Free account",
          content: [
            "With a free account, basic usage is tracked to prevent abuse and keep the service reliable.",
            "Conversations are not saved as a long term history.",
            "Free accounts may have usage limits. If you hit one, you can return later.",
            "You can delete your account at any time.",
          ],
        };
      }

      return {
        id: "access" as const,
        title: "Account access",
        content: [
          "Your account helps keep the experience stable and consistent.",
          "You can manage or delete your account at any time.",
        ],
      };
    })();

    const buildSection = {
      id: "build" as const,
      title: "Build (coming soon)",
      content: [
        "Build is coming later. It is meant for moments when creation needs more structure than a chat thread.",
        "Over time, VERA may support more integrated workflows, while keeping the same calm pacing and clear boundaries.",
      ],
    };

    const memorySection = (() => {
      if (accessTier === "sanctuary") {
        return {
          id: "memory" as const,
          title: "Memory and conversation history",
          content: [
            "In Sanctuary, memory is optional and only used with explicit consent.",
            "You can turn memory off, ask to remove specific details, or erase what has been saved.",
            "Memory is meant for continuity and preference keeping — not diagnosis or clinical use.",
          ],
        };
      }

      return {
        id: "memory" as const,
        title: "Conversation privacy",
        content: [
          "Conversations are not saved as a long term history.",
          "If you want continuity, you can choose to sign in or upgrade later — at your pace.",
        ],
      };
    })();

    const trustSection = (() => {
      const common = [
        "VERA is designed with restraint. It should prioritize safety, clarity, and consent over intensity.",
        "If something feels off, pause, and ask for a simpler explanation or a slower pace.",
        "You should be able to understand what is happening in the conversation and what is being asked of you.",
      ];

      if (accessTier === "free" || accessTier === "sanctuary") {
        return {
          id: "trust" as const,
          title: "Trust, safety, and responsibility",
          content: [...common, "You can manage or delete your account whenever you choose."],
        };
      }

      return {
        id: "trust" as const,
        title: "Trust, safety, and responsibility",
        content: common,
      };
    })();

    const sanctuarySection =
      accessTier === "sanctuary"
        ? {
            id: "sanctuary" as const,
            title: "Sanctuary",
            content: [
              "Sanctuary is active",
              "You’re in Sanctuary mode. Conversations can go deeper, memory is available with your consent, and usage limits are lifted.",
            ],
          }
        : null;

    return [
      ...base,
      accessSection,
      ...(sanctuarySection ? [sanctuarySection] : []),
      buildSection,
      memorySection,
      trustSection,
    ];
  }, [accessTier]);

  return (
    <>
      {/* Backdrop (fade) */}
      <div
        aria-hidden={!open}
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 39,
          background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)",
          opacity: open ? 1 : 0,
          transition: "opacity 180ms ease",
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Left slide-in panel (fixed overlay; no layout shift) */}
      <div
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100dvh",
          width: "min(380px, 92vw)",
          transform: open ? "translateX(0)" : "translateX(-102%)",
          opacity: open ? 1 : 0.98,
          transition: "transform 220ms ease, opacity 180ms ease",
          zIndex: 40,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          role="dialog"
          aria-label="Trust and transparency"
          onClick={(e) => e.stopPropagation()}
          style={{
            height: "100%",
            background: panelBg,
            borderRight: `1px solid ${border}`,
            boxShadow: isDark
              ? "20px 0 60px rgba(0,0,0,0.55)"
              : "20px 0 60px rgba(0,0,0,0.15)",
            padding: "14px 14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 18,
                fontWeight: 500,
                color: colors.text,
                letterSpacing: "-0.01em",
              }}
            >
              Trust & Transparency
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close sidebar"
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: `1px solid ${border}`,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.65)",
                color: colors.textMuted,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>×</span>
            </button>
          </div>

          <div
            style={{
              color: colors.textMuted,
              fontSize: 12,
              lineHeight: 1.55,
              paddingBottom: 2,
            }}
          >
            Informational only. It does not change chat behavior.
          </div>

          {accessTier !== "anonymous" && (
            <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
              <button
                type="button"
                onClick={() => clerk.openUserProfile()}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.65)",
                  color: colors.text,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Manage account
              </button>
              <button
                type="button"
                onClick={() => clerk.openUserProfile()}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.55)",
                  color: colors.text,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Delete account
              </button>
            </div>
          )}

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overscrollBehavior: "contain",
              paddingRight: 2,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sections.map((section) => (
                <AccordionSection
                  key={section.id}
                  title={section.title}
                  open={openSection === section.id}
                  onToggle={() =>
                    setOpenSection((current) => (current === section.id ? null : section.id))
                  }
                  border={border}
                  isDark={isDark}
                  colors={colors}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {section.content.map((p) => (
                      <div key={p} style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                        {p}
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AccordionSection({
  title,
  open,
  onToggle,
  children,
  border,
  isDark,
  colors,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  border: string;
  isDark: boolean;
  colors: { text: string; textMuted: string };
}) {
  return (
    <div
      style={{
        border: `1px solid ${border}`,
        borderRadius: 14,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%",
          padding: "12px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: colors.text,
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1 }}>
          {open ? "▾" : "▸"}
        </div>
      </button>

      <div
        style={{
          maxHeight: open ? 320 : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 220ms ease, opacity 180ms ease",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "0 12px 12px" }}>{children}</div>
      </div>
    </div>
  );
}
