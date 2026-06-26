// frontend/components/hero-section.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      {/* Left column */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-[1px] w-8 bg-[#C9A24B] opacity-70" />
          <span className="font-mono text-[11px] tracking-[0.15em] text-[#C9A24B] uppercase">
            AI VIRTUAL TRY-ON FOR LUXURY JEWELRY
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl leading-[1.03] tracking-[-0.03em] font-medium mb-6 text-[#F3EEE3]">
          Let customers try<br />
          <em className="italic text-[#E8C97A]">jewelry</em> before<br />
          they buy.
        </h1>

        <p className="text-[#B8A99A] text-lg leading-[1.7] max-w-[420px] mb-10">
          Enterprise AR virtual try-on — deployed as a single script tag. Measurably higher conversion, fewer returns, zero app downloads.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/signup" className="bg-[#C9A24B] text-[#15120E] px-7 py-3.5 rounded-md font-bold text-[15px] flex items-center gap-2 hover:opacity-90 transition-opacity">
            Start free trial
            <ArrowRight size={18} />
          </Link>
          <Link href="#" className="border border-[#C9A24B]/40 text-[#E8C97A] px-7 py-3.5 rounded-md font-semibold text-[15px] flex items-center hover:bg-[#C9A24B]/10 transition-colors">
            Book a demo
          </Link>
        </div>

        {/* Social proof inline */}
        <div className="mt-10 flex gap-8 border-t border-[#C9A24B]/10 pt-8">
          <div>
            <div className="font-serif text-3xl font-medium text-[#F3EEE3]">10M+</div>
            <div className="font-mono text-[11px] text-[#B8A99A] tracking-[0.1em] uppercase mt-1">try-ons served</div>
          </div>
          <div>
            <div className="font-serif text-3xl font-medium text-[#F3EEE3]">500+</div>
            <div className="font-mono text-[11px] text-[#B8A99A] tracking-[0.1em] uppercase mt-1">luxury brands</div>
          </div>
        </div>
      </div>

      {/* Right column — AR Viewfinder */}
      <div className="relative aspect-[4/3]">
        <div className="absolute -inset-5 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#1A1410] border border-[#C9A24B]/20">
          {/* Ensure you place hero-ring.png in your public folder! */}
          <Image
            src="/hero-ring.png"
            alt="18k gold diamond ring virtual try-on preview"
            fill
            className="object-cover object-center"
            priority
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-[#15120E]/15 via-transparent to-[#15120E]/40 pointer-events-none" />

          {/* Inline style for the custom scanline animation to avoid Tailwind config edits right now */}
          <div style={{
              position: "absolute", left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg, transparent 0%, rgba(201,162,75,0.7) 50%, transparent 100%)",
              animation: "scanLine 3.5s ease-in-out infinite",
              pointerEvents: "none",
            }} 
          />

          {/* Floating metadata label */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#15120E]/85 backdrop-blur-md border border-[#C9A24B]/30 rounded-md px-4 py-2 flex items-center gap-2.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#C9A24B] shadow-[0_0_6px_rgba(201,162,75,0.8)]" />
            <span className="font-mono text-[11px] text-[#C9A24B] tracking-[0.06em]">
              Ring · 18k Gold · Try-on confidence 98%
            </span>
          </div>

          {/* Top label */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2">
            <span className="font-mono text-[10px] text-[#C9A24B]/70 tracking-[0.12em] uppercase">
              ● LIVE RENDER
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  )
}