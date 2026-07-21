import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          color: "white",
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 78% 18%, rgba(200,248,90,0.16), transparent 24%), linear-gradient(180deg, #09111f, #07101d)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 20px",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.12)",
                fontSize: 18,
              }}
            >
              MA
            </div>
            <div style={{ fontSize: 20, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              M Air Electro AI
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 920, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ color: "#dff8a5", fontSize: 18, letterSpacing: "0.34em", textTransform: "uppercase" }}>
            Electrical diagnostics - calculators - experts - protected marketplace
          </div>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 700 }}>
            The premium operating layer for electrical trust.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
