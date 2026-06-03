"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiInstagram } from "react-icons/fi";
import Link from "next/link";

const REELS = [
  { id: 1, url: "https://www.instagram.com/reel/DY4f0CEgdgU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel1.mp4" },
  { id: 2, url: "https://www.instagram.com/reel/DYom962jmS4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel2.mp4" },
  { id: 3, url: "https://www.instagram.com/reel/DYT2FjRAULm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel3.mp4" },
  { id: 4, url: "https://www.instagram.com/reel/DY4jeeaCdJ0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel4.mp4" },
  { id: 5, url: "https://www.instagram.com/reel/DX1GNlEDV7d/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel5.mp4" },
  // Duplicate for smoother infinite scroll experience when showing multiple items
  { id: 6, url: "https://www.instagram.com/reel/DY4f0CEgdgU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel1.mp4" },
  { id: 7, url: "https://www.instagram.com/reel/DYom962jmS4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel2.mp4" },
  { id: 8, url: "https://www.instagram.com/reel/DYT2FjRAULm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", video: "/reels/reel3.mp4" },
];

export default function InstagramReels() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0].clientWidth;
      scrollRef.current.scrollBy({ left: -(itemWidth + 24), behavior: 'smooth' }); // 24px is gap-6
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0].clientWidth;
      
      const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      // If we are at the end, smoothly scroll back to start
      if (scrollRef.current.scrollLeft >= maxScrollLeft - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: itemWidth + 24, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      scrollRight();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4a2c2a] opacity-50 block mb-4">
              Social Media
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#4a2c2a]">
              Follow our <span className="italic font-light">Journey</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-white transition-all hover:border-[#4a2c2a] shadow-sm"
              aria-label="Previous Reel"
            >
              <FiChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-white transition-all hover:border-[#4a2c2a] shadow-sm"
              aria-label="Next Reel"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          className="relative -mx-4 px-4 md:mx-0 md:px-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              .flex::-webkit-scrollbar {
                display: none;
              }
            `}} />
            
            {REELS.map((reel, index) => (
              <Link
                key={`${reel.id}-${index}`}
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start flex-none w-[280px] sm:w-[320px] md:w-[350px] aspect-[9/16] rounded-2xl overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-shadow duration-300"
              >
                <video 
                  src={reel.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Overlay for better text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 scale-90 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <FiInstagram size={32} />
                  </div>
                  <h3 className="text-xl font-serif mb-2 text-center drop-shadow-md">Watch on Instagram</h3>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <FiInstagram size={18} />
                     </div>
                     <span className="text-sm font-medium tracking-wide drop-shadow-md">Reel</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
