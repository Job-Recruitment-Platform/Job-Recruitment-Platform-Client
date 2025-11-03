'use client'

import { useAuth } from '@/hooks/useAuth'
import candidateService from '@/services/candidate.service'
import { useQuery } from '@tanstack/react-query'

export default function Init() {
   const { isLogin, isLoading } = useAuth()

   // Fetch saved jobs only once per session when user is logged in
   useQuery({
      queryKey: ['savedJobs'],
      queryFn: () => candidateService.getSavedJobs(),
      enabled: isLogin && !isLoading,
      staleTime: Infinity, // Never refetch automatically
      gcTime: Infinity, // Keep data in cache indefinitely
      retry: false // Don't retry on failure
   })

   return <></>
}
