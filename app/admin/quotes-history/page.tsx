"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

type Quote = {
  id: number;
  created_at: string;
  shipping_cost: number | null;
  margin_target: number | null;
  result_break_even: number | null;
  result_recommended: number | null;
  product_id: number | null;
  variant_id: number | null;
  platform_id: number | null;
};

type Product = {
  id: number;
  name: string;
};

type Variant = {
  id: number;
  name: string;
};

type Platform = {
  id: number;
  name: string;
};

export default function QuotesHistoryPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const [quotesRes, productsRes, variantsRes, platformsRes] = await Promise.all([
      supabase
        .from("quotes")
        .select(
          "id, created_at, shipping_cost, margin_target, result_break_even, result_recommended, product_id, variant_id, platform_id"
        )
        .order("id", { ascending: false }),

      supabase.from("products").select("id, name"),

      supabase.from("variants").select("id, name"),

      supabase.from("platform_fees").select("id, name"),
    ]);

    if (!quotesRes.error && quotesRes.data) setQuotes(quotesRes.data);
    if (!productsRes.error && productsRes.data) setProducts(productsRes.data);
    if (!variantsRes.error && variantsRes.data) setVariants(variantsRes.data);
    if (!platformsRes.error && platformsRes.data) setPlatforms(platformsRes.data);

    setLoading(false);
  }

  function getProductName(id: number | null) {
    return products.find((p) => p.id === id)?.name || `Product ${id ?? ""}`;
  }

  function getVariantName(id: number | null) {
    return variants.find((v) => v.id === id)?.name || `Variant ${id ?? ""}`;
  }

  function getPlatformName(id: number | null) {
    return platforms.find((p) => p.id === id)?.name || `Platform ${id ?? ""}`;
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
            Quote Archive
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 28,
              lineHeight: 1.1,
              color: "#14213d",
            }}
          >
            Admin · Quotes History
          </h1>

          <p
            style={{
              margin: 0,
              color: "#60708d",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Revisa cotizaciones guardadas y vuelve a consultar precios anteriores.
          </p>
        </div>

        {loading ? (
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
        ) : quotes.length === 0 ? (
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: "#f7faff",
              color: "#60708d",
              fontSize: 14,
            }}
          >
            No hay quotes guardados todavía.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {quotes.map((quote) => (
              <div
                key={quote.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.95)",
                  borderRadius: 18,
                  padding: 16,
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 12px 28px rgba(60, 90, 160, 0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  <div>
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
                      Quote #{quote.id}
                    </p>

                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: 20,
                        color: "#1a2742",
                      }}
                    >
                      {getProductName(quote.product_id)}
                    </h3>

                    <p
                      style={{
                        margin: "0 0 4px",
                        color: "#63718c",
                        fontSize: 14,
                      }}
                    >
                      {getVariantName(quote.variant_id)} · {getPlatformName(quote.platform_id)}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 16,
                      background: "#14213d",
                      color: "white",
                      alignSelf: "start",
                      minWidth: 120,
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        opacity: 0.75,
                      }}
                    >
                      Recommended
                    </p>
                    <strong style={{ fontSize: 22 }}>
                      ${Number(quote.result_recommended ?? 0).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <InfoRow
                    label="Fecha"
                    value={new Date(quote.created_at).toLocaleString()}
                  />
                  <InfoRow
                    label="Shipping"
                    value={`$${Number(quote.shipping_cost ?? 0).toFixed(2)}`}
                  />
                  <InfoRow
                    label="Margin"
                    value={`${Number(quote.margin_target ?? 0).toFixed(2)}%`}
                  />
                  <InfoRow
                    label="Break-even"
                    value={`$${Number(quote.result_break_even ?? 0).toFixed(2)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        background: "#f7faff",
        flexWrap: "wrap",
        fontSize: 14,
      }}
    >
      <span style={{ color: "#60708d" }}>{label}</span>
      <strong style={{ color: "#1a2742" }}>{value}</strong>
    </div>
  );
}