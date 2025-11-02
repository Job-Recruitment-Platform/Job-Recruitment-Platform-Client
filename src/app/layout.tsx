import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import HelperSidebar from '@/components/layouts/HelperSidebar'
import Init from '@/components/layouts/Init'
import QueryProvider from '@/lib/query-client'
import { AuthProvider } from '@/store/AuthContext'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

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
   // icons: {
   //    icon: ComponentIcon,
   //    shortcut: ComponentIcon,
   //    apple: ComponentIcon
   // }
}

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang='en'>
         <body className={`${geistSans.variable} ${geistMono.variable} bg-smoke antialiased`}>
            <QueryProvider>
               <AuthProvider>
                  <Init />
                  <Header />
                  {children}
                  <div className='fixed right-3 bottom-15 z-50'>
                     <HelperSidebar />
                  </div>
                  <Footer />

                  {/* Toast Configuration - Anti-spam via Map-based tracking system */}
                  <Toaster
                     position='top-center'
                     reverseOrder={false}
                     gutter={8}
                     toastOptions={{
                        // Default options
                        duration: 4000,
                        style: {
                           background: '#fff',
                           color: '#000',
                           padding: '16px',
                           borderRadius: '8px',
                           fontSize: '14px',
                           fontWeight: '500',
                           maxWidth: '500px'
                        },
                        // Success
                        success: {
                           duration: 4000,
                           iconTheme: {
                              primary: '#10b981',
                              secondary: '#fff'
                           }
                        },
                        // Error
                        error: {
                           duration: 5000,
                           iconTheme: {
                              primary: '#ef4444',
                              secondary: '#fff'
                           }
                        },
                        // Loading
                        loading: {
                           iconTheme: {
                              primary: '#3b82f6',
                              secondary: '#fff'
                           }
                        }
                     }}
                  />
               </AuthProvider>
            </QueryProvider>
         </body>
      </html>
   )
}
