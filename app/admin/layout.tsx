"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setLoggedIn(!!session);
    setLoading(false);
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("✅ Login successful");
  }

  async function handleLogout() {
    setMessage("");
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
          fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        Cargando...
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
          fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "rgba(255,255,255,0.92)",
            borderRadius: 24,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 14px 34px rgba(60, 90, 160, 0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#5d78c6",
              fontWeight: 700,
            }}
          >
            Bright3D Private Access
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 28,
              lineHeight: 1.1,
              color: "#14213d",
            }}
          >
            Sign in
          </h1>

          <p
            style={{
              margin: "0 0 18px",
              color: "#60708d",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Solo el equipo de Bright3D puede entrar aquí.
          </p>

          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                  color: "#24324d",
                  fontSize: 14,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={fieldStyle}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                  color: "#24324d",
                  fontSize: 14,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={fieldStyle}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: "15px 18px",
                borderRadius: 16,
                border: "none",
                background: "#14213d",
                color: "white",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "0 10px 20px rgba(20,33,61,0.18)",
              }}
            >
              Sign In
            </button>

            {message && (
              <p
                style={{
                  margin: 0,
                  color: message.startsWith("✅") ? "#15803d" : "#b91c1c",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 14px 0",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid #d9e2f2",
            background: "white",
            color: "#24324d",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Log out
        </button>
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      <nav
        style={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid #dde6f5",
          boxShadow: "0 -10px 26px rgba(60, 90, 160, 0.10)",
          padding: "10px 12px calc(12px + env(safe-area-inset-bottom))",
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
          }}
        >
          <NavItem
            href="/admin"
            emoji="🏠"
            label="Home"
            active={pathname === "/admin"}
          />
          <NavItem
            href="/admin/products"
            emoji="📦"
            label="Products"
            active={pathname === "/admin/products"}
          />
          <NavItem
            href="/admin/variants"
            emoji="📏"
            label="Variants"
            active={pathname === "/admin/variants"}
          />
          <NavItem
            href="/admin/quotes"
            emoji="🧮"
            label="Quotes"
            active={pathname === "/admin/quotes"}
          />
          <NavItem
            href="/admin/quotes-history"
            emoji="🗂️"
            label="History"
            active={pathname === "/admin/quotes-history"}
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  href,
  emoji,
  label,
  active,
}: {
  href: string;
  emoji: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          minHeight: 70,
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          background: active ? "#14213d" : "white",
          border: active ? "1px solid #14213d" : "1px solid #e6edf8",
          boxShadow: active
            ? "0 10px 22px rgba(20, 33, 61, 0.22)"
            : "0 6px 16px rgba(60, 90, 160, 0.06)",
          transform: active ? "translateY(-2px)" : "none",
          transition: "all 0.2s ease",
          padding: "6px 4px",
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: active ? "white" : "#52627f",
            letterSpacing: "0.01em",
            textAlign: "center",
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d9e2f2",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  background: "white",
};