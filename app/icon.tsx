import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 112,
          background:
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.18), transparent 26%), linear-gradient(180deg, #0b1524, #07101d)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 284,
            height: 284,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 80,
            color: "#c8f85a",
            fontSize: 168,
            fontWeight: 800,
            letterSpacing: "-0.08em",
            textShadow: "0 0 36px rgba(200,248,90,0.28)",
          }}
        >
          M
        </div>
      </div>
    ),
    size,
  );
}
