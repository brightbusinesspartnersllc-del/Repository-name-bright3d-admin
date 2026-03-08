"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

type PlatformFee = {
  id: number;
  name: string;
  fee_percent: number;
  fee_fixed: number;
  active: boolean | null;
};

export default function PlatformFeesPage() {
  const [platforms, setPlatforms] = useState<PlatformFee[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPlatforms();
  }, []);

  async function loadPlatforms() {
    setMessage("");

    const { data, error } = await supabase
      .from("platform_fees")
      .select("id, name, fee_percent, fee_fixed, active")
      .order("id", { ascending: true });

    if (error) {
      setMessage(`Error cargando platform fees: ${error.message}`);
      return;
    }

    setPlatforms(data || []);
  }

  function updatePlatformField(
    id: number,
    field: keyof PlatformFee,
    value: string | number | boolean | null
  ) {
    setPlatforms((prev) =>
      prev.map((platform) =>
        platform.id === id ? { ...platform, [field]: value } : platform
      )
    );
  }

  async function savePlatform(platform: PlatformFee) {
    setMessage("");

    const { error } = await supabase
      .from("platform_fees")
      .update({
        name: platform.name,
        fee_percent: platform.fee_percent,
        fee_fixed: platform.fee_fixed,
        active: platform.active,
      })
      .eq("id", platform.id);

    if (error) {
      setMessage(`Error guardando platform fee: ${error.message}`);
    } else {
      setMessage(`✅ ${platform.name} actualizado correctamente`);
    }
  }

  if (platforms.length === 0) {
    return (
      <div
        style={{
          padding: "18px 14px 90px",
          fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 620,
            margin: "0 auto",
          }}
        >
          <Link
            href="/admin"
            style={{
              textDecoration: "none",
              color: "#4d6edb",
              fontWeight: 700,
              display: "inline-block",
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            ← Back to Admin
          </Link>

          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: "#f7faff",
              color: "#60708d",
              fontSize: 14,
            }}
          >
            Cargando...
          </div>

          {message && (
            <p
              style={{
                marginTop: 12,
                color: "#b91c1c",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "18px 14px 90px",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 620,
          margin: "0 auto",
        }}
      >
        <Link
          href="/admin"
          style={{
            textDecoration: "none",
            color: "#4d6edb",
            fontWeight: 700,
            display: "inline-block",
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          ← Back to Admin
        </Link>

        <div
          style={{
            background: "rgba(255,255,255,0.86)",
            borderRadius: 22,
            padding: 18,
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 14px 34px rgba(60, 90, 160, 0.08)",
            marginBottom: 18,
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
            Fee Controls
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 28,
              lineHeight: 1.1,
              color: "#14213d",
            }}
          >
            Admin · Platform Fees
          </h1>

          <p
            style={{
              margin: 0,
              color: "#60708d",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Edita los fees de Etsy, Mercari, eBay y otras plataformas sin tocar Supabase.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          {platforms.map((platform) => (
            <div
              key={platform.id}
              style={{
                padding: 18,
                borderRadius: 22,
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 14px 34px rgba(60, 90, 160, 0.08)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 12,
                  color: "#5d78c6",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Platform #{platform.id}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <InputGroup label="Name">
                  <input
                    type="text"
                    value={platform.name}
                    onChange={(e) =>
                      updatePlatformField(platform.id, "name", e.target.value)
                    }
                    style={fieldStyle}
                  />
                </InputGroup>

                <InputGroup label="Fee percent">
                  <input
                    type="number"
                    step="0.01"
                    value={platform.fee_percent}
                    onChange={(e) =>
                      updatePlatformField(
                        platform.id,
                        "fee_percent",
                        Number(e.target.value)
                      )
                    }
                    style={fieldStyle}
                  />
                </InputGroup>

                <InputGroup label="Fee fixed">
                  <input
                    type="number"
                    step="0.01"
                    value={platform.fee_fixed}
                    onChange={(e) =>
                      updatePlatformField(
                        platform.id,
                        "fee_fixed",
                        Number(e.target.value)
                      )
                    }
                    style={fieldStyle}
                  />
                </InputGroup>

                <InputGroup label="Active">
                  <select
                    value={platform.active ? "true" : "false"}
                    onChange={(e) =>
                      updatePlatformField(
                        platform.id,
                        "active",
                        e.target.value === "true"
                      )
                    }
                    style={fieldStyle}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </InputGroup>

                <button
                  onClick={() => savePlatform(platform)}
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
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <p
            style={{
              marginTop: 16,
              color: message.startsWith("✅") ? "#15803d" : "#b91c1c",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function InputGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
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
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d9e2f2",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  background: "white",
};