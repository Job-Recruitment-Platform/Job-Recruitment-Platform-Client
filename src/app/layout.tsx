import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin']
})

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin']
})

export const metadata: Metadata = {
   title: 'BotCV',
   description:
      'Automate your recruitment process with BotCV - AI-powered job application management and candidate tracking system.',
   viewport: {
      width: 'device-width',
      initialScale: 1
   }
}

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang='en'>
         <body className={`${geistSans.variable} ${geistMono.variable} bg-smoke antialiased`}>
            {children}
         </body>
      </html>
   )
}
