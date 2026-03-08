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
  grams: number;
  processing_minutes: number;
  packaging_cost: number;
  extras_cost: number;
};

type Platform = {
  id: number;
  name: string;
  fee_percent: number;
  fee_fixed: number;
};

type GlobalCosts = {
  filament_cost_per_kg: number;
  electricity_per_kwh: number;
  kwh_per_print_hour: number;
  wear_cost_per_hour: number;
  error_percent: number;
  labor_per_hour: number;
};

type QuoteResult = {
  filamentCost: number;
  electricityCost: number;
  wearCost: number;
  packagingCost: number;
  extrasCost: number;
  errorCost: number;
  laborCost: number;
  totalBaseCost: number;
  breakEvenPrice: number;
  recommendedPrice: number;
  estimatedProfit: number;
};

export default function QuotesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [globalCosts, setGlobalCosts] = useState<GlobalCosts | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);

  const [shippingCost, setShippingCost] = useState(0);
  const [marginTarget, setMarginTarget] = useState(0);

  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadProducts();
    loadVariants();
    loadPlatforms();
    loadGlobalCosts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase.from("products").select("id, name");
    if (!error && data) setProducts(data);
  }

  async function loadVariants() {
    const { data, error } = await supabase
      .from("variants")
      .select("id, product_id, name, grams, processing_minutes, packaging_cost, extras_cost");

    if (!error && data) setVariants(data);
  }

  async function loadPlatforms() {
    const { data, error } = await supabase
      .from("platform_fees")
      .select("id, name, fee_percent, fee_fixed");

    if (!error && data) setPlatforms(data);
  }

  async function loadGlobalCosts() {
    const { data, error } = await supabase
      .from("global_costs")
      .select(
        "filament_cost_per_kg, electricity_per_kwh, kwh_per_print_hour, wear_cost_per_hour, error_percent, labor_per_hour"
      )
      .limit(1)
      .single();

    if (!error && data) setGlobalCosts(data);
  }

  const variant = variants.find((v) => v.id === selectedVariant);
  const platform = platforms.find((p) => p.id === selectedPlatform);

  let result: QuoteResult | null = null;

  if (variant && platform && globalCosts) {
    const printHours = variant.processing_minutes / 60;

    const filamentCost =
      (variant.grams / 1000) * globalCosts.filament_cost_per_kg;

    const electricityCost =
      printHours *
      globalCosts.kwh_per_print_hour *
      globalCosts.electricity_per_kwh;

    const wearCost =
      printHours * globalCosts.wear_cost_per_hour;

    const packagingCost = variant.packaging_cost || 0;
    const extrasCost = variant.extras_cost || 0;

    const subtotalBeforeError =
      filamentCost +
      electricityCost +
      wearCost +
      packagingCost +
      extrasCost +
      shippingCost;

    const errorCost =
      subtotalBeforeError * (globalCosts.error_percent / 100);

    const laborCost = 0;

    const totalBaseCost =
      subtotalBeforeError + errorCost + laborCost;

    const platformPercent = platform.fee_percent / 100;
    const platformFixed = platform.fee_fixed;

    const breakEvenPrice =
      (totalBaseCost + platformFixed) / (1 - platformPercent);

    const recommendedPrice =
      breakEvenPrice * (1 + marginTarget / 100);

    const estimatedProfit = recommendedPrice - totalBaseCost;

    result = {
      filamentCost,
      electricityCost,
      wearCost,
      packagingCost,
      extrasCost,
      errorCost,
      laborCost,
      totalBaseCost,
      breakEvenPrice,
      recommendedPrice,
      estimatedProfit,
    };
  }

  async function saveQuote() {
    setSaveMessage("");

    if (!selectedProduct || !selectedVariant || !selectedPlatform || !result) {
      setSaveMessage("Selecciona producto, variant y plataforma antes de guardar.");
      return;
    }

    const { error } = await supabase.from("quotes").insert([
      {
        product_id: selectedProduct,
        variant_id: selectedVariant,
        platform_id: selectedPlatform,
        shipping_cost: shippingCost,
        shipping_added_to_price: 0,
        margin_target: marginTarget,
        result_break_even: result.breakEvenPrice,
        result_recommended: result.recommendedPrice,
      },
    ]);

    if (error) {
      setSaveMessage(`Error guardando quote: ${error.message}`);
    } else {
      setSaveMessage("✅ Quote guardado correctamente");
    }
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
            Pricing Engine
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: 28,
              lineHeight: 1.1,
              color: "#14213d",
            }}
          >
            Admin · Quotes
          </h1>

          <p
            style={{
              margin: 0,
              color: "#60708d",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Calcula precios recomendados con tus costos internos y fees de plataforma.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 22,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.95)",
              boxShadow: "0 14px 34px rgba(60, 90, 160, 0.08)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputGroup label="Product">
                <select
                  value={selectedProduct ?? ""}
                  onChange={(e) =>
                    setSelectedProduct(e.target.value ? Number(e.target.value) : null)
                  }
                  style={fieldStyle}
                >
                  <option value="">— Selecciona —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup label="Variant">
                <select
                  value={selectedVariant ?? ""}
                  onChange={(e) =>
                    setSelectedVariant(e.target.value ? Number(e.target.value) : null)
                  }
                  style={fieldStyle}
                >
                  <option value="">— Selecciona —</option>
                  {variants
                    .filter((v) => !selectedProduct || v.product_id === selectedProduct)
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                </select>
              </InputGroup>

              <InputGroup label="Platform">
                <select
                  value={selectedPlatform ?? ""}
                  onChange={(e) =>
                    setSelectedPlatform(e.target.value ? Number(e.target.value) : null)
                  }
                  style={fieldStyle}
                >
                  <option value="">— Selecciona —</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </InputGroup>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <InputGroup label="Shipping">
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    style={fieldStyle}
                  />
                </InputGroup>

                <InputGroup label="Margin %">
                  <input
                    type="number"
                    value={marginTarget}
                    onChange={(e) => setMarginTarget(Number(e.target.value))}
                    style={fieldStyle}
                  />
                </InputGroup>
              </div>
            </div>
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
            <h2
              style={{
                marginTop: 0,
                marginBottom: 16,
                color: "#1a2742",
                fontSize: 22,
              }}
            >
              Result
            </h2>

            {!result && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "#f7faff",
                  color: "#60708d",
                  fontSize: 14,
                }}
              >
                Selecciona una variant y una plataforma.
              </div>
            )}

            {result && (
              <div style={{ display: "grid", gap: 10 }}>
                <ResultRow label="Filament cost" value={result.filamentCost} />
                <ResultRow label="Electricity cost" value={result.electricityCost} />
                <ResultRow label="Wear cost" value={result.wearCost} />
                <ResultRow label="Packaging cost" value={result.packagingCost} />
                <ResultRow label="Extras cost" value={result.extrasCost} />
                <ResultRow label="Error cost" value={result.errorCost} />
                <ResultRow label="Labor cost" value={result.laborCost} />
                <ResultRow label="Base cost" value={result.totalBaseCost} />
                <ResultRow label="Break-even" value={result.breakEvenPrice} />
                <ResultRow label="Estimated profit" value={result.estimatedProfit} />

                <div
                  style={{
                    marginTop: 10,
                    padding: 16,
                    borderRadius: 18,
                    background: "#14213d",
                    color: "white",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      opacity: 0.75,
                    }}
                  >
                    Recommended Price
                  </p>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: 30,
                    }}
                  >
                    ${result.recommendedPrice.toFixed(2)}
                  </h3>
                </div>

                <button
                  onClick={saveQuote}
                  style={{
                    marginTop: 12,
                    padding: "15px 18px",
                    borderRadius: 16,
                    border: "none",
                    background: "#4d6edb",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 700,
                    boxShadow: "0 10px 20px rgba(77,110,219,0.22)",
                  }}
                >
                  Save Quote
                </button>

                {saveMessage && (
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: saveMessage.startsWith("✅") ? "#15803d" : "#b91c1c",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {saveMessage}
                  </p>
                )}
              </div>
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

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 14px",
        borderRadius: 14,
        background: "#f7faff",
        flexWrap: "wrap",
        fontSize: 14,
      }}
    >
      <span style={{ color: "#60708d" }}>{label}</span>
      <strong style={{ color: "#1a2742" }}>${value.toFixed(2)}</strong>
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