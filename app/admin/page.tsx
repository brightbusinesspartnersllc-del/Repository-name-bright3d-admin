import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
        padding: "32px 20px 60px",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1150,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: 24,
            borderRadius: 24,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 12px 35px rgba(51, 92, 173, 0.10)",
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 24,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo.png"
              alt="Bright3D"
              width={95}
              height={95}
              style={{ objectFit: "contain" }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5d78c6",
                fontWeight: 700,
              }}
            >
              Bright3D Internal System
            </p>

            <h1
              style={{
                margin: "8px 0 10px",
                fontSize: 38,
                lineHeight: 1.05,
                color: "#14213d",
              }}
            >
              Bright3D Admin
            </h1>

            <p
              style={{
                margin: 0,
                color: "#5e6b85",
                fontSize: 16,
                lineHeight: 1.6,
                maxWidth: 640,
              }}
            >
              Pricing, products, variants, fees and quote history — all in one
              place for the Bright Girls.
            </p>
          </div>
        </div>

        {/* Quick section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              padding: 22,
              borderRadius: 22,
              background: "#14213d",
              color: "white",
              boxShadow: "0 16px 32px rgba(20, 33, 61, 0.22)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                opacity: 0.8,
              }}
            >
              Main workflow
            </p>

            <h2
              style={{
                margin: "10px 0 10px",
                fontSize: 28,
                lineHeight: 1.15,
              }}
            >
              Add product → create variant → calculate quote
            </h2>

            <p
              style={{
                margin: 0,
                opacity: 0.9,
                lineHeight: 1.6,
                fontSize: 15,
                maxWidth: 580,
              }}
            >
              Use this panel to keep all your pricing organized and ready when a
              new Etsy product drops.
            </p>
          </div>

          <div
            style={{
              padding: 22,
              borderRadius: 22,
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 12px 28px rgba(51, 92, 173, 0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#6a7aa5",
                fontWeight: 700,
              }}
            >
              Tip
            </p>

            <h3
              style={{
                margin: "10px 0 8px",
                fontSize: 22,
                color: "#1d2a44",
              }}
            >
              Make it phone-friendly
            </h3>

            <p
              style={{
                margin: 0,
                color: "#60708d",
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              Once we finish styling the main pages, this can feel super nice on
              iPhone and iPad too.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          <DashboardCard
            emoji="🧮"
            title="Price Calculator"
            desc="Calculate recommended product pricing using your internal costs."
            link="/admin/quotes"
          />

          <DashboardCard
            emoji="🗂️"
            title="Quotes History"
            desc="Review saved quotes and revisit previous calculations."
            link="/admin/quotes-history"
          />

          <DashboardCard
            emoji="📏"
            title="Variants"
            desc="Manage sizes, grams, print time, packaging and extras."
            link="/admin/variants"
          />

          <DashboardCard
            emoji="📦"
            title="Products"
            desc="Add and organize products for your Bright3D catalog."
            link="/admin/products"
          />

          <DashboardCard
            emoji="⚙️"
            title="Global Costs"
            desc="Edit filament, electricity, wear and other pricing variables."
            link="/admin/costs"
          />

          <DashboardCard
            emoji="💳"
            title="Platform Fees"
            desc="Adjust Etsy, Mercari, eBay and future platform fees."
            link="/admin/platform-fees"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  emoji,
  title,
  desc,
  link,
}: {
  emoji: string;
  title: string;
  desc: string;
  link: string;
}) {
  return (
    <Link href={link} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.86)",
          borderRadius: 22,
          padding: 22,
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow: "0 12px 28px rgba(60, 90, 160, 0.08)",
          minHeight: 190,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: "#eef4ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              marginBottom: 16,
            }}
          >
            {emoji}
          </div>

          <h3
            style={{
              margin: "0 0 10px",
              fontSize: 22,
              color: "#1a2742",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: 0,
              color: "#63718c",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            {desc}
          </p>
        </div>

        <div
          style={{
            marginTop: 18,
            fontWeight: 700,
            color: "#4d6edb",
            fontSize: 15,
          }}
        >
          Open →
        </div>
      </div>
    </Link>
  );
}