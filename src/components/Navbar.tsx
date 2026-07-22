"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ServicesModal from "./ServicesModal";
import { LanguageToggle } from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { TranslationKey } from "@/data/translations";

const NAV_ITEMS: { key: TranslationKey; href: string }[] = [
  { key: "nav_home", href: "/" },
  { key: "nav_conseil", href: "/conseil-juridique" },
  { key: "nav_cocooning", href: "/cocooning-touristique" },
  { key: "nav_excursions", href: "/excursions" },
  { key: "nav_hebergement", href: "/hebergement" },
  { key: "nav_repas", href: "/repas" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar completely on the Home Page as requested
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
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 p-1 bg-[#131513] rounded-full border border-[#C5A059]/60 shadow-[0_0_12px_rgba(197,160,89,0.4)] transition-transform duration-300 group-hover:scale-105 flex-shrink-0 flex items-center justify-center">
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
            <div className="flex flex-col">
              <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider text-[#C5A059] group-hover:text-[#E9D18F] transition-colors">
                GENERAL ESQUIRE
              </span>
              <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#cabfa6] uppercase -mt-1">
                Chrysalides
              </span>
            </div>
          </Link>

          {/* Navigation Links for sub-pages */}
          <div className="hidden lg:flex items-center gap-1 bg-[#1A1C1A]/80 backdrop-blur-md p-1.5 rounded-full border border-[#C5A059]/30 shadow-lg">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 rounded-full font-cinzel text-xs tracking-wider font-medium transition-all duration-300 ${
                    isActive
                      ? "text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] font-semibold shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                      : "text-[#EDE4CF]/80 hover:text-[#E9D18F] hover:bg-[#0F3823]/50"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>

          {/* Controls: Language Toggle & Services Menu Trigger */}
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-cinzel text-xs tracking-widest text-[#E9D18F] border border-[#C5A059]/40 bg-[#131513]/70 hover:bg-[#0F3823] hover:border-[#E9D18F] transition-all backdrop-blur-md cursor-pointer"
            >
              <span>{t("nav_services")}</span>
              <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
