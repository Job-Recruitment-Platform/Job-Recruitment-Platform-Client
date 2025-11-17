'use client'

import '@/styles/admin.css'
import AdminAuthGuard from '@/components/features/admin/AuthGuardComponent'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

export default function AdminLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <QueryClientProvider client={queryClient}>
         <AdminAuthGuard>{children}</AdminAuthGuard>
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
      </QueryClientProvider>
   )
}
