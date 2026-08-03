"use client";

import React, { useEffect, useRef } from "react";

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

// Étoiles scintillantes fixes réparties sur le panneau
const SPARKLE_STARS = [
  { id: 1,  top: "18%", left:  "3%",  delay: "0s",    dur: "2.2s", size: "10px", tx: "2px",  ty: "-3px" },
  { id: 2,  top: "72%", left:  "8%",  delay: "0.4s",  dur: "3.1s", size: "8px",  tx: "-2px", ty: "2px"  },
  { id: 3,  top: "40%", left: "15%",  delay: "1.2s",  dur: "2.6s", size: "11px", tx: "3px",  ty: "1px"  },
  { id: 4,  top: "85%", left: "22%",  delay: "0.7s",  dur: "2.9s", size: "7px",  tx: "-1px", ty: "-2px" },
  { id: 5,  top: "15%", left: "30%",  delay: "1.8s",  dur: "3.3s", size: "9px",  tx: "2px",  ty: "3px"  },
  { id: 6,  top: "60%", left: "38%",  delay: "0.2s",  dur: "2.4s", size: "12px", tx: "-3px", ty: "-1px" },
  { id: 7,  top: "30%", left: "48%",  delay: "2.1s",  dur: "2.7s", size: "8px",  tx: "1px",  ty: "2px"  },
  { id: 8,  top: "78%", left: "55%",  delay: "0.9s",  dur: "3.0s", size: "10px", tx: "-2px", ty: "3px"  },
  { id: 9,  top: "22%", left: "63%",  delay: "1.5s",  dur: "2.3s", size: "9px",  tx: "3px",  ty: "-2px" },
  { id: 10, top: "50%", left: "72%",  delay: "0.6s",  dur: "3.2s", size: "11px", tx: "-1px", ty: "1px"  },
  { id: 11, top: "88%", left: "80%",  delay: "1.9s",  dur: "2.5s", size: "7px",  tx: "2px",  ty: "-3px" },
  { id: 12, top: "10%", left: "88%",  delay: "0.3s",  dur: "2.8s", size: "10px", tx: "-3px", ty: "2px"  },
  { id: 13, top: "65%", left: "94%",  delay: "1.1s",  dur: "3.4s", size: "8px",  tx: "1px",  ty: "-1px" },
  { id: 14, top: "45%", left: "98%",  delay: "2.3s",  dur: "2.1s", size: "9px",  tx: "-2px", ty: "3px"  },
];

export default function TickerBanner({ items = DEFAULT_ITEMS, className = "" }: TickerBannerProps) {
  return (
    <div className={`relative z-20 w-full bg-gradient-to-r from-[#0a0b0a] via-[#131513] to-[#0a0b0a] border-y border-[#C5A059]/40 py-3.5 overflow-hidden shadow-inner select-none ${className}`}>

      {/* ── Étoiles scintillantes fixes sur le panneau ── */}
      {SPARKLE_STARS.map((star) => (
        <span
          key={star.id}
          className="sparkle-star"
          style={{
            top: star.top,
            left: star.left,
            fontSize: star.size,
            animationDelay: star.delay,
            animationDuration: star.dur,
            "--tx": star.tx,
            "--ty": star.ty,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          ✦
        </span>
      ))}

      {/* ── Texte défilant ── */}
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
