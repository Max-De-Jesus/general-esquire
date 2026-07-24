"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { Actualite } from "@/lib/supabase";
import { NewsItem } from "@/data/adminStore";

export default function PublicActualitesPage() {
  const { lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  const categories = ["Tous", "Conseil Juridique", "Chrysalides", "Événement", "Annonce"];

  // Charger les actualités depuis Supabase
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
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
      }
      setLoadingNews(false);
    };
    fetchNews();
  }, []);

  const filteredNews = selectedCategory === "Tous"
    ? news
    : news.filter((item) => item.category === selectedCategory);

  return (
    <>
      {/* ─── 1. EN-TÊTE : BANNIÈRE ACTUALITÉS ────────────────────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/Femmezen.jpg"
            alt="Bannière Actualités — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── CONTENU PRINCIPAL ────────────────────────────── */}
      <div className="w-full px-4 sm:px-8 xl:px-16 py-12 md:py-20 bg-[#0d0e0d]">
        
        {/* Titre et Intro */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="font-cinzel text-3xl md:text-5xl text-[#E9D18F] mb-6 uppercase tracking-widest drop-shadow-md">
            {lang === "fr" ? "Actualités & Événements" : "News & Events"}
          </h1>
          <p className="font-cormorant text-lg md:text-xl text-[#cabfa6] leading-relaxed">
            {lang === "fr"
              ? "Restez informés des dernières nouveautés de General Esquire, de nos événements Chrysalides, et des annonces importantes."
              : "Stay informed about the latest updates from General Esquire, our Chrysalides events, and important announcements."}
          </p>
        </div>

        {/* Filtres de catégories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-cinzel text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black border-transparent shadow-[0_0_15px_rgba(197,160,89,0.4)]"
                  : "bg-[#131513] text-[#EDE4CF]/80 border-[#C5A059]/30 hover:border-[#E9D18F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille d'actualités */}
        {loadingNews ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveArticle(item)}
                className="group bg-[#131513] border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(197,160,89,0.2)] hover:border-[#C5A059]/60 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={item.imageUrl || "/images/news-placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                  
                  {/* Badge de catégorie */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#1a1c1a]/80 backdrop-blur-md border border-[#C5A059]/40 text-[#E9D18F] font-cinzel text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="font-cormorant text-[#C5A059] text-sm mb-3 font-semibold tracking-wide">
                    {new Date(item.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <h3 className="font-cinzel text-xl text-[#EDE4CF] font-bold mb-3 line-clamp-2 group-hover:text-[#E9D18F] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="font-cormorant text-[#cabfa6] text-base leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {item.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#C5A059]/20">
                    <span className="font-cinzel text-xs text-[#E9D18F] uppercase tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">
                      {lang === "fr" ? "Lire la suite" : "Read more"}
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
          <div className="text-center py-20 font-cormorant text-xl text-[#cabfa6]">
            {lang === "fr" 
              ? "Aucune actualité disponible pour cette catégorie." 
              : "No news available for this category."}
          </div>
        )}
      </div>

      {/* Modal Article */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm z-[100]">
          <div className="bg-[#131513] border border-[#C5A059]/40 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fadeIn">
            
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-[#EDE4CF] hover:text-[#C5A059] w-10 h-10 rounded-full flex items-center justify-center text-2xl backdrop-blur-md transition-colors"
            >
              ×
            </button>

            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={activeArticle.imageUrl || "/images/news-placeholder.jpg"}
                alt={activeArticle.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-[#131513]/40 to-transparent"></div>
            </div>

            <div className="p-6 md:p-12 -mt-20 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-[#1a1c1a] border border-[#C5A059]/40 text-[#E9D18F] font-cinzel text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                  {activeArticle.category}
                </span>
                <span className="font-cormorant text-[#C5A059] text-sm">
                  {new Date(activeArticle.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              
              <h2 className="font-cinzel text-3xl md:text-5xl text-[#EDE4CF] font-bold mb-4 leading-tight">
                {activeArticle.title}
              </h2>
              
              {activeArticle.subtitle && (
                <h3 className="font-cormorant text-xl md:text-2xl text-[#E9D18F] italic mb-8">
                  {activeArticle.subtitle}
                </h3>
              )}

              <div className="prose prose-invert prose-gold max-w-none font-cormorant text-lg text-[#cabfa6] leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: activeArticle.content }} />
              </div>

              {activeArticle.author && (
                <div className="mt-12 pt-6 border-t border-[#C5A059]/20 font-cinzel text-sm text-[#C5A059] tracking-widest uppercase">
                  {lang === "fr" ? "Auteur :" : "Author:"} <span className="text-[#EDE4CF] font-bold">{activeArticle.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
