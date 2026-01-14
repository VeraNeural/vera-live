"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_STARTS = [
  "Help me process something",
  "Build something with me",
  "I just need to vent",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [greeting] = useState(getGreeting());
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const hasStarted = messages.length > 0;
  const isLoggedIn = !!user;

  // Check auth on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      // Handle auth gate
      if (data?.gate === "auth_required") {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "I'd love to keep talking. Sign up free to continue our conversation.",
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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left - Orb */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)",
            boxShadow: "0 0 20px 5px rgba(139, 92, 246, 0.2)",
          }}
        />

        {/* Right - Auth buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          {authChecked && !isLoggedIn && (
            <>
              <Link
                href="/login"
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid #27272a",
                  color: "white",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Sign In
              </Link>
              <Link
                href="/login"
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
          {authChecked && isLoggedIn && (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </div>
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
          }}
        >
          {/* Large Orb */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)",
              boxShadow: "0 0 60px 15px rgba(139, 92, 246, 0.3)",
              marginBottom: 32,
            }}
          />

          <h1
            style={{
              fontSize: 48,
              fontWeight: 600,
              margin: 0,
              marginBottom: 12,
            }}
          >
            {greeting}
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#a1a1aa",
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
              background: "#14141a",
              borderRadius: 999,
              padding: "8px 12px",
              border: "1px solid #27272a",
              marginBottom: 24,
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
                color: "white",
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
                  color: "#a1a1aa",
                  border: "1px solid #27272a",
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
                      background: m.role === "user" ? "#7c3aed" : "#1c1c24",
                      color: "white",
                      fontSize: 15,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.content}
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
                      background: "#1c1c24",
                      color: "#71717a",
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
              background: "linear-gradient(transparent, #0b0b0f 20%)",
              padding: "24px",
            }}
          >
            <div
              style={{
                maxWidth: 720,
                margin: "0 auto",
                display: "flex",
                background: "#14141a",
                borderRadius: 999,
                padding: "8px 12px",
                border: "1px solid #27272a",
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
                  color: "white",
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