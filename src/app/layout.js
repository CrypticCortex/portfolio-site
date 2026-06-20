import { Inter, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  title: "Kalyan -- AI Engineer",
  description:
    "AI engineer building agentic LLM systems in production at Guidewire. Eval harnesses, not vibes. Published research and open-source contributions to AI infrastructure.",
  keywords: ["AI Engineer", "LLM", "agentic systems", "MLOps", "evals", "RAG", "MCP", "Guidewire"],
  openGraph: {
    title: "Kalyan -- AI Engineer",
    description:
      "Agentic LLM systems in production, proven with eval harnesses. Research + merged open-source contributions.",
    url: "https://crypticcortex.vercel.app",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.add("light");})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
