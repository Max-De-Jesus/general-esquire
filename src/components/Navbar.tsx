"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ServicesModal from "./ServicesModal";
import { LanguageToggle } from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { t, lang } = useLanguage();
  const { user, clientProfile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar completely on the Home Page
  if (pathname === "/") {
    return null;
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-40 w-full transition-all duration-500 border-b ${
          scrolled
            ? "bg-[#131513]/90 backdrop-blur-md border-[#C5A059]/40 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-[#131513]/70 backdrop-blur-sm border-[#C5A059]/20 py-4"
        }`}
      >
        <div className="w-full max-w-full overflow-hidden px-3 sm:px-6 md:px-12 flex items-center justify-between gap-2">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 p-1 bg-[#131513] rounded-full border border-[#C5A059]/60 shadow-[0_0_12px_rgba(197,160,89,0.4)] transition-transform duration-300 group-hover:scale-105 flex-shrink-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src="/images/logo.png"
                  alt="General Esquire Logo"
                  fill
                  sizes="44px"
                  className="object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_4px_rgba(197,160,89,0.8)]"
                />
              </div>
            </div>
            <div className="flex flex-col min-w-0 truncate">
              <span className="font-cinzel text-xs sm:text-lg md:text-xl font-bold tracking-wide sm:tracking-wider text-[#C5A059] group-hover:text-[#E9D18F] transition-colors truncate">
                GENERAL ESQUIRE
              </span>
              <span className="font-cinzel text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-[#cabfa6] uppercase -mt-0.5 sm:-mt-1 truncate">
                Chrysalides
              </span>
            </div>
          </Link>

          {/* Controls: Language Toggle, Auth & Services Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-4 flex-shrink-0">
            <LanguageToggle />

            {/* Auth Button / User Profile */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/connexion"
                  className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#1A1C1A] border border-[#C5A059]/40 text-[#E9D18F] text-[10px] sm:text-xs font-cinzel font-bold hover:border-[#E9D18F] transition-all"
                  title={user.email || ""}
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C5A059] text-black flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase">
                    {(clientProfile?.full_name || user.email || "U")[0]}
                  </span>
                  <span className="hidden md:inline truncate max-w-[80px] sm:max-w-[100px]">
                    {clientProfile?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[10px] sm:text-xs font-cinzel font-bold hover:bg-rose-900/60 transition-all cursor-pointer"
                  title={lang === "fr" ? "Se Déconnecter" : "Sign Out"}
                >
                  🚪
                </button>
              </div>
            ) : (
              <Link
                href="/connexion"
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-cinzel text-[10px] sm:text-xs md:text-sm font-bold tracking-wider text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:brightness-110 transition-all shadow-[0_0_12px_rgba(197,160,89,0.3)] cursor-pointer whitespace-nowrap"
              >
                {lang === "fr" ? "Connexion" : "Sign In"}
              </Link>
            )}

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-wider sm:tracking-widest text-[#E9D18F] border border-[#C5A059]/40 bg-[#131513]/70 hover:bg-[#0F3823] hover:border-[#E9D18F] transition-all backdrop-blur-md cursor-pointer whitespace-nowrap"
            >
              <span>{t("nav_services")}</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Services Modal Panel */}
      <ServicesModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
