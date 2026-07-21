import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          background:
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.18), transparent 26%), linear-gradient(180deg, #0b1524, #07101d)",
          color: "#c8f85a",
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: "-0.08em",
        }}
      >
        M
      </div>
    ),
    size,
  );
}
