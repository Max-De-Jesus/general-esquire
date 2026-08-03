"use client";

import React from "react";

interface TickerBannerProps {
  items?: string[];
  className?: string;
}

const DEFAULT_ITEMS = [
  "GENERAL ESQUIRE",
  "EXCELLENCE",
  "COMPÉTENCE",
  "CHRYSALIDES",
  "BIENVEILLANCE",
  "RÉSILIENCE",
];

export default function TickerBanner({ items = DEFAULT_ITEMS, className = "" }: TickerBannerProps) {
  return (
    <div className={`relative z-20 w-full bg-gradient-to-r from-[#0a0b0a] via-[#131513] to-[#0a0b0a] border-y border-[#C5A059]/40 py-3.5 overflow-hidden shadow-inner select-none ${className}`}>
      <div className="flex whitespace-nowrap animate-ticker">
        {[...Array(6)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-5 px-3 font-cinzel text-xs sm:text-sm text-[#C5A059] uppercase">
            {items.map((item, itemIdx) => {
              return (
                <React.Fragment key={itemIdx}>
                  {itemIdx > 0 && (
                    <span className="text-[#E9D18F] text-xs mx-1 animate-pulse drop-shadow-[0_0_8px_rgba(233,209,143,0.8)]">✦</span>
                  )}
                  <span
                    className="inline-block tracking-[0.18em] font-semibold text-[#EDE4CF] hover:text-[#E9D18F] transition-colors"
                    style={{ wordSpacing: "normal" }}
                  >
                    {item}
                  </span>
                </React.Fragment>
              );
            })}
            <span className="text-[#E9D18F] text-xs mx-1 animate-pulse drop-shadow-[0_0_8px_rgba(233,209,143,0.8)]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
