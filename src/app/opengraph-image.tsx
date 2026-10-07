import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Build with SSU — Faculty of Engineering & Technology, Sri Sri University";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const file = await readFile(path.join(process.cwd(), "public/logo-ssu-512.png"));
  const crest = `data:image/png;base64,${file.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #4A0A15 0%, #6E0F1F 55%, #1A1216 100%)",
        color: "#FFF8E7",
        fontFamily: "serif",
        position: "relative",
      }}
    >
      {/* gold grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "linear-gradient(rgba(201,162,39,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
        <img src={crest} width={96} height={96} alt="" style={{ borderRadius: 48 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: 4,
            color: "#E8CF7A",
          }}
        >
          <span>FACULTY OF ENGINEERING &amp; TECHNOLOGY</span>
          <span style={{ color: "rgba(255,248,231,.6)" }}>SRI SRI UNIVERSITY · CUTTACK</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>Build with SSU.</span>
        <span style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.05, color: "#C9A227" }}>
          Hire with SSU.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          color: "rgba(255,248,231,.8)",
        }}
      >
        <span>AI · Data Science · Cyber Defense · Digital Forensics</span>
        <span style={{ color: "#E8CF7A" }}>Learn · Lead · Serve</span>
      </div>
    </div>,
    size,
  );
}
