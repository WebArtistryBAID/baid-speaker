import type { Metadata } from 'next'
import './globals.css'
import { Outfit } from 'next/font/google'
import { ReactNode } from 'react'
import NextTopLoader from 'nextjs-toploader'
import { ThemeModeScript } from 'flowbite-react'


const outfit = Outfit({
    subsets: [ 'latin' ],
    variable: '--font-outfit'
})

export const metadata: Metadata = {
    title: 'BAID Speaker',
    description: 'An integrated service for BAID Speaker'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <ThemeModeScript mode="auto"/>
        </head>
        <body
            className={`${outfit.variable} antialiased`}
        >
        <NextTopLoader showSpinner={false} color="#3b82f6"/>
        {children}
        <p className="fixed bottom-2 right-2 secondary text-xs"><a
            href="https://beian.miit.gov.cn">{process.env.BOTTOM_TEXT}</a></p>
        </body>
        </html>
    )
}
