import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FloatingThemeToggle } from "@/components/ThemeToggle";
import { LanguageProvider } from "@/context/LanguageContext";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.generalesquire.com"),
  title: "General Esquire — Chrysalides | Conseil Juridique & Cocooning Touristique",
  description:
    "General Esquire — Chrysalides : conseil juridique et cocooning touristique. Une structure professionnelle qui allie rigueur du juriste et bienveillance de l'avocat humaniste.",
  icons: {
    icon: "/images/logoge1.png",
    shortcut: "/images/logoge1.png",
    apple: "/images/logoge1.png",
  },
  openGraph: {
    title: "General Esquire — Chrysalides | Conseil Juridique & Cocooning Touristique",
    description:
      "General Esquire — Chrysalides : conseil juridique et cocooning touristique. Une structure professionnelle qui allie rigueur du juriste et bienveillance de l'avocat humaniste.",
    url: "https://www.generalesquire.com",
    siteName: "General Esquire",
    images: [
      {
        url: "https://www.generalesquire.com/images/logoge1.png",
        width: 1200,
        height: 630,
        alt: "General Esquire — Chrysalides",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "General Esquire — Chrysalides",
    description:
      "General Esquire — Chrysalides : conseil juridique et cocooning touristique.",
    images: ["https://www.generalesquire.com/images/logoge1.png"],
  },
};

const TICKER_ITEMS = [
  "General Esquire",
  "Excellence",
  "Compétence",
  "Chrysalides",
  "Bienveillance",
  "Résilience",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#1a1c1a] text-[#EDE4CF] font-cormorant min-h-screen antialiased selection:bg-[#C5A059]/30 selection:text-[#E9D18F] flex flex-col justify-between">
        <LanguageProvider>
          <div>
            {/* Top Luxury Ticker */}
            <div className="w-full bg-[#0d0e0d] border-b border-[#C5A059]/30 overflow-hidden py-2 text-[#C5A059] text-xs font-cinzel tracking-[0.25em] uppercase shadow-inner z-50 relative">
              <div className="flex whitespace-nowrap animate-ticker">
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                  <span key={idx} className="flex items-center gap-6 px-6">
                    <span className="drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]">{item}</span>
                    <span className="text-[#C5A059]/40 text-[8px]">◆</span>
                  </span>
                ))}
              </div>
            </div>

            <Navbar />

            <main className="min-h-[80vh]">{children}</main>
          </div>

          <Footer />

          <FloatingThemeToggle />
        </LanguageProvider>
      </body>
    </html>
  );
}