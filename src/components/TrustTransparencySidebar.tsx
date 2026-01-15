"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function TrustTransparencySidebar({
  isDark,
  colors,
  open,
  onOpenChange,
}: TrustTransparencySidebarProps) {
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

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

  const sections: Array<{ id: SectionId; title: string; content: Array<string> }> = useMemo(
    () => [
      {
        id: "what",
        title: "What VERA is",
        content: [
          "VERA works through conversation. It listens for what is actually needed, then helps you move one step at a time.",
          "You do not need to write perfect prompts. You can start wherever you are, with a feeling, a question, or a half formed thought.",
          "When the intent becomes clear, VERA can help you plan, decide, and act with steadiness, not speed.",
        ],
      },
      {
        id: "why",
        title: "Why VERA feels different",
        content: [
          "VERA adapts to the moment, the context, and your pacing. It can be direct when you want clarity, and quiet when you need space.",
          "The goal is containment and steadiness. The conversation should feel human, grounded, and not performative.",
          "If something does not feel safe or appropriate, VERA should slow down and say so plainly.",
        ],
      },
      {
        id: "access",
        title: "How access works",
        content: [
          "VERA offers free access with intentional limits. These limits are meant to protect your pace, and to keep the experience reliable.",
          "If you reach a limit, VERA will tell you calmly, and you can return later without losing your place.",
          "Sanctuary is a deeper continuity option for people who want more space, more consistency, and longer arcs of support.",
        ],
      },
      {
        id: "sanctuary",
        title: "Sanctuary",
        content: [
          "Sanctuary is for people who want depth and continuity. It is a steadier container for ongoing conversation and longer term work.",
          "It changes the pace of what is possible, not who you are expected to be. You can take your time, and you can set boundaries.",
          "Consent and readiness matter. If today is not the day for deeper work, that is still a valid choice.",
        ],
      },
      {
        id: "build",
        title: "Build (coming soon)",
        content: [
          "Build is coming later. It is meant for moments when creation needs more structure than a chat thread.",
          "Over time, VERA may support more integrated workflows, while keeping the same calm pacing and clear boundaries.",
        ],
      },
      {
        id: "memory",
        title: "Memory and conversation history",
        content: [
          "Memory is intentional and optional. Not every conversation needs to persist, and not every detail should.",
          "When memory is used, it should support continuity without surprising you. You can correct it, refine it, or choose a lighter touch.",
          "You stay in control of what becomes part of the ongoing context.",
        ],
      },
      {
        id: "trust",
        title: "Trust, safety, and responsibility",
        content: [
          "VERA is designed with restraint. It should prioritize safety, clarity, and consent over intensity.",
          "If something feels off, pause, and ask for a simpler explanation or a slower pace.",
          "Privacy and boundaries matter. You should be able to understand what is happening in the conversation, and what is being asked of you.",
          "VERA is a product name and brand. The name and experience are protected, and you deserve a clear, honest relationship with them.",
        ],
      },
    ],
    []
  );

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
            Informational only. It does not affect chat, gating, or access.
          </div>

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
