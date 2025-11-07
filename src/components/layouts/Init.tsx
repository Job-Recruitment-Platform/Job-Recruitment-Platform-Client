'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLogStore } from '@/hooks/useTracker'
import candidateService from '@/services/candidate.service'
import type { TokenPayload } from '@/types/auth.type'
import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

export default function Init() {
   const { isLogin, isLoading } = useAuth()
   const { setLoggedIn, startAutoFlush, stopAutoFlush } = useLogStore()
   const [isCandidate, setIsCandidate] = useState(false)

   useEffect(() => {
      setLoggedIn(isLogin)
      if (isLogin) startAutoFlush()
      else stopAutoFlush()
   }, [isLogin, setLoggedIn, startAutoFlush, stopAutoFlush])

   useEffect(() => {
      if (!isLogin || isLoading) {
         setIsCandidate(false)
         return
      }

      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
         setIsCandidate(false)
         return
      }

      try {
         const decoded = jwtDecode<TokenPayload>(accessToken)
         setIsCandidate(decoded?.role === 'CANDIDATE')
      } catch {
         setIsCandidate(false)
      }
   }, [isLogin, isLoading])

   useQuery({
      queryKey: ['savedJobs'],
      queryFn: () => candidateService.getSavedJobs(),
      enabled: isCandidate && isLogin && !isLoading,
      staleTime: Infinity,
      gcTime: Infinity,
      retry: false
   })

   return null
}
