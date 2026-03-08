"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
      }}
    >
      {/* Top spacing wrapper */}
      <div
        style={{
          flex: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      {/* Bottom nav */}
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
        <span
          style={{
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          {emoji}
        </span>

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