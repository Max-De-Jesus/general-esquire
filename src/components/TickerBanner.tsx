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
    <div className={`relative z-20 w-full bg-[#0d0e0d] border-y border-[#C5A059]/30 py-3.5 overflow-hidden shadow-inner select-none ${className}`}>
      <div className="flex whitespace-nowrap animate-ticker">
        {[...Array(6)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-5 px-3 font-cinzel text-xs sm:text-sm text-[#C5A059] uppercase">
            {items.map((item, itemIdx) => {
              const isBrand = item.toUpperCase().includes("GENERAL ESQUIRE");
              return (
                <React.Fragment key={itemIdx}>
                  {itemIdx > 0 && <span className="text-[#C5A059]/40 text-[8px] mx-1">◆</span>}
                  <span
                    className={`inline-block ${
                      isBrand
                        ? "font-bold text-[#E9D18F] drop-shadow-[0_0_12px_rgba(197,160,89,0.45)] tracking-[0.10em]"
                        : "tracking-[0.14em]"
                    }`}
                    style={{ wordSpacing: "normal" }}
                  >
                    {item}
                  </span>
                </React.Fragment>
              );
            })}
            <span className="text-[#C5A059]/40 text-[8px] mx-1">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
