'use client'

import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import HelperSidebar from '@/components/layouts/HelperSidebar'
import Init from '@/components/layouts/Init'
import QueryProvider from '@/lib/query-client'
import { AuthProvider } from '@/store/AuthContext'
import { Toaster } from 'react-hot-toast'

export default function MainLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <QueryProvider>
         <AuthProvider>
            <Init />
            <Header />
            {children}
            <div className='fixed right-3 bottom-15 z-50'>
               <HelperSidebar />
            </div>
            <Footer />

            {/* Toast Configuration */}
            <Toaster
               position='top-center'
               reverseOrder={false}
               gutter={8}
               toastOptions={{
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
                  success: {
                     duration: 4000,
                     iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff'
                     }
                  },
                  error: {
                     duration: 5000,
                     iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff'
                     }
                  },
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
   )
}
