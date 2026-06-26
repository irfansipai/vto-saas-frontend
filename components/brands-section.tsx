// frontend/components/brands-section.tsx
export function BrandsSection() {
  return (
    <section className="border-y border-[#C9A24B]/10 py-8 bg-[#211B15]/50">
      <div className="max-w-7xl mx-auto px-10 flex flex-wrap justify-center items-center gap-14">
        <span className="font-mono text-[11px] text-[#B8A99A] tracking-[0.1em] opacity-50">
          TRUSTED BY BRANDS AT
        </span>
        {["CARTIER-TIER", "TIFFANY-TIER", "BVLGARI-TIER", "VAN CLEEF & ARPELS-TIER"].map(brand => (
          <span key={brand} className="font-mono text-[12px] text-[#B8A99A] tracking-[0.15em] opacity-40 font-medium">
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}