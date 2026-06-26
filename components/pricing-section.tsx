// frontend/components/pricing-section.tsx
import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'STARTER',
    price: 299,
    features: ['500 SKUs', '10,000 try-ons / mo', 'Standard support', 'Dashboard & analytics'],
    cta: 'Start free trial',
    popular: false,
  },
  {
    name: 'GROWTH',
    price: 799,
    features: ['5,000 SKUs', '100,000 try-ons / mo', 'Priority support', 'Advanced analytics', 'Custom domain allowlist'],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'ENTERPRISE',
    price: null,
    features: ['Unlimited SKUs', 'Unlimited try-ons', 'Dedicated account manager', 'SLA guarantee', 'Custom integration support'],
    cta: 'Contact sales',
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-[#211B15] py-32 border-t border-[#C9A24B]/10">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-20">
          <div className="font-mono text-[11px] tracking-[0.15em] text-[#C9A24B] uppercase mb-4">PRICING</div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#F3EEE3]">
            Transparent plans that scale
          </h2>
          <p className="text-[#B8A99A] text-[17px] mt-4">Start with a 14-day free trial. No credit card required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg p-10 transition-all ${
                plan.popular
                  ? 'bg-[#4A1620] border border-[#E8C97A]/30 shadow-[0_0_48px_rgba(74,22,32,0.6),0_0_96px_rgba(201,162,75,0.1)] -translate-y-2'
                  : 'bg-[#1A1410] border border-[#C9A24B]/15'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 bg-[#C9A24B] text-[#15120E] text-[10px] font-mono tracking-[0.12em] px-3.5 py-1 rounded-b-md font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className={`font-mono text-[11px] tracking-[0.12em] uppercase mb-5 ${plan.popular ? 'text-[#E8C97A]' : 'text-[#B8A99A]'}`}>
                {plan.name}
              </div>
              
              <div className="mb-7">
                {plan.price !== null ? (
                  <>
                    <span className="font-serif text-5xl font-medium text-[#F3EEE3] tracking-tight">${plan.price}</span>
                    <span className={`text-[15px] ${plan.popular ? 'text-[#E8C97A]/80' : 'text-[#B8A99A]'}`}> / month</span>
                  </>
                ) : (
                  <span className="font-serif text-5xl font-medium text-[#F3EEE3] tracking-tight">Custom</span>
                )}
              </div>

              <ul className="flex flex-col gap-3 mb-9">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-3 text-[14px] ${plan.popular ? 'text-[#F3EEE3]/90' : 'text-[#B8A99A]'}`}>
                    <Check size={16} className={plan.popular ? 'text-[#E8C97A]' : 'text-[#C9A24B]'} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block text-center rounded-md font-semibold text-[14px] py-3 transition-all ${
                  plan.popular
                    ? 'bg-[#C9A24B] text-[#15120E] hover:opacity-90'
                    : 'border border-[#C9A24B]/35 text-[#C9A24B] hover:bg-[#C9A24B]/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}