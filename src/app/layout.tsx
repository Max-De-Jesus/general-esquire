import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FloatingThemeToggle } from "@/components/ThemeToggle";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import SecurityProtection from "@/components/SecurityProtection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "General Esquire — Chrysalides | Conseil Juridique & Cocooning Touristique",
  description: "General Esquire — Chrysalides : conseil juridique et cocooning touristique. Une structure professionnelle qui allie rigueur du juriste et bienveillance de l'avocat humaniste.",
  icons: {
    icon: [
      { url: "/images/Faviconofficielle1-circle.png?v=2", type: "image/png" },
      { url: "/favicon.ico?v=2" }
    ],
    shortcut: "/images/Faviconofficielle1-circle.png?v=2",
    apple: "/images/Faviconofficielle1-circle.png?v=2",
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
        <link rel="icon" href="/images/Faviconofficielle1-circle.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/images/Faviconofficielle1-circle.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/images/Faviconofficielle1-circle.png?v=2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#1a1c1a] text-[#EDE4CF] font-cormorant min-h-screen antialiased selection:bg-[#C5A059]/30 selection:text-[#E9D18F] flex flex-col justify-between">
        <AuthProvider>
          <LanguageProvider>
            <SecurityProtection />
            <div>
              <Navbar />

              <main className="min-h-[80vh]">{children}</main>
            </div>

            <Footer />

            <FloatingThemeToggle />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}