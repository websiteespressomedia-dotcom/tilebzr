import React from "react";
import { FiPhone, FiMail, FiTruck, FiBox, FiHelpCircle } from "react-icons/fi";

export default function SampleRequest() {
  return (
    <section className="py-20 md:py-28 bg-[#fbfaf9] border-t border-gray-100 font-sans text-[#4a2c2a]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#4a2c2a] opacity-50 block mb-4">
            Pre-Planning
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Sample Request
          </h2>
          <div className="w-20 h-[1.5px] bg-[#4a2c2a] mx-auto mb-6 opacity-30"></div>
          <p className="text-sm md:text-base text-[#4a2c2a]/70 font-light leading-relaxed max-w-2xl mx-auto">
            We understand the importance of experiencing our premium architectural surfaces in person. Review our sample policies below to plan your order seamlessly.
          </p>
        </div>

        {/* First 3 Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Card 1: Full Tile Samples */}
          <div className="bg-white p-8 rounded-sm shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#fbfaf9] flex items-center justify-center text-[#4a2c2a] mb-6 border border-[#4a2c2a]/10">
                <FiBox size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-serif mb-3">Full Tile Samples</h3>
              <p className="text-[13px] leading-relaxed text-[#4a2c2a]/70 font-light">
                Samples ordered through the website are sent as full tile samples, charged at our standard full tile sample rate.
              </p>
            </div>
          </div>

          {/* Card 2: Packaging Adjustments */}
          <div className="bg-white p-8 rounded-sm shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#fbfaf9] flex items-center justify-center text-[#4a2c2a] mb-6 border border-[#4a2c2a]/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4a2c2a]">
                  <line x1="6" y1="3" x2="6" y2="21"></line>
                  <line x1="18" y1="3" x2="18" y2="21"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </div>
              <h3 className="text-lg font-serif mb-3">Size Adjustments</h3>
              <p className="text-[13px] leading-relaxed text-[#4a2c2a]/70 font-light">
                Any samples ordered over 60 x 60cm in size will be cut down to fit our packaging safely.
              </p>
            </div>
          </div>

          {/* Card 3: Delivery Details */}
          <div className="bg-white p-8 rounded-sm shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#fbfaf9] flex items-center justify-center text-[#4a2c2a] mb-6 border border-[#4a2c2a]/10">
                <FiTruck size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-serif mb-3">Delivery & Postage</h3>
              <p className="text-[13px] leading-relaxed text-[#4a2c2a]/70 font-light">
                Samples typically arrive within 3–5 working days of purchase. A postage charge will be applied at checkout.
              </p>
            </div>
          </div>

        </div>

        {/* Full-width Card: Customer Support */}
        <div className="bg-white p-8 md:p-10 rounded-sm shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-[#fbfaf9] flex items-center justify-center text-[#4a2c2a] shrink-0 border border-[#4a2c2a]/10">
              <FiHelpCircle size={22} strokeWidth={1.5} />
            </div>
            <div className="max-w-2xl">
              <h3 className="text-xl font-serif mb-2">Need Assistance?</h3>
              <p className="text-[13px] leading-relaxed text-[#4a2c2a]/70 font-light">
                Have questions or custom sample requests? Connect directly with our showroom experts. Clicking either option below will instantly open your phone dialer or email client.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <a 
              href="tel:+447424252426" 
              className="flex items-center justify-center gap-3 bg-[#4a2c2a] text-white px-6 py-4 rounded-sm text-[12px] font-bold uppercase tracking-wider hover:bg-black transition-all shadow-sm active:scale-95"
            >
              <FiPhone size={15} />
              Call +44 7424 252426
            </a>
            <a 
              href="mailto:info@tilebazaar.co.uk" 
              className="flex items-center justify-center gap-3 bg-white border border-[#4a2c2a]/30 text-[#4a2c2a] px-6 py-4 rounded-sm text-[12px] font-bold uppercase tracking-wider hover:border-[#4a2c2a] hover:bg-gray-50 transition-all active:scale-95"
            >
              <FiMail size={15} />
              info@tilebazaar.co.uk
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
