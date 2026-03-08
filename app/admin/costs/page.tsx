"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

type GlobalCosts = {
  id: number;
  filament_cost_per_kg: number;
  electricity_per_kwh: number;
  kwh_per_print_hour: number;
  wear_cost_per_hour: number;
  error_percent: number;
  labor_per_hour: number;
};

export default function GlobalCostsPage() {
  const [costs, setCosts] = useState<GlobalCosts | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCosts();
  }, []);

  async function loadCosts() {
    const { data, error } = await supabase
      .from("global_costs")
      .select(
        "id, filament_cost_per_kg, electricity_per_kwh, kwh_per_print_hour, wear_cost_per_hour, error_percent, labor_per_hour"
      )
      .limit(1)
      .single();

    if (error) {
      setMessage(`Error cargando costos: ${error.message}`);
      return;
    }

    setCosts(data);
  }

  async function saveCosts() {
    if (!costs) return;

    setMessage("");

    const { error } = await supabase
      .from("global_costs")
      .update({
        filament_cost_per_kg: costs.filament_cost_per_kg,
        electricity_per_kwh: costs.electricity_per_kwh,
        kwh_per_print_hour: costs.kwh_per_print_hour,
        wear_cost_per_hour: costs.wear_cost_per_hour,
        error_percent: costs.error_percent,
        labor_per_hour: costs.labor_per_hour,
      })
      .eq("id", costs.id);

    if (error) {
      setMessage(`Error guardando cambios: ${error.message}`);
    } else {
      setMessage("✅ Costos actualizados");
    }
  }

  if (!costs) {
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
            Cost Controls
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 28,
              lineHeight: 1.1,
              color: "#14213d",
            }}
          >
            Admin · Global Costs
          </h1>

          <p
            style={{
              margin: 0,
              color: "#60708d",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Ajusta aquí los costos globales sin necesidad de entrar a Supabase.
          </p>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 22,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 14px 34px rgba(60, 90, 160, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <InputGroup label="Filament cost per kg">
              <input
                type="number"
                step="0.01"
                value={costs.filament_cost_per_kg}
                onChange={(e) =>
                  setCosts({
                    ...costs,
                    filament_cost_per_kg: Number(e.target.value),
                  })
                }
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="Electricity per kWh">
              <input
                type="number"
                step="0.01"
                value={costs.electricity_per_kwh}
                onChange={(e) =>
                  setCosts({
                    ...costs,
                    electricity_per_kwh: Number(e.target.value),
                  })
                }
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="kWh per print hour">
              <input
                type="number"
                step="0.01"
                value={costs.kwh_per_print_hour}
                onChange={(e) =>
                  setCosts({
                    ...costs,
                    kwh_per_print_hour: Number(e.target.value),
                  })
                }
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="Wear cost per hour">
              <input
                type="number"
                step="0.01"
                value={costs.wear_cost_per_hour}
                onChange={(e) =>
                  setCosts({
                    ...costs,
                    wear_cost_per_hour: Number(e.target.value),
                  })
                }
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="Error percent">
              <input
                type="number"
                step="0.01"
                value={costs.error_percent}
                onChange={(e) =>
                  setCosts({
                    ...costs,
                    error_percent: Number(e.target.value),
                  })
                }
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="Labor per hour">
              <input
                type="number"
                step="0.01"
                value={costs.labor_per_hour}
                onChange={(e) =>
                  setCosts({
                    ...costs,
                    labor_per_hour: Number(e.target.value),
                  })
                }
                style={fieldStyle}
              />
            </InputGroup>

            <button
              onClick={saveCosts}
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
          </div>
        </div>
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