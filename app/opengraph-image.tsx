import { ImageResponse } from "next/og";

export const alt = "Nades Hands. Loaf cakes and cupcakes, baked every Friday.";
export const size = { width: 1200, height: 630 };
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
          padding: 80,
          background: "#f7f3ee",
          color: "#3d2822",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700 }}>Nades Hands</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Baked Friday morning. At your door by the weekend.
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 40,
              padding: "14px 28px",
              borderRadius: 999,
              background: "#f2c14e",
              color: "#2a1b17",
              fontSize: 32,
              fontWeight: 600,
            }}
          >
            Order by Thursday 5pm
          </div>
        </div>
      </div>
    ),
    size,
  );
}
