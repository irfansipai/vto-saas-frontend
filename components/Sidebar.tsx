// frontend/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Overview" },
  { href: "/dashboard/assets", icon: "diamond", label: "Assets" },
  { href: "/dashboard/api-keys", icon: "key", label: "API Keys" },
  { href: "/dashboard/analytics", icon: "bar_chart", label: "Usage" },
  { href: "/dashboard/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = user?.full_name ? user.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U";
  const displayName = user?.full_name || "Admin";

  return (
    <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#1A1410] border-r border-gold/15 z-50">
    {/* Logo */}
    <div className="p-6 pb-5 border-b border-gold/10">
      <Link href="/" className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 border border-gold/40 rounded-md flex items-center justify-center bg-gold/10">
          <span className="material-symbols-outlined text-[18px] text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
        </div>
        <div>
          <div className="font-fraunces text-[17px] font-medium text-ivory leading-tight">Lumina</div>
          <div className="font-ibm-plex text-[10px] text-sand tracking-[0.06em] opacity-70">DASHBOARD</div>
        </div>
      </Link>
    </div>
      {/* New Asset CTA */}
      <div className="p-4 pb-2">
        <Link href="/dashboard/assets/new" className="flex items-center justify-center gap-2 bg-gold text-ink py-2.5 rounded-md no-underline font-inter font-bold text-[13px] hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Asset
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-md no-underline font-inter text-[14px] transition-all border-l-2 ${isActive ? 'bg-gold/10 text-gold border-gold font-semibold' : 'bg-transparent text-sand border-transparent hover:bg-gold/5'}`}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: isActive ? "#C9A24B" : "#7A6A5A", fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
              {label}
            </Link>
          );
        })}

        <div className="border-t border-gold/10 mt-2 pt-2">
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md no-underline text-[#7A6A5A] font-inter text-[14px] border-l-2 border-transparent hover:text-sand hover:bg-gold/5 transition-all">
            <span className="material-symbols-outlined text-[18px] text-[#7A6A5A]">menu_book</span>
            Documentation
          </Link>
        </div>
      </div>

      {/* User row */}
      <div className="border-t border-gold/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
              <span className="font-ibm-plex text-[12px] text-gold font-semibold">{initials}</span>
            </div>
            <div>
              <div className="font-inter text-[13px] font-semibold text-ivory max-w-[100px] truncate">{displayName}</div>
              <div className="font-ibm-plex text-[10px] text-[#7A6A5A] tracking-[0.04em]">OWNER</div>
            </div>
          </div>
          <button onClick={handleLogout} title="Log out" className="bg-transparent border-none cursor-pointer p-1 text-[#7A6A5A] flex hover:text-[#FF6B6B] transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}