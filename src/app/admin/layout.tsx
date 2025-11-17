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
         <Toaster position='top-right' />
      </QueryClientProvider>
   )
}
