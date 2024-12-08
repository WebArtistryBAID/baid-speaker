import type { Metadata } from 'next'
import './globals.css'
import { Noto_Sans_SC, Outfit } from 'next/font/google'
import { ReactNode } from 'react'
import NextTopLoader from 'nextjs-toploader'
import { ThemeModeScript } from 'flowbite-react'


const outfit = Outfit({
    subsets: [ 'latin' ],
    variable: '--font-outfit'
})

const notoSans = Noto_Sans_SC({
    subsets: [ 'latin', 'latin-ext' ],
    variable: '--font-noto-sans-sc'
})

export const metadata: Metadata = {
    title: 'BAID Speaker',
    description: 'An integrated service for BAID Speaker'
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <ThemeModeScript mode="auto"/>
        </head>
        <body
            className={`${outfit.variable} ${notoSans.variable} antialiased`}
        >
        <NextTopLoader showSpinner={false} color="#3b82f6"/>
        {children}
        </body>
        </html>
    )
}
