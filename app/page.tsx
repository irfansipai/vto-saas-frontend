// frontend/app/page.tsx
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { BrandsSection } from '@/components/brands-section'
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function Page() {
  return (
    <main className="min-h-screen bg-[#15120E] text-[#F3EEE3] font-sans selection:bg-[#C9A24B] selection:text-[#15120E]">
      <Navbar />
      <HeroSection />
      <BrandsSection />
      <DemoSection />
      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto py-32 px-10">
        <div className="text-center mb-20">
          <div className="font-mono text-[11px] tracking-[0.15em] text-[#C9A24B] uppercase mb-4">HOW IT WORKS</div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight leading-tight">
            Three steps to live try-on
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {[
            { n: "01", title: "Upload your catalog", body: "Add jewelry SKUs via dashboard or API. We accept reference images — no 3D models required." },
            { n: "02", title: "Embed one script tag", body: "A single line of code activates try-on across your entire storefront, on every device." },
            { n: "03", title: "Watch conversion climb", body: "Customers try on, gain confidence, and convert at measurably higher rates. Monitor every event in your dashboard." },
          ].map((step) => (
            <div key={step.n} className="p-12 border-t border-[#C9A24B]/30 relative">
              <div className="font-mono text-[11px] text-[#C9A24B] tracking-[0.15em] mb-6 opacity-80">{step.n}</div>
              <h3 className="font-serif text-2xl font-medium mb-3 text-[#F3EEE3]">{step.title}</h3>
              <p className="text-[#B8A99A] text-[15px] leading-relaxed max-w-[280px]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <FeaturesSection />
      <PricingSection />

      {/* CTA BANNER  */}
      <section className="py-32 px-10 text-center border-t border-[#C9A24B]/10">
        <div className="max-w-2xl mx-auto">
          <div className="font-mono text-[11px] tracking-[0.15em] text-[#C9A24B] uppercase mb-6">READY TO START</div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-6">
            Your customers deserve to <em className="italic text-[#E8C97A]">feel</em> the piece before they buy it.
          </h2>
          <p className="text-[#B8A99A] text-lg leading-relaxed mb-10">
            Join 500+ luxury brands deploying Lumina. Setup takes under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-[#C9A24B] text-[#15120E] px-8 py-4 rounded-md font-bold text-[15px] transition-opacity hover:opacity-90">
              Start your free trial
            </Link>
            <Link href="#" className="border border-[#C9A24B]/30 text-[#C9A24B] px-8 py-4 rounded-md font-semibold text-[15px] transition-colors hover:bg-[#C9A24B]/10">
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}