"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";

type Message = {
  role: "user" | "assistant";
  content: string;
  gate?: "signup" | "upgrade";
};

const QUICK_STARTS = [
  "Help me process something",
  "Build something with me",
  "I just need to vent",
];

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function getGreeting(time: TimeOfDay): string {
  switch (time) {
    case "morning": return "Good morning";
    case "afternoon": return "Good afternoon";
    case "evening": return "Good evening";
    case "night": return "Good evening";
  }
}

export default function Page() {
  const { isLoaded, isSignedIn } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");
  const [mounted, setMounted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isDark = timeOfDay === "evening" || timeOfDay === "night";
  const isNight = timeOfDay === "night";

  // Theme colors based on time
  const theme = {
    background: isDark 
      ? "linear-gradient(180deg, #0b0b0f 0%, #12121a 50%, #0a0a0e 100%)"
      : "linear-gradient(180deg, #f5f0e6 0%, #e8e0d0 50%, #ddd5c5 100%)",
    text: isDark ? "#ffffff" : "#2a2520",
    subtext: isDark ? "#a1a1aa" : "#6b635a",
    inputBg: isDark ? "#14141a" : "rgba(255,255,255,0.8)",
    inputBorder: isDark ? "#27272a" : "rgba(180,170,150,0.3)",
    cardBg: isDark ? "#1c1c24" : "rgba(255,255,255,0.7)",
    orbGlow: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)",
  };

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMessage: Message = { role: "user", content };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

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
            content: data.content || "I'd love to keep talking. Sign up free to continue our conversation.",
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
            content: data.content || "Join Sanctuary for unlimited conversations.",
            gate: "upgrade",
          },
        ]);
        return;
      }

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data?.content ?? "Sorry — no response returned.",
        },
      ]);
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
    return <div style={{ minHeight: "100vh", background: "#0b0b0f" }} />;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.background,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s ease",
      }}
    >
      {/* Stars - only at night */}
      {isNight && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.6 }}>
          {[
            { top: 8, left: 15 }, { top: 12, left: 45 }, { top: 5, left: 78 },
            { top: 18, left: 32 }, { top: 25, left: 88 }, { top: 10, left: 55 },
            { top: 22, left: 10 }, { top: 15, left: 65 }, { top: 30, left: 25 },
            { top: 7, left: 92 }, { top: 28, left: 40 }, { top: 20, left: 72 },
          ].map((star, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 2,
                height: 2,
                background: "rgba(255,255,255,0.7)",
                borderRadius: "50%",
                top: `${star.top}%`,
                left: `${star.left}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Window - top right */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: "8%",
          width: 120,
          height: 160,
          background: isDark
            ? "linear-gradient(180deg, #1a1a30 0%, #0d0d20 100%)"
            : "linear-gradient(180deg, #87CEEB 0%, #b8d8e8 50%, #98c8e0 100%)",
          border: `4px solid ${isDark ? "#2a2a45" : "#c8b8a0"}`,
          borderRadius: 4,
          overflow: "hidden",
          display: hasStarted ? "none" : "block",
        }}
      >
        {/* Sun or Moon */}
        {isDark ? (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 25,
              height: 25,
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #f5f5ff 0%, #d0d0e8 50%, #b0b0d0 100%)",
              boxShadow: "0 0 20px rgba(200,200,255,0.4)",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 25,
              right: 25,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #fff8e0 0%, #ffd700 100%)",
              boxShadow: "0 0 15px rgba(255,215,0,0.5)",
            }}
          />
        )}
        {/* Window dividers */}
        <div style={{ position: "absolute", top: 0, left: "50%", width: 4, height: "100%", background: isDark ? "#2a2a45" : "#c8b8a0", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 4, background: isDark ? "#2a2a45" : "#c8b8a0", transform: "translateY(-50%)" }} />
      </div>

      {/* HEADER */}
      <header
        style={{
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Left - Orb */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)",
            boxShadow: `0 0 20px 5px ${theme.orbGlow}`,
          }}
        />

        {/* Right - Auth buttons */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {isLoaded && !isSignedIn && (
            <>
              <Link
                href="/login"
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: `1px solid ${theme.inputBorder}`,
                  color: theme.text,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  background: "transparent",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "white",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
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
                    width: 36,
                    height: 36,
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
            padding: "0 24px",
            textAlign: "center",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* Large Orb */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)",
              boxShadow: `0 0 60px 15px ${theme.orbGlow}`,
              marginBottom: 32,
            }}
          />

          <h1
            style={{
              fontSize: 48,
              fontWeight: 600,
              margin: 0,
              marginBottom: 12,
              color: theme.text,
            }}
          >
            {getGreeting(timeOfDay)}
          </h1>

          <p
            style={{
              fontSize: 18,
              color: theme.subtext,
              margin: 0,
              marginBottom: 40,
            }}
          >
            AI that helps you do anything, your way, your pace
          </p>

          {/* Input */}
          <div
            style={{
              width: "100%",
              maxWidth: 600,
              display: "flex",
              background: theme.inputBg,
              borderRadius: 999,
              padding: "8px 12px",
              border: `1px solid ${theme.inputBorder}`,
              marginBottom: 24,
              boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="What's on your mind?"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                fontSize: 16,
                padding: "12px 16px",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ask VERA
            </button>
          </div>

          {/* Quick Starts */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
          >
            {QUICK_STARTS.map((text) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "transparent",
                  color: theme.subtext,
                  border: `1px solid ${theme.inputBorder}`,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
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
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              paddingBottom: 120,
            }}
          >
            <div
              style={{
                maxWidth: 720,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "14px 18px",
                      borderRadius: 20,
                      background: m.role === "user" ? "#7c3aed" : theme.cardBg,
                      color: m.role === "user" ? "white" : theme.text,
                      fontSize: 15,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.content}

                    {m.gate === "signup" && (
                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <Link
                          href="/signup"
                          style={{
                            padding: "10px 20px",
                            borderRadius: 999,
                            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                            color: "white",
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          Sign Up Free
                        </Link>
                      </div>
                    )}

                    {m.gate === "upgrade" && (
                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <Link
                          href="/upgrade"
                          style={{
                            padding: "10px 20px",
                            borderRadius: 999,
                            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                            color: "white",
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          Join Sanctuary — $12/mo
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 20,
                      background: theme.cardBg,
                      color: theme.subtext,
                      fontSize: 15,
                    }}
                  >
                    Thinking...
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
                ? "linear-gradient(transparent, #0b0b0f 20%)"
                : "linear-gradient(transparent, #e8e0d0 20%)",
              padding: "24px",
            }}
          >
            <div
              style={{
                maxWidth: 720,
                margin: "0 auto",
                display: "flex",
                background: theme.inputBg,
                borderRadius: 999,
                padding: "8px 12px",
                border: `1px solid ${theme.inputBorder}`,
                boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
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
                  color: theme.text,
                  fontSize: 16,
                  padding: "12px 16px",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "white",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ask VERA
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}