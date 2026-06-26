// frontend/components/features-section.tsx
const features = [
  { icon: "trending_up", title: "Boost online sales", body: "Customers are 3× more likely to purchase when they can visualize the piece on themselves." },
  { icon: "assignment_return", title: "Reduce returns", body: "Set accurate expectations for size and fit. Dramatically lower return rates from the first week." },
  { icon: "verified_user", title: "Build confidence", body: "Allow shoppers to experiment with different styles risk-free. Confidence translates directly to revenue." },
  { icon: "smartphone", title: "No app required", body: "Works instantly in any mobile browser via WebGL. Zero friction for your customers." },
  { icon: "integration_instructions", title: "One-line integration", body: "Copy and paste a single script tag. Works with Shopify, Magento, BigCommerce, or any custom storefront." },
  { icon: "collections", title: "Unlimited scale", body: "Our AI processes thousands of SKUs overnight. Launch your full catalog, not a curated sample." },
]

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-10 pb-32 pt-10">
      <div className="mb-20">
        <div className="font-mono text-[11px] tracking-[0.15em] text-[#C9A24B] uppercase mb-4">BUILT FOR ENTERPRISE</div>
        <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight leading-tight max-w-[560px]">
          Precision engineered for conversion
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#C9A24B]/10">
        {features.map((feat) => (
          <div key={feat.title} className="bg-[#15120E] p-10 border-t border-[#C9A24B]/25 hover:bg-[#1A1410] transition-colors">
            <span className="material-symbols-outlined text-[28px] text-[#C9A24B] block mb-5">{feat.icon}</span>
            <h3 className="font-serif text-xl font-medium mb-2.5 text-[#F3EEE3]">{feat.title}</h3>
            <p className="text-[#B8A99A] text-[14px] leading-[1.7]">{feat.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}