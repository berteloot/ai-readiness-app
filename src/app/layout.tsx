import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Readiness Assessment | Lean Solutions Group',
  description: 'Assess your organization\'s AI readiness with our comprehensive evaluation tool. Get a personalized report with actionable insights and a roadmap for success.',
  keywords: 'AI readiness, artificial intelligence, digital transformation, assessment, evaluation, Lean Solutions Group',
  authors: [{ name: 'Lean Solutions Group' }],
  creator: 'Lean Solutions Group',
  publisher: 'Lean Solutions Group',
  robots: 'index, follow',
  openGraph: {
    title: 'AI Readiness Assessment | Lean Solutions Group',
    description: 'Assess your organization\'s AI readiness with our comprehensive evaluation tool.',
    url: 'https://www.leangroup.com/ai-readiness',
    siteName: 'Lean Solutions Group',
    images: [
      {
        url: 'https://www.leangroup.com/opengraph.png',
        width: 1200,
        height: 630,
        alt: 'AI Readiness Assessment Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Assessment | Lean Solutions Group',
    description: 'Assess your organization\'s AI readiness with our comprehensive evaluation tool.',
    images: ['https://www.leangroup.com/opengraph.png'],
    creator: '@LeanGroup',
  },
  themeColor: '#1f58ad',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
