// frontend/components/footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[#C9A24B]/10 py-12 px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-serif text-lg font-medium text-[#F3EEE3] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A24B] inline-block" />
          Lumina
        </div>
        <div className="flex gap-7">
          {["Privacy", "Terms", "Security", "Contact"].map(link => (
            <Link key={link} href="#" className="text-[#B8A99A] text-[13px] hover:text-[#F3EEE3] transition-colors">
              {link}
            </Link>
          ))}
        </div>
        <div className="font-mono text-[11px] text-[#B8A99A] opacity-50">
          © 2026 Lumina AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}