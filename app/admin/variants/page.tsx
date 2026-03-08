"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

type Product = {
  id: number;
  name: string;
};

type Variant = {
  id: number;
  product_id: number;
  name: string;
  grams: number | null;
  processing_minutes: number | null;
  packaging_cost: number | null;
  extras_cost: number | null;
};

export default function AdminVariantsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [productId, setProductId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [grams, setGrams] = useState<number | "">("");
  const [processingMinutes, setProcessingMinutes] = useState<number | "">("");
  const [packagingCost, setPackagingCost] = useState<number | "">("");
  const [extrasCost, setExtrasCost] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setMsg("");

    const [productsRes, variantsRes] = await Promise.all([
      supabase.from("products").select("id, name").order("id", { ascending: false }),
      supabase
        .from("variants")
        .select("id, product_id, name, grams, processing_minutes, packaging_cost, extras_cost")
        .order("id", { ascending: false }),
    ]);

    if (!productsRes.error && productsRes.data) {
      setProducts(productsRes.data);
    }

    if (!variantsRes.error && variantsRes.data) {
      setVariants(variantsRes.data);
    }
  }

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();

    if (!productId) {
      setMsg("Selecciona un producto 🙂");
      return;
    }

    if (!name.trim()) {
      setMsg("Ponle nombre a la variant 🙂");
      return;
    }

    setLoading(true);
    setMsg("");

    const { error } = await supabase.from("variants").insert([
      {
        product_id: productId,
        name: name.trim(),
        grams: grams === "" ? null : Number(grams),
        processing_minutes:
          processingMinutes === "" ? null : Number(processingMinutes),
        packaging_cost: packagingCost === "" ? 0 : Number(packagingCost),
        extras_cost: extrasCost === "" ? 0 : Number(extrasCost),
      },
    ]);

    setLoading(false);

    if (error) {
      setMsg(`Error agregando variant: ${error.message}`);
      return;
    }

    setProductId("");
    setName("");
    setGrams("");
    setProcessingMinutes("");
    setPackagingCost("");
    setExtrasCost("");
    setMsg("✅ Variant agregada correctamente");
    loadAll();
  }

  function getProductName(id: number) {
    return products.find((p) => p.id === id)?.name || `Product ${id}`;
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
            Variant Manager
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 28,
              lineHeight: 1.1,
              color: "#14213d",
            }}
          >
            Admin · Variants
          </h1>

          <p
            style={{
              margin: 0,
              color: "#60708d",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Agrega variantes completas para usarlas en la calculadora de precios.
          </p>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 22,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 14px 34px rgba(60, 90, 160, 0.08)",
            marginBottom: 18,
          }}
        >
          <form
            onSubmit={addVariant}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <InputGroup label="Product">
              <select
                value={productId}
                onChange={(e) =>
                  setProductId(e.target.value ? Number(e.target.value) : "")
                }
                style={fieldStyle}
              >
                <option value="">— Selecciona producto —</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    #{product.id} — {product.name}
                  </option>
                ))}
              </select>
            </InputGroup>

            <InputGroup label="Variant name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: 6 inch / painted / standard"
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="Grams">
              <input
                type="number"
                step="0.01"
                value={grams}
                onChange={(e) =>
                  setGrams(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Ej: 120"
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="Processing minutes">
              <input
                type="number"
                step="1"
                value={processingMinutes}
                onChange={(e) =>
                  setProcessingMinutes(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="Ej: 420"
                style={fieldStyle}
              />
            </InputGroup>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <InputGroup label="Packaging cost">
                <input
                  type="number"
                  step="0.01"
                  value={packagingCost}
                  onChange={(e) =>
                    setPackagingCost(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="Ej: 1"
                  style={fieldStyle}
                />
              </InputGroup>

              <InputGroup label="Extras cost">
                <input
                  type="number"
                  step="0.01"
                  value={extrasCost}
                  onChange={(e) =>
                    setExtrasCost(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="Ej: 0"
                  style={fieldStyle}
                />
              </InputGroup>
            </div>

            <button
              type="submit"
              disabled={loading}
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
              {loading ? "Saving..." : "Save Variant"}
            </button>

            {msg && (
              <p
                style={{
                  margin: 0,
                  color: msg.startsWith("✅") ? "#15803d" : "#b91c1c",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {msg}
              </p>
            )}
          </form>
        </div>

        <div>
          <h2
            style={{
              marginBottom: 14,
              color: "#1a2742",
              fontSize: 22,
            }}
          >
            Saved Variants
          </h2>

          {variants.length === 0 ? (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                background: "#f7faff",
                color: "#60708d",
                fontSize: 14,
              }}
            >
              No hay variants todavía.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.95)",
                    borderRadius: 18,
                    padding: 16,
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 12px 28px rgba(60, 90, 160, 0.07)",
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
                    Variant #{variant.id}
                  </p>

                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: 20,
                      color: "#1a2742",
                    }}
                  >
                    {variant.name}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 6px",
                      color: "#63718c",
                      fontSize: 14,
                    }}
                  >
                    Product: {getProductName(variant.product_id)}
                  </p>

                  <p
                    style={{
                      margin: "0 0 4px",
                      color: "#63718c",
                      fontSize: 14,
                    }}
                  >
                    Grams: {variant.grams ?? "—"}
                  </p>

                  <p
                    style={{
                      margin: "0 0 4px",
                      color: "#63718c",
                      fontSize: 14,
                    }}
                  >
                    Processing minutes: {variant.processing_minutes ?? "—"}
                  </p>

                  <p
                    style={{
                      margin: "0 0 4px",
                      color: "#63718c",
                      fontSize: 14,
                    }}
                  >
                    Packaging cost: {variant.packaging_cost ?? 0}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: "#63718c",
                      fontSize: 14,
                    }}
                  >
                    Extras cost: {variant.extras_cost ?? 0}
                  </p>
                </div>
              ))}
            </div>
          )}
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