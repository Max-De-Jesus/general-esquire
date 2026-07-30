"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { Actualite } from "@/lib/supabase";
import { NewsItem } from "@/data/adminStore";
import TickerBanner from "@/components/TickerBanner";

// Initial seed article IDs created before admin deployment (to be hidden on public view when deleted)
const INITIAL_SEED_IDS = [
  "7b22d610-8c3c-4638-8376-d93611c665ff",
  "c034d4de-0563-45eb-a1c8-bbb158742284",
  "36bfe58e-6e46-4697-a555-b014c980e0da",
  "4f92327e-2c9a-44b5-bd57-b98dcd4e5c4c",
];

export default function PublicActualitesPage() {
  const { lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = ["Tous", "Conseil Juridique", "Chrysalides", "Événements", "Annonces"];

  const getCategoryLabel = (cat: string) => {
    if (cat === "Événement" || cat === "Evenement") return "Événements";
    if (cat === "Annonce") return "Annonces";
    return cat;
  };

  // Reset active image index when opening an article
  const handleOpenArticle = (item: NewsItem) => {
    setActiveArticle(item);
    setActiveImageIndex(0);
  };

  // Charger les actualités depuis le stockage local admin et Supabase Cloud
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      let deletedIds: string[] = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem("ge_deleted_news_ids") || "[]");
      } catch {}

      const isExcluded = (id: string) => INITIAL_SEED_IDS.includes(id) || deletedIds.includes(id);

      // 1. Lire les actualités créées localement
      let localItems: NewsItem[] = [];
      const localStored = typeof window !== "undefined"
        ? localStorage.getItem("ge_public_news") || localStorage.getItem("ge_admin_news")
        : null;

      if (localStored) {
        try {
          localItems = JSON.parse(localStored).filter((n: NewsItem) => n.isPublished !== false && !isExcluded(n.id));
        } catch {}
      }

      // 2. Tenter la récupération sur Supabase DB
      try {
        const { data, error } = await supabase
          .from("actualites")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped: NewsItem[] = data
            .filter((a: Actualite) => !isExcluded(a.id))
            .map((a: Actualite) => {
              const allImgs: string[] = Array.isArray((a as any).images) && (a as any).images.length > 0
                ? (a as any).images
                : a.image_url ? [a.image_url] : ["/images/chant.avif"];

              return {
                id: a.id,
                title: a.title,
                subtitle: a.subtitle ?? undefined,
                summary: a.summary,
                content: a.content,
                category: a.category as NewsItem["category"],
                date: a.date,
                imageUrl: allImgs[0],
                images: allImgs,
                author: a.author,
                isFeatured: a.is_featured,
                isPublished: a.is_published,
              };
            });

          // Fusionner les articles locaux et distants sans doublons
          const combinedMap = new Map<string, NewsItem>();
          localItems.forEach((item) => combinedMap.set(item.id, item));
          mapped.forEach((item) => {
            if (!combinedMap.has(item.id)) {
              combinedMap.set(item.id, item);
            }
          });

          setNews(Array.from(combinedMap.values()));
          setLoadingNews(false);
          return;
        }
      } catch {}

      setNews(localItems);
      setLoadingNews(false);
    };

    fetchNews();
  }, []);

  const filteredNews = selectedCategory === "Tous"
    ? news
    : news.filter((item) => {
        if (selectedCategory === "Événements") return item.category === "Événement" || item.category === "Événements" || item.category === "Evenement";
        if (selectedCategory === "Annonces") return item.category === "Annonce" || item.category === "Annonces";
        return item.category === selectedCategory;
      });

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
            {filteredNews.map((item) => {
              const displayImage = item.imageUrl || (item.images && item.images[0]) || "/images/chant.avif";
              const photoCount = item.images ? item.images.length : 1;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenArticle(item)}
                  className="group bg-[#131513] border border-[#C5A059]/25 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:border-[#E9D18F] transition-all duration-500 cursor-pointer flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-60 w-full overflow-hidden bg-[#1a1c1a]">
                    <Image
                      src={displayImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Badge de catégorie */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-[#131513]/90 backdrop-blur-md border border-[#C5A059]/50 text-[#E9D18F] font-cinzel text-[10px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full shadow-md">
                        ✦ {getCategoryLabel(item.category)}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {photoCount > 1 && (
                        <span className="bg-black/80 backdrop-blur-md border border-[#C5A059]/60 text-[#E9D18F] font-cinzel text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
                          🖼️ {photoCount} photos
                        </span>
                      )}
                      {item.isFeatured && (
                        <span className="bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                          À la une
                        </span>
                      )}
                    </div>
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
              );
            })}
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

      {/* Modal Article Complète avec Carrousel Multi-Photos */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#1a1c1a] border-2 border-[#C5A059] rounded-3xl overflow-y-auto p-6 sm:p-10 shadow-[0_0_50px_rgba(197,160,89,0.3)]">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#131513] border border-[#C5A059]/50 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center text-xl font-bold cursor-pointer z-10"
            >
              ✕
            </button>

            <span className="inline-block font-cinzel text-xs text-[#C5A059] tracking-[0.25em] uppercase border border-[#C5A059]/40 px-3.5 py-1 rounded-full bg-[#131513] mb-4">
              ✦ {getCategoryLabel(activeArticle.category)}
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

            {/* Photo Gallery Carousel */}
            {(() => {
              const gallery = activeArticle.images && activeArticle.images.length > 0
                ? activeArticle.images
                : [activeArticle.imageUrl || "/images/chant.avif"];

              return (
                <div className="mb-8 space-y-3">
                  <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-[#C5A059]/40 bg-black">
                    <Image
                      src={gallery[activeImageIndex] || gallery[0]}
                      alt={`${activeArticle.title} - Photo ${activeImageIndex + 1}`}
                      fill
                      className="object-cover object-center transition-all duration-300"
                    />

                    {/* Left/Right Arrows if multiple photos */}
                    {gallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center text-lg font-bold shadow-lg"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center text-lg font-bold shadow-lg"
                        >
                          ›
                        </button>

                        {/* Image Counter Badge */}
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/50 text-[#E9D18F] font-mono text-xs">
                          {activeImageIndex + 1} / {gallery.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip if multiple photos */}
                  {gallery.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1">
                      {gallery.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            activeImageIndex === idx
                              ? "border-[#E9D18F] scale-105 shadow-[0_0_12px_rgba(233,209,143,0.5)]"
                              : "border-[#C5A059]/30 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={img} alt={`Vignette ${idx + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

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
