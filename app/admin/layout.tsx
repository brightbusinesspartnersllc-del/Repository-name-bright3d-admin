"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, FormEvent } from "react";
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
      <div style={loadingStyle}>
        Cargando...
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div style={loginPage}>
        <div style={loginCard}>
          <p style={loginTag}>
            Bright3D Private Access
          </p>

          <h1 style={loginTitle}>
            Sign in
          </h1>

          <p style={loginSubtitle}>
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
              <label style={labelStyle}>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={fieldStyle}
                autoComplete="email"
                placeholder="tuemail@ejemplo.com"
              />
            </div>

            <div>
              <label style={labelStyle}>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={fieldStyle}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              style={buttonStyle}
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
    <div style={appWrapper}>
      <div style={topBar}>
        <button onClick={handleLogout} style={logoutButton}>
          Log out
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {children}
      </div>

      <nav style={navBar}>
        <div style={navGrid}>
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
    <Link href={href} style={{ textDecoration: "none" }}>
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
            ? "0 10px 22px rgba(20,33,61,0.22)"
            : "0 6px 16px rgba(60, 90, 160, 0.06)",
        }}
      >
        <span style={{ fontSize: 20 }}>{emoji}</span>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: active ? "white" : "#52627f",
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d9e2f2",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box" as const,
  background: "white",
  color: "#14213d",
  WebkitTextFillColor: "#14213d",
  opacity: 1,
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(180deg,#f8fbff,#eef4ff)",
};

const loginPage = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "linear-gradient(180deg,#f8fbff,#eef4ff)",
};

const loginCard = {
  width: "100%",
  maxWidth: 420,
  background: "white",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 14px 34px rgba(60,90,160,0.08)",
};

const loginTag = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#5d78c6",
  fontWeight: 700,
};

const loginTitle = {
  margin: "10px 0",
  fontSize: 28,
  color: "#14213d",
};

const loginSubtitle = {
  marginBottom: 18,
  color: "#60708d",
  fontSize: 14,
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontWeight: 700,
  color: "#24324d",
};

const buttonStyle = {
  marginTop: 8,
  padding: "15px",
  borderRadius: 16,
  border: "none",
  background: "#14213d",
  color: "white",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

const appWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  background: "linear-gradient(180deg,#f8fbff,#eef4ff)",
};

const topBar = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "10px 14px",
};

const logoutButton = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #d9e2f2",
  background: "white",
  cursor: "pointer",
};

const navBar = {
  position: "sticky" as const,
  bottom: 0,
  background: "white",
  borderTop: "1px solid #dde6f5",
  padding: "10px",
};

const navGrid = {
  maxWidth: 780,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(5,1fr)",
  gap: 8,
};