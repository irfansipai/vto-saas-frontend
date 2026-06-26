// frontend/app/layout.tsx
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google'
import { AuthProvider } from "@/context/AuthContext"
import './globals.css'

const fraunces = Fraunces({ 
  subsets: ['latin'], 
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({ 
  weight: ['400', '500'],
  subsets: ['latin'], 
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Lumina · AI Virtual Try-On for Luxury Jewelry",
  description: "Let customers try every piece before they buy. Enterprise-grade AR virtual try-on for luxury jewelry brands — one script tag, live in your store.",
  keywords: "virtual try-on, jewelry, AR, luxury, AI, e-commerce",
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#15120E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Material Symbols for specific icons */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#15120E] text-[#F3EEE3] selection:bg-[#C9A24B]/20">
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}