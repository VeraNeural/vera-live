// ============================================================================
// TRUST & TRANSPARENCY SIDEBAR - WITH MEMORY SECTION
// Save to: src/components/TrustTransparencySidebar.tsx
// ============================================================================

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
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalView, setLegalView] = useState<"privacy" | "terms">("privacy");
  const [memoryEnabled, setMemoryEnabled] = useState<boolean | null>(null);
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();

  const accessTier: AccessTier = useMemo(() => {
    if (!isLoaded) return "anonymous";
    if (!isSignedIn) return "anonymous";

    const md = (user?.publicMetadata ?? {}) as Record<string, unknown>;
    const rawTier = md.accessTier as unknown;

    if (typeof rawTier === "string") {
      const v = rawTier.trim().toLowerCase();
      if (v === "sanctuary") return "sanctuary";
      if (v === "free") return "free";
    }

    return "free";
  }, [isLoaded, isSignedIn, user?.publicMetadata]);

  // Fetch memory consent status when sidebar opens
  useEffect(() => {
    if (!open || accessTier !== "sanctuary") return;

    const fetchMemoryStatus = async () => {
      try {
        const response = await fetch('/api/sanctuary/conversations?action=consent');
        const data = await response.json();
        setMemoryEnabled(data.hasConsented ?? null);
      } catch (error) {
        console.error('Failed to fetch memory status:', error);
      }
    };

    fetchMemoryStatus();
  }, [open, accessTier]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      if (legalOpen) {
        e.preventDefault();
        setLegalOpen(false);
        return;
      }

      onOpenChange(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange, legalOpen]);

  useEffect(() => {
    if (open) return;
    setOpenSection(null);
    setShowDeleteConfirm(false);
    setLegalOpen(false);
  }, [open]);

  const openLegal = (view: "privacy" | "terms") => {
    setLegalView(view);
    setLegalOpen(true);
  };

  const panelBg = useMemo(() => {
    if (isDark) return "rgba(20,20,28,0.92)";
    return "rgba(255,255,255,0.92)";
  }, [isDark]);

  const border = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  // Toggle memory consent
  const handleToggleMemory = async () => {
    if (isLoadingMemory) return;
    
    setIsLoadingMemory(true);
    try {
      const newValue = !memoryEnabled;
      await fetch('/api/sanctuary/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'consent', consent: newValue }),
      });
      setMemoryEnabled(newValue);
    } catch (error) {
      console.error('Failed to toggle memory:', error);
    } finally {
      setIsLoadingMemory(false);
    }
  };

  // Delete all conversations
  const handleDeleteAll = async () => {
    setIsLoadingMemory(true);
    try {
      await fetch('/api/sanctuary/conversations?action=all', {
        method: 'DELETE',
      });
      setMemoryEnabled(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete conversations:', error);
    } finally {
      setIsLoadingMemory(false);
    }
  };

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
              "You're in Sanctuary mode. Conversations can go deeper, memory is available with your consent, and usage limits are lifted.",
            ],
          }
        : null;

    // Memory section only for non-sanctuary (sanctuary gets custom UI)
    const memorySection = accessTier !== "sanctuary" ? {
      id: "memory" as const,
      title: "Conversation privacy",
      content: [
        "Conversations are not saved as a long term history.",
        "If you want continuity, you can choose to sign in or upgrade later — at your pace.",
      ],
    } : null;

    return [
      ...base,
      accessSection,
      ...(sanctuarySection ? [sanctuarySection] : []),
      buildSection,
      ...(memorySection ? [memorySection] : []),
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
          zIndex: 998,
          background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)",
          opacity: open ? 1 : 0,
          transition: "opacity 180ms ease",
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Privacy / Terms modal */}
      {open && legalOpen && (
        <div
          role="presentation"
          onClick={() => setLegalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1001,
            background: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 14,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={legalView === "privacy" ? "Privacy Policy" : "Terms of Service"}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(780px, 96vw)",
              maxHeight: "min(78vh, 680px)",
              borderRadius: 16,
              border: `1px solid ${border}`,
              background: isDark ? "rgba(16,16,22,0.98)" : "rgba(255,255,255,0.98)",
              boxShadow: isDark
                ? "0 20px 80px rgba(0,0,0,0.75)"
                : "0 20px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "12px 12px",
                borderBottom: `1px solid ${border}`,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setLegalView("privacy")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: `1px solid ${border}`,
                    background:
                      legalView === "privacy"
                        ? (isDark ? "rgba(200, 170, 120, 0.22)" : "rgba(200, 170, 120, 0.18)")
                        : (isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.65)"),
                    color: colors.text,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Privacy
                </button>
                <button
                  type="button"
                  onClick={() => setLegalView("terms")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: `1px solid ${border}`,
                    background:
                      legalView === "terms"
                        ? (isDark ? "rgba(200, 170, 120, 0.22)" : "rgba(200, 170, 120, 0.18)")
                        : (isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.65)"),
                    color: colors.text,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Terms
                </button>
              </div>

              <button
                type="button"
                onClick={() => setLegalOpen(false)}
                aria-label="Close"
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
                padding: 12,
                overflowY: "auto",
                overscrollBehavior: "contain",
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: `1px solid ${isDark ? "rgba(220, 100, 100, 0.22)" : "rgba(200, 80, 80, 0.20)"}`,
                  background: isDark ? "rgba(220, 100, 100, 0.10)" : "rgba(200, 80, 80, 0.08)",
                  color: colors.text,
                  fontSize: 12,
                  lineHeight: 1.55,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Crisis disclaimer</div>
                <div>
                  VERA is an AI Governance system. VERA is not a licensed therapist or medical
                  professional. If you're in crisis, call 988.
                </div>
              </div>

              {legalView === "privacy" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: colors.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Privacy Policy
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    VERA is an AI Governance system. VERA helps you regulate, organize, and
                    navigate your life. This policy explains what information may be processed and
                    how you can control it.
                  </div>

                  <div style={{ color: colors.text, fontSize: 13, fontWeight: 700 }}>
                    What we may collect
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    We may process conversation content you provide, basic account identifiers, and
                    limited usage/diagnostic data needed to operate and secure the service.
                  </div>

                  <div style={{ color: colors.text, fontSize: 13, fontWeight: 700 }}>
                    Memory & consent
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    In Sanctuary, memory is available only with your consent. You can toggle memory
                    and delete conversations from the sidebar.
                  </div>

                  <div style={{ color: colors.text, fontSize: 13, fontWeight: 700 }}>
                    How we use information
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    To provide the experience, improve reliability, prevent abuse, and keep systems
                    safe. We aim to minimize collection and use data proportionate to operation.
                  </div>

                  <div style={{ color: colors.text, fontSize: 13, fontWeight: 700 }}>
                    Your choices
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    You can manage or delete your account through Clerk, and you can disable memory
                    and delete conversations when available.
                  </div>

                  <div style={{ color: colors.textMuted, fontSize: 11, lineHeight: 1.6, marginTop: 6 }}>
                    This is a high-level summary provided in-app for convenience.
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: colors.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Terms of Service
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    VERA is an AI Governance system. VERA helps you regulate, organize, and
                    navigate your life. By using the service, you agree to use it lawfully and
                    responsibly.
                  </div>

                  <div style={{ color: colors.text, fontSize: 13, fontWeight: 700 }}>
                    No professional relationship
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    VERA provides informational assistance and structured guidance. It is not a
                    substitute for medical, legal, or mental health care.
                  </div>

                  <div style={{ color: colors.text, fontSize: 13, fontWeight: 700 }}>
                    Your responsibility
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    You are responsible for your decisions and actions. If something feels unsafe,
                    pause and seek appropriate human support.
                  </div>

                  <div style={{ color: colors.text, fontSize: 13, fontWeight: 700 }}>
                    Service changes
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.6 }}>
                    Features may change over time to improve safety, reliability, and product
                    integrity.
                  </div>

                  <div style={{ color: colors.textMuted, fontSize: 11, lineHeight: 1.6, marginTop: 6 }}>
                    This is a high-level summary provided in-app for convenience.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Left slide-in panel */}
      <div
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          height: "100%",
          width: "min(380px, 92vw)",
          transform: open ? "translateX(0)" : "translateX(-102%)",
          opacity: open ? 1 : 0.98,
          transition: "transform 220ms ease, opacity 180ms ease",
          zIndex: 999,
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
            padding: "max(14px, env(safe-area-inset-top)) 14px max(16px, env(safe-area-inset-bottom))",
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
                width: 44,
                height: 44,
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

              {/* Memory Section for Sanctuary Users */}
              {accessTier === "sanctuary" && (
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
                    onClick={() =>
                      setOpenSection((current) => (current === "memory" ? null : "memory"))
                    }
                    aria-expanded={openSection === "memory"}
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
                    <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>
                      Memory & Conversations
                    </div>
                    <div style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1 }}>
                      {openSection === "memory" ? "▾" : "▸"}
                    </div>
                  </button>

                  <div
                    style={{
                      maxHeight: openSection === "memory" ? 400 : 0,
                      opacity: openSection === "memory" ? 1 : 0,
                      transition: "max-height 220ms ease, opacity 180ms ease",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "0 12px 12px" }}>
                      {/* Memory Toggle */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 0",
                          borderBottom: `1px solid ${border}`,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>
                            VERA remembers
                          </div>
                          <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                            {memoryEnabled ? "Conversations are saved" : "Conversations are private"}
                          </div>
                        </div>
                        <button
                          onClick={handleToggleMemory}
                          disabled={isLoadingMemory}
                          style={{
                            width: 48,
                            height: 28,
                            borderRadius: 14,
                            border: "none",
                            background: memoryEnabled
                              ? (isDark ? "rgba(200, 170, 120, 0.5)" : "rgba(200, 170, 120, 0.6)")
                              : (isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"),
                            cursor: isLoadingMemory ? "wait" : "pointer",
                            position: "relative",
                            transition: "background 200ms ease",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 3,
                              left: memoryEnabled ? 23 : 3,
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: "white",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              transition: "left 200ms ease",
                            }}
                          />
                        </button>
                      </div>

                      {/* Info text */}
                      <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.6, marginTop: 12 }}>
                        {memoryEnabled
                          ? "VERA remembers your conversations to provide continuity and understand you better over time. You're always in control."
                          : "Your conversations are private and not saved. Enable memory to let VERA remember and provide continuity."}
                      </div>

                      {/* Delete all button */}
                      {memoryEnabled && (
                        <div style={{ marginTop: 16 }}>
                          {!showDeleteConfirm ? (
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: `1px solid ${isDark ? "rgba(220, 100, 100, 0.3)" : "rgba(200, 80, 80, 0.3)"}`,
                                background: "transparent",
                                color: isDark ? "rgba(220, 140, 140, 1)" : "rgba(180, 80, 80, 1)",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              Delete all conversations
                            </button>
                          ) : (
                            <div style={{
                              padding: 12,
                              borderRadius: 10,
                              background: isDark ? "rgba(220, 100, 100, 0.1)" : "rgba(200, 80, 80, 0.08)",
                              border: `1px solid ${isDark ? "rgba(220, 100, 100, 0.2)" : "rgba(200, 80, 80, 0.2)"}`,
                            }}>
                              <div style={{ fontSize: 12, color: colors.text, marginBottom: 10 }}>
                                Are you sure? This cannot be undone.
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button
                                  onClick={handleDeleteAll}
                                  disabled={isLoadingMemory}
                                  style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: isDark ? "rgba(220, 100, 100, 0.4)" : "rgba(200, 80, 80, 0.2)",
                                    color: isDark ? "rgba(255, 200, 200, 1)" : "rgba(150, 50, 50, 1)",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: isLoadingMemory ? "wait" : "pointer",
                                  }}
                                >
                                  {isLoadingMemory ? "Deleting..." : "Yes, delete all"}
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(false)}
                                  style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${border}`,
                                    background: "transparent",
                                    color: colors.textMuted,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              paddingTop: 10,
              borderTop: `1px solid ${border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              style={{
                border: "none",
                background: "transparent",
                color: colors.textMuted,
                cursor: "pointer",
                fontSize: 11,
                padding: 4,
              }}
            >
              Privacy
            </button>
            <div style={{ color: colors.textMuted, fontSize: 11, opacity: 0.6 }}>|</div>
            <button
              type="button"
              onClick={() => openLegal("terms")}
              style={{
                border: "none",
                background: "transparent",
                color: colors.textMuted,
                cursor: "pointer",
                fontSize: 11,
                padding: 4,
              }}
            >
              Terms
            </button>
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