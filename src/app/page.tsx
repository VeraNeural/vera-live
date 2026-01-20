"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { useTheme, ThemeToggle } from "@/contexts/ThemeContext";
import { TrustTransparencySidebar } from "@/components/sidebar";

type Message = {
  role: "user" | "assistant";
  content: string;
  gate?: "signup" | "upgrade";
};

type ChatNudge = {
  kind: "signup_soft" | "signup_hard";
  text: string;
};

function normalizeAffirmative(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isAffirmative(input: string): boolean {
  const s = normalizeAffirmative(input);
  const phrases = new Set([
    "yes",
    "ok",
    "okay",
    "sure",
    "lets do it",
    "let's do it",
    "sign me up",
  ]);
  if (phrases.has(s)) return true;
  // Allow short variants like "yes please" or "ok please".
  if (s.startsWith("yes ") || s.startsWith("ok ") || s.startsWith("okay ") || s.startsWith("sure ")) {
    return true;
  }
  return false;
}

const QUICK_STARTS = [
  "Help me process something",
  "Build something with me",
  "I just need to vent",
  "Why do I do the things I do",
];

export default function Page() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { isDark, colors, timeOfDay } = useTheme();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [trustOpen, setTrustOpen] = useState(false);
  const [awaitingSignupConfirm, setAwaitingSignupConfirm] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stay on / for all users. Access gating comes from /api/chat responses.

  function getGreeting(): string {
    switch (timeOfDay) {
      case "morning": return "Good morning";
      case "afternoon": return "Good afternoon";
      case "evening": return "Good evening";
      case "night": return "Good evening";
    }
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    // If we just gave the anon message-5 close, an affirmative reply should jump to signup.
    if (awaitingSignupConfirm && isAffirmative(content)) {
      setAwaitingSignupConfirm(false);
      router.push("/signup");
      return;
    }

    const userMessage: Message = { role: "user", content };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    // Blur input on mobile to hide keyboard
    inputRef.current?.blur();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();

      if (data?.gate === "signup_required" || data?.gate === "auth_required") {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data?.content ?? "To keep going, start free.",
            gate: "signup",
          },
        ]);
        return;
      }

      if (data?.gate === "upgrade_required") {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data?.content ?? "Upgrade to keep chatting today.",
            gate: "upgrade",
          },
        ]);
        return;
      }

      const nudge: ChatNudge | null =
        data?.nudge && typeof data.nudge?.text === "string" && (data.nudge?.kind === "signup_soft" || data.nudge?.kind === "signup_hard")
          ? (data.nudge as ChatNudge)
          : null;

      setMessages((m) => {
        const next: Message[] = [
          ...m,
          {
            role: "assistant",
            content: data?.content ?? "Sorry — no response returned.",
          },
        ];

        if (nudge) {
          next.push({ role: "assistant", content: nudge.text, gate: "signup" });
        }

        return next;
      });

      if (nudge?.kind === "signup_hard") {
        setAwaitingSignupConfirm(true);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry — something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div 
        style={{ 
          minHeight: "100dvh",
          background: "#f5f0e6" 
        }} 
      />
    );
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }
        
        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overscroll-behavior: none;
        }
        
        input, button {
          font-family: inherit;
        }
        
        input::placeholder {
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(100,90,80,0.5)'};
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .quick-start-btn {
          transition: all 0.2s ease;
        }
        
        .quick-start-btn:active {
          transform: scale(0.96);
        }
        
        @media (hover: hover) {
          .quick-start-btn:hover {
            background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)'};
            border-color: ${isDark ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.3)'};
          }
        }
        
        .chat-scroll::-webkit-scrollbar {
          width: 4px;
        }
        
        .chat-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 2px;
        }
      `}</style>

      <main
        style={{
          minHeight: "100dvh",
          background: colors.bg,
          color: colors.text,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.4s ease",
        }}
      >
        <TrustTransparencySidebar
          isDark={isDark}
          open={trustOpen}
          onOpenChange={setTrustOpen}
        />

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(80vw, 400px)",
            height: "min(80vw, 400px)",
            background: isDark
              ? "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)"
              : "radial-gradient(circle, rgba(200,180,150,0.2) 0%, transparent 60%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* HEADER */}
        <header
          style={{
            padding: "max(env(safe-area-inset-top, 12px), 12px) 16px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 20,
          }}
        >
          {/* Left - Orb as logo */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Open trust and transparency"
            onClick={() => setTrustOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setTrustOpen((v) => !v);
              }
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, rgba(196,181,253,0.9) 0%, rgba(139,92,246,0.8) 50%, rgba(109,40,217,0.7) 100%)",
              boxShadow: isDark
                ? "0 0 20px rgba(139,92,246,0.4)"
                : "0 0 15px rgba(139,92,246,0.25)",
              flexShrink: 0,
              cursor: "pointer",
              outline: "none",
            }}
          />

          {/* Center - Theme Toggle */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <ThemeToggle />
          </div>

          {/* Right - Auth buttons */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isLoaded && !isSignedIn && (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
                    color: colors.text,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    background: "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)",
                    color: "white",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    boxShadow: "0 2px 10px rgba(139,92,246,0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Start Free
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: 32,
                      height: 32,
                    },
                  },
                }}
              />
            )}
          </div>
        </header>

        {/* HERO - Before chat starts */}
        {!hasStarted && (
          <section
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 20px",
              paddingBottom: "env(safe-area-inset-bottom, 20px)",
              textAlign: "center",
              position: "relative",
              zIndex: 10,
              animation: "fadeIn 0.5s ease",
            }}
          >
            {/* Large Orb */}
            <div
              style={{
                width: "min(28vw, 110px)",
                height: "min(28vw, 110px)",
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, rgba(196,181,253,0.95) 0%, rgba(139,92,246,0.85) 50%, rgba(109,40,217,0.75) 100%)",
                boxShadow: isDark
                  ? "0 0 50px rgba(139,92,246,0.35), 0 0 100px rgba(139,92,246,0.15)"
                  : "0 0 40px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.1)",
                marginBottom: "clamp(24px, 5vh, 36px)",
                animation: "breathe 5s ease-in-out infinite",
              }}
            />

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 8vw, 3rem)",
                fontWeight: 400,
                margin: 0,
                marginBottom: 10,
                color: colors.text,
                letterSpacing: "-0.02em",
              }}
            >
              {getGreeting()}
            </h1>

            <p
              style={{
                fontSize: "clamp(0.9rem, 3.5vw, 1.05rem)",
                color: colors.textMuted,
                margin: 0,
                marginBottom: "clamp(28px, 5vh, 40px)",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              AI that helps you do anything, your way, your pace
            </p>

            {/* Input */}
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                display: "flex",
                alignItems: "center",
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)",
                borderRadius: 28,
                padding: "6px 6px 6px 20px",
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(200,180,160,0.25)'}`,
                marginBottom: 20,
                boxShadow: isDark 
                  ? "0 4px 20px rgba(0,0,0,0.2)" 
                  : "0 4px 20px rgba(0,0,0,0.06)",
                transition: "all 0.2s ease",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="What's on your mind?"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: colors.text,
                  fontSize: 15,
                  padding: "12px 0",
                  minWidth: 0,
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: input.trim() && !loading
                    ? "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)"
                    : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  color: input.trim() && !loading ? "white" : colors.textMuted,
                  border: "none",
                  fontSize: 18,
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  boxShadow: input.trim() && !loading 
                    ? "0 2px 12px rgba(139,92,246,0.35)" 
                    : "none",
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            {/* Quick Starts */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                maxWidth: 500,
              }}
            >
              {QUICK_STARTS.map((text) => (
                <button
                  key={text}
                  className="quick-start-btn"
                  onClick={() => sendMessage(text)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 20,
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
                    color: colors.textMuted,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,180,160,0.2)'}`,
                    fontSize: 13,
                    fontWeight: 450,
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* CHAT VIEW - After chat starts */}
        {hasStarted && (
          <>
            <div
              className="chat-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "20px 16px",
                paddingBottom: 140,
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div
                style={{
                  maxWidth: 680,
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "85%",
                        padding: "12px 16px",
                        borderRadius: m.role === "user" 
                          ? "18px 18px 4px 18px" 
                          : "18px 18px 18px 4px",
                        background: m.role === "user" 
                          ? "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)"
                          : isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
                        color: m.role === "user" ? "white" : colors.text,
                        fontSize: 14,
                        lineHeight: 1.55,
                        boxShadow: m.role === "user"
                          ? "0 2px 12px rgba(139,92,246,0.3)"
                          : isDark ? "none" : "0 2px 10px rgba(0,0,0,0.04)",
                      }}
                    >
                      {m.content}

                      {m.gate === "signup" && (
                        <div style={{ marginTop: 14 }}>
                          <Link
                            href="/signup"
                            style={{
                              display: "inline-block",
                              padding: "10px 20px",
                              borderRadius: 20,
                              background: "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)",
                              color: "white",
                              textDecoration: "none",
                              fontSize: 13,
                              fontWeight: 600,
                              boxShadow: "0 2px 10px rgba(139,92,246,0.3)",
                            }}
                          >
                            Start free
                          </Link>
                        </div>
                      )}

                      {m.gate === "upgrade" && (
                        <div style={{ marginTop: 14 }}>
                          <button
                            onClick={async () => {
                              const res = await fetch("/api/stripe/checkout", { method: "POST" });
                              const data = await res.json().catch(() => ({}));

                              if (!res.ok) {
                                alert(data?.error || "Unable to start checkout");
                                return;
                              }

                              if (data?.url) {
                                window.location.href = data.url;
                              } else {
                                alert("Checkout URL missing");
                              }
                            }}
                            style={{
                              display: "inline-block",
                              padding: "10px 20px",
                              borderRadius: 20,
                              background:
                                "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)",
                              color: "white",
                              fontSize: 13,
                              fontWeight: 600,
                              boxShadow: "0 2px 10px rgba(139,92,246,0.3)",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Explore Sanctuary
                          </button>
                          <div
                            style={{
                              marginTop: 8,
                              fontSize: 12,
                              color: colors.textMuted,
                              opacity: 0.8,
                            }}
                          >
                            Continue tomorrow
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div
                      style={{
                        padding: "14px 18px",
                        borderRadius: "18px 18px 18px 4px",
                        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
                        display: "flex",
                        gap: 6,
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: isDark ? "rgba(255,255,255,0.4)" : "rgba(139,92,246,0.5)",
                            animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>
            </div>

            {/* Fixed Input */}
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: isDark
                  ? "linear-gradient(to top, rgba(11,11,15,0.98) 0%, rgba(11,11,15,0.9) 80%, transparent 100%)"
                  : "linear-gradient(to top, rgba(245,240,230,0.98) 0%, rgba(245,240,230,0.9) 80%, transparent 100%)",
                padding: "20px 16px",
                paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  maxWidth: 680,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
                  borderRadius: 26,
                  padding: "6px 6px 6px 18px",
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(200,180,160,0.2)'}`,
                  boxShadow: isDark 
                    ? "0 4px 20px rgba(0,0,0,0.3)" 
                    : "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask VERA anything…"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: colors.text,
                    fontSize: 15,
                    padding: "10px 0",
                    minWidth: 0,
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: input.trim() && !loading
                      ? "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)"
                      : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    color: input.trim() && !loading ? "white" : colors.textMuted,
                    border: "none",
                    fontSize: 18,
                    cursor: input.trim() && !loading ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    boxShadow: input.trim() && !loading 
                      ? "0 2px 12px rgba(139,92,246,0.35)" 
                      : "none",
                  }}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        {process.env.NODE_ENV !== "production" && isLoaded && isSignedIn && (
          <button
            onClick={async () => {
              await fetch("/api/debug/reset-quota", { method: "POST" });
              alert("Free quota reset. Reload the page.");
            }}
            style={{
              position: "fixed",
              bottom: 12,
              left: 12,
              opacity: 0.6,
              fontSize: 12,
              zIndex: 30,
            }}
          >
            Reset free quota (dev)
          </button>
        )}
      </main>
    </>
  );
}