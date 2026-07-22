import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FloatingThemeToggle } from "@/components/ThemeToggle";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "General Esquire — Chrysalides | Conseil Juridique & Cocooning Touristique",
  description: "General Esquire — Chrysalides : conseil juridique et cocooning touristique. Une structure professionnelle qui allie rigueur du juriste et bienveillance de l'avocat humaniste.",
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

          {/* Footer */}
          <footer className="border-t border-[#C5A059]/20 bg-[#131513] py-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="font-cinzel text-lg tracking-wider text-[#C5A059] font-bold mb-1">GENERAL ESQUIRE</h3>
                <p className="text-[#cabfa6] text-xs">Exerçant à l'enseigne Chrysalides</p>
                <p className="text-[#cabfa6]/70 text-[11px] mt-0.5">Société par actions simplifiées — RCS Paris</p>
              </div>
              <div className="text-center">
                <h4 className="font-cinzel text-xs tracking-widest text-[#E9D18F] uppercase mb-2">NOS SERVICES</h4>
                <p className="text-xs text-[#EDE4CF]">Conseil Juridique &bull; Cocooning Touristique</p>
              </div>
              <div className="text-center md:text-right">
                <h4 className="font-cinzel text-xs tracking-widest text-[#E9D18F] uppercase mb-2">CONTACT</h4>
                <p className="text-xs">
                  <a href="mailto:contact@generalesquire.com" className="text-[#C5A059] hover:text-[#E9D18F] transition-colors">
                    contact@generalesquire.com
                  </a>
                </p>
                <p className="text-xs text-[#cabfa6] mt-0.5">www.generalesquire.com</p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-8 pt-4 border-t border-[#C5A059]/10 text-center text-[11px] text-[#cabfa6]/60 font-cinzel">
              &copy; {new Date().getFullYear()} General Esquire. Tous droits réservés.
            </div>
          </footer>

          <FloatingThemeToggle />
        </LanguageProvider>
      </body>
    </html>
  );
}