"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Product = {
  id: number;
  name: string;
  category: string | null;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,category")
        .order("id", { ascending: true });

      if (error) setError(error.message);
      else setProducts((data as Product[]) ?? []);
    }

    run();
  }, []);

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Bright HQ — Test</h1>

      {error ? (
        <p style={{ color: "crimson" }}>Error: {error}</p>
      ) : products.length === 0 ? (
        <p>No products yet (inserta 1 fila en Supabase).</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              #{p.id} — {p.name} {p.category ? `(${p.category})` : ""}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}