import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import RunweiPage from "./RunweiPage";
import "./runwei.css";

// Polices auto-hébergées au build (compatibles avec l'export statique).
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--rw-font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--rw-font-sora", display: "swap" });

export const metadata: Metadata = {
  title: "Runwei Video — Formules d'abonnement",
  description: "Runwei Video : création vidéo par intelligence artificielle — formule Starter, Extension Premium IA et offre Business sur devis.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${inter.variable} ${sora.variable}`}>
      <RunweiPage />
    </div>
  );
}
