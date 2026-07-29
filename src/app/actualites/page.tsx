"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { Actualite } from "@/lib/supabase";
import { NewsItem } from "@/data/adminStore";
import TickerBanner from "@/components/TickerBanner";

export default function PublicActualitesPage() {
  const { lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  const categories = ["Tous", "Conseil Juridique", "Chrysalides", "Événement", "Annonce"];

  // Charger les actualités depuis Supabase et le stockage local admin
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const { data, error } = await supabase
          .from("actualites")
          .select("*")
          .eq("is_published", true)
          .order("date", { ascending: false });

        if (!error && data) {
          const mapped: NewsItem[] = data.map((a: Actualite) => ({
            id: a.id,
            title: a.title,
            subtitle: a.subtitle ?? undefined,
            summary: a.summary,
            content: a.content,
            category: a.category as NewsItem["category"],
            date: a.date,
            imageUrl: a.image_url,
            author: a.author,
            isFeatured: a.is_featured,
          }));
          setNews(mapped);
          localStorage.setItem("ge_admin_news", JSON.stringify(mapped));
        } else {
          // Fallback sur le stockage local admin si présent
          const localStored = localStorage.getItem("ge_admin_news");
          if (localStored) {
            const parsed: NewsItem[] = JSON.parse(localStored);
            setNews(parsed.filter((n) => n.isPublished !== false));
          } else {
            setNews([]);
          }
        }
      } catch {
        const localStored = localStorage.getItem("ge_admin_news");
        if (localStored) {
          const parsed: NewsItem[] = JSON.parse(localStored);
          setNews(parsed.filter((n) => n.isPublished !== false));
        } else {
          setNews([]);
        }
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = selectedCategory === "Tous"
    ? news
    : news.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0d0e0d] text-[#EDE4CF] relative overflow-x-hidden">
      {/* ─── 1. EN-TÊTE : BANNIÈRE ACTUALITÉS (chant.avif) ───────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/chant.avif"
            alt="Bannière Actualités — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER) ────────────────────────────────── */}
      <TickerBanner items={["GENERAL ESQUIRE", "ACTUALITÉS", "COMMUNIQUÉS OFFICIELS", "CHRYSALIDES", "ÉVÉNEMENTS", "EXCELLENCE"]} className="mb-8" />

      {/* ─── CONTENU PRINCIPAL ────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-16">
        
        {/* Titre et Intro */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1.5 rounded-full bg-[#131513]/80 backdrop-blur-md inline-block mb-4 shadow-md">
            General Esquire — Chrysalides
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#E9D18F] mb-4 uppercase tracking-widest drop-shadow-md">
            {lang === "fr" ? "Actualités & Communiqués" : "News & Announcements"}
          </h1>
          <p className="font-cormorant text-xl text-[#cabfa6] leading-relaxed max-w-2xl mx-auto">
            {lang === "fr"
              ? "Retrouvez l'ensemble des communiqués officiels, des événements Chrysalides et des annonces récents de notre cabinet."
              : "Find all official announcements, Chrysalides events, and recent updates from our firm."}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* Filtres de catégories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-cinzel text-xs font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black border-transparent shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-105"
                  : "bg-[#131513] text-[#EDE4CF]/80 border-[#C5A059]/30 hover:border-[#E9D18F] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille d'actualités */}
        {loadingNews ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveArticle(item)}
                className="group bg-[#131513] border border-[#C5A059]/25 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:border-[#E9D18F] transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-60 w-full overflow-hidden bg-[#1a1c1a]">
                  <Image
                    src={item.imageUrl || "/images/chant.avif"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Badge de catégorie */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#131513]/90 backdrop-blur-md border border-[#C5A059]/50 text-[#E9D18F] font-cinzel text-[10px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full shadow-md">
                      ✦ {item.category}
                    </span>
                  </div>

                  {item.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                        À la une
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="font-cormorant text-[#C5A059] text-sm mb-2 font-semibold tracking-wide flex items-center justify-between">
                    <span>{item.date}</span>
                    <span className="text-xs text-[#cabfa6]/70">Par {item.author || "Administration"}</span>
                  </div>
                  
                  <h3 className="font-cinzel text-lg text-[#EDE4CF] font-bold mb-3 line-clamp-2 group-hover:text-[#E9D18F] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  <p className="font-cormorant text-[#cabfa6] text-base leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {item.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#C5A059]/20">
                    <span className="font-cinzel text-xs text-[#E9D18F] uppercase tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">
                      {lang === "fr" ? "Lire l'Article" : "Read Article"}
                    </span>
                    <span className="text-[#C5A059] text-xl group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#131513]/60 border border-[#C5A059]/20 rounded-3xl p-12 max-w-xl mx-auto">
            <span className="text-4xl block mb-4">📢</span>
            <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-2">
              {lang === "fr" ? "Aucune actualité publiée pour le moment" : "No news published yet"}
            </h3>
            <p className="font-cormorant text-lg text-[#cabfa6]">
              {lang === "fr" 
                ? "L'administration du cabinet publiera très prochainement de nouveaux communiqués."
                : "New announcements will be published by the administration very soon."}
            </p>
          </div>
        )}
      </div>

      {/* Modal Article Complète */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#1a1c1a] border-2 border-[#C5A059] rounded-3xl overflow-y-auto p-6 sm:p-10 shadow-[0_0_50px_rgba(197,160,89,0.3)]">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#131513] border border-[#C5A059]/50 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="inline-block font-cinzel text-xs text-[#C5A059] tracking-[0.25em] uppercase border border-[#C5A059]/40 px-3.5 py-1 rounded-full bg-[#131513] mb-4">
              ✦ {activeArticle.category}
            </span>

            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#E9D18F] mb-3 leading-snug">
              {activeArticle.title}
            </h2>

            {activeArticle.subtitle && (
              <p className="font-cormorant text-xl text-[#EDE4CF]/90 italic mb-4">
                {activeArticle.subtitle}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs font-cinzel text-[#C5A059] mb-6 border-b border-[#C5A059]/20 pb-4">
              <span>📅 {activeArticle.date}</span>
              <span>✍️ Par {activeArticle.author}</span>
            </div>

            {activeArticle.imageUrl && (
              <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden mb-6 border border-[#C5A059]/30">
                <Image
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
            )}

            <div className="font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed whitespace-pre-line space-y-4">
              {activeArticle.content}
            </div>

            <div className="mt-8 pt-6 border-t border-[#C5A059]/30 text-center">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                Fermer l'Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
