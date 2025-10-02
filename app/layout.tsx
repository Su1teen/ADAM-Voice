import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const config = {
  url: 'https://ai-pulse.vercel.app',
  title: 'A.D.A.M. - Advanced Digital Assistant Manager',
  description: 'Professional voice-powered AI assistant for smart home automation and health monitoring with enterprise-grade liquid glass design.',
}

const btoa = (str: string) => Buffer.from(str).toString('base64')
const images = `https://neon.tech/docs/og?title=${btoa('A.D.A.M.')}&breadcrumb=${btoa(config.title)}`

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  openGraph: {
    images,
    url: config.url,
    title: config.title,
    description: config.description,
  },
  twitter: {
    images,
    title: config.title,
    card: 'summary_large_image',
    description: config.description,
  },
}

export default function ({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${interFont.className} antialiased bg-[var(--bg)] text-[var(--fg)]`}>
        {/* SVG Filters for Liquid Glass Effects */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
          <defs>
            <filter id="liquid-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                baseFrequency="0.02 0.03"
                numOctaves="3"
                seed="1"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  values="0.02 0.03;0.03 0.02;0.02 0.03"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="3"
                result="displacement"
              />
              <feGaussianBlur
                in="displacement"
                stdDeviation="0.5"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="final"
              />
            </filter>
            
            <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
        </svg>
        
        <Toaster />
        {children}
      </body>
    </html>
  )
}
