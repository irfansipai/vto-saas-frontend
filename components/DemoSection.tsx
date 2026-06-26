// frontend/components/DemoSection.tsx
"use client";

import { useState } from "react";

const DEMO_ITEMS = [
  { id: "necklace", label: "Necklace", sku: "NECK-001", icon: "vital_signs" },
  { id: "earring", label: "Earrings", sku: "EAR-001", icon: "hearing" },
  { id: "nosepin", label: "Nosepin", sku: "NOSE-001", icon: "face" },
  { id: "forehead", label: "Maang Tikka", sku: "FORE-001", icon: "psychology" },
];

// Using a dedicated demo API key that your backend will recognize
const DEMO_API_KEY = "test_key_123"; 

export function DemoSection() {
  const [activeItem, setActiveItem] = useState(DEMO_ITEMS[0]);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Construct the secure URL that points to your isolated widget route
  const widgetUrl = `/widget?api_key=${DEMO_API_KEY}&sku=${activeItem.sku}`;

  return (
    <section id="demo" className="py-24 bg-[#15120E] relative border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-fraunces text-3xl md:text-5xl text-ivory mb-4">
            Experience the <span className="text-gold italic">Mirror</span>
          </h2>
          <p className="font-inter text-sand max-w-2xl mx-auto">
            Test the real-time AI tracking. Our embeddable widget runs entirely in the browser at 30+ FPS, requiring zero app downloads for your customers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch h-full">
          
          {/* Controls Side */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 justify-center">
            <h3 className="font-ibm-plex text-[11px] text-gold tracking-widest uppercase mb-2 ml-1">
              Select Try-On Mode
            </h3>
            <div className="flex flex-col gap-3">
              {DEMO_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (activeItem.id !== item.id) {
                      setIframeLoading(true);
                      setActiveItem(item);
                    }
                  }}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 text-left ${
                    activeItem.id === item.id
                      ? "bg-gold/10 border-gold/40 text-gold shadow-[0_0_15px_rgba(201,162,75,0.1)]"
                      : "bg-[#1A1410] border-gold/10 text-sand hover:bg-gold/5 hover:border-gold/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: activeItem.id === item.id ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <div>
                    <div className={`font-inter font-semibold ${activeItem.id === item.id ? "text-ivory" : "text-sand"}`}>
                      {item.label}
                    </div>
                    <div className="font-ibm-plex text-[10px] opacity-60 uppercase mt-0.5">
                      SKU: {item.sku}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-5 rounded-lg border border-gold/10 bg-ink">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-ibm-plex text-xs text-emerald-400">WASM Engine Active</span>
              </div>
              <p className="font-inter text-xs text-sand/80 leading-relaxed">
                The widget dynamically loads the required AI sub-graphs (Face or Pose) based on the requested SKU parameters.
              </p>
            </div>
          </div>

          {/* Iframe Widget Wrapper */}
          <div className="w-full lg:w-2/3 aspect-[3/4] md:aspect-video lg:aspect-auto lg:h-[600px] relative rounded-xl overflow-hidden border border-gold/20 bg-black shadow-2xl">
            
            {/* Loading State Overlay */}
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950">
                <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-4"></div>
                <div className="font-ibm-plex text-xs text-gold tracking-widest uppercase">
                  Recompiling Neural Graph...
                </div>
              </div>
            )}

            {/* The Actual Embedded Product */}
            <iframe
              src={widgetUrl}
              allow="camera"
              className="w-full h-full border-none"
              onLoad={() => setIframeLoading(false)}
            />
          </div>

        </div>
      </div>
    </section>
  );
}