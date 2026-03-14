"use client";

import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#e0e0e0",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ fontSize: 14, color: "#666", letterSpacing: "0.1em" }}>
        initializing globe...
      </div>
    </div>
  ),
});

export default function Page() {
  return <GlobeScene />;
}
