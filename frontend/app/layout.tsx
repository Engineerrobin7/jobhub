import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobHub - Find Your Dream Job',
  description: 'Modern job board platform built with Next.js, TypeScript, and Tailwind CSS. Features OAuth authentication, job browsing, applications, and real-time profile management.',
  keywords: ['job board', 'careers', 'employment', 'nextjs', 'typescript', 'tailwindcss', 'react'],
  authors: [{ name: 'JobHub Team' }],
  creator: 'JobHub Team',
  publisher: 'JobHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://github.com/Engineerrobin7/jobhub'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'JobHub - Modern Job Board Platform',
    description: 'A full-stack job board application built with Next.js, TypeScript, and Tailwind CSS. Features OAuth authentication, job browsing, applications, and real-time profile management.',
    url: 'https://github.com/Engineerrobin7/jobhub',
    siteName: 'JobHub',
    images: [
      {
        url: '/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'JobHub - Modern Job Board Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobHub - Modern Job Board Platform',
    description: 'A full-stack job board application built with Next.js, TypeScript, and Tailwind CSS.',
    images: ['/social-preview.png'],
    creator: '@jobhub',
    site: '@jobhub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
