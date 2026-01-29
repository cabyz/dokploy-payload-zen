import './globals.css'
import { GeistSans } from 'geist/font/sans'

export const metadata = {
    title: 'WLF Platform',
    description: 'Wolf Business Platform - Powered by Payload CMS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={GeistSans.className}>
            <body className="antialiased">{children}</body>
        </html>
    )
}
