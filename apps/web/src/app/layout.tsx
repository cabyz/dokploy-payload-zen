import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import './globals.css'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
    title: 'WLF',
    description: 'Wolf Business Platform',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wlf.com.mx'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            className={`${GeistSans.variable} ${GeistMono.variable}`}
            lang="en"
            suppressHydrationWarning
        >
            <head>
                <link href="/favicon.ico" rel="icon" sizes="32x32" />
            </head>
            <body>
                <ThemeProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    )
}
