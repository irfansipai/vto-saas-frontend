// frontend/components/navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsDropdownOpen(false)
    router.push('/login')
  }

  const getInitials = () => {
    if (!user) return ""
    if (user.full_name) return user.full_name.charAt(0).toUpperCase()
    return user.email.charAt(0).toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gold/15 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 font-fraunces font-medium text-ivory text-xl tracking-tight">
            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
            Lumina
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-inter text-sand hover:text-ivory transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-inter text-sand hover:text-ivory transition-colors">Pricing</Link>
            <Link href="#" className="text-sm font-inter text-sand hover:text-ivory transition-colors">Docs</Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gold/10 transition-colors border border-transparent hover:border-gold/20"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-ibm-plex font-bold text-xs">
                    {getInitials()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1A1410] rounded-lg border border-gold/20 shadow-xl py-2 z-50">
                    <Link href="/dashboard" className="px-4 py-2.5 text-sm text-ivory hover:bg-gold/10 flex items-center gap-3 transition-colors font-inter">
                      <span className="material-symbols-outlined text-[18px] text-gold">dashboard</span>
                      Merchant Dashboard
                    </Link>
                    <Link href="/dashboard/api-keys" className="px-4 py-2.5 text-sm text-ivory hover:bg-gold/10 flex items-center gap-3 transition-colors font-inter">
                      <span className="material-symbols-outlined text-[18px] text-gold">key</span>
                      Manage API Keys
                    </Link>
                    <hr className="my-2 border-gold/10" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 flex items-center gap-3 transition-colors font-inter text-left"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sand hover:text-ivory text-sm font-inter font-medium px-4">
                  Log in
                </Link>
                <Link href="/signup" className="bg-gold text-ink hover:opacity-90 transition-opacity font-bold font-inter text-sm px-5 py-2 rounded-md">
                  Start free trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-sand hover:text-gold"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 border-t border-gold/10 pt-4">
            <Link href="#features" className="block text-sm text-sand hover:text-gold font-inter">Features</Link>
            <Link href="#pricing" className="block text-sm text-sand hover:text-gold font-inter">Pricing</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-gold/10">
              {!loading && user ? (
                <>
                  <Link href="/dashboard" className="text-ivory bg-gold/10 px-4 py-2 rounded-md text-sm font-inter font-medium text-center border border-gold/20">
                    Go to Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-[#FF6B6B] px-4 py-2 rounded-md text-sm font-inter font-medium text-center">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-ivory bg-[#1A1410] border border-gold/20 px-4 py-2 rounded-md text-sm font-inter font-medium text-center">
                    Log in
                  </Link>
                  <Link href="/signup" className="bg-gold text-ink font-bold font-inter text-sm px-4 py-2 rounded-md text-center">
                    Start free trial
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}