import type { Metadata } from 'next'
import './globals.css'
import { Albert_Sans, Noto_Sans_SC } from 'next/font/google'
import { ReactNode } from 'react'
import NextTopLoader from 'nextjs-toploader'


const albertSans = Albert_Sans({
    subsets: [ 'latin' ],
    variable: '--font-albert-sans'
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
        <html lang="en">
        <body
            className={`${albertSans.variable} ${notoSans.variable} antialiased`}
        >
        <NextTopLoader showSpinner={false} color="#3b82f6"/>
        {children}
        </body>
        </html>
    )
}
