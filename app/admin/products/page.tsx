"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

type Product = {
  id: number;
  name: string;
  category: string | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setMsg("");

    const { data, error } = await supabase
      .from("products")
      .select("id, name, category")
      .order("id", { ascending: false });

    if (error) {
      setMsg(`Error cargando productos: ${error.message}`);
      return;
    }

    setProducts(data || []);
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setMsg("Ponle un nombre al producto 🙂");
      return;
    }

    setLoading(true);
    setMsg("");

    const { error } = await supabase.from("products").insert([
      {
        name: name.trim(),
        category: category.trim() || null,
      },
    ]);

    setLoading(false);

    if (error) {
      setMsg(`Error agregando producto: ${error.message}`);
      return;
    }

    setName("");
    setCategory("");
    setMsg("✅ Producto agregado correctamente");
    loadProducts();
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
            Product Manager
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 28,
              lineHeight: 1.1,
              color: "#14213d",
            }}
          >
            Admin · Products
          </h1>

          <p
            style={{
              margin: 0,
              color: "#60708d",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Agrega productos nuevos desde PC, iPad o iPhone sin entrar a
            Supabase.
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
            onSubmit={addProduct}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <InputGroup label="Product name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Bulbasaur Piggy Bank"
                style={fieldStyle}
              />
            </InputGroup>

            <InputGroup label="Category">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Pokemon / Holder / Piggy Bank"
                style={fieldStyle}
              />
            </InputGroup>

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
              {loading ? "Saving..." : "Save Product"}
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
            Saved Products
          </h2>

          {products.length === 0 ? (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                background: "#f7faff",
                color: "#60708d",
                fontSize: 14,
              }}
            >
              No hay productos todavía.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
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
                    Product #{product.id}
                  </p>

                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: 20,
                      color: "#1a2742",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#63718c",
                      fontSize: 14,
                    }}
                  >
                    Category: {product.category || "—"}
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