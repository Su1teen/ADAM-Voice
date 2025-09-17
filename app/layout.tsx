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
  title: 'Pulse - Voice AI Assistant',
  description: 'Modern voice interactions with AI using ElevenLabs conversational AI technology.',
}

const btoa = (str: string) => Buffer.from(str).toString('base64')
const images = `https://neon.tech/docs/og?title=${btoa('Pulse')}&breadcrumb=${btoa(config.title)}`

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
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
        <Toaster />
        {children}
      </body>
    </html>
  )
}
