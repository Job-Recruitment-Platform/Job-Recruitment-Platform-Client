'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Create a client for TanStack Query
const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 1000 * 60 * 5, // 5 minutes
         gcTime: 1000 * 60 * 10, // 10 minutes
         retry: 2,
         refetchOnWindowFocus: false // Disable auto-refetch on window focus
      }
   }
})

type QueryProviderProps = {
   children: ReactNode
}

/**
 * QueryProvider wrapper for TanStack Query V5
 * Must wrap the entire application to enable useQuery and other hooks
 */
export default function QueryProvider({ children }: QueryProviderProps) {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
