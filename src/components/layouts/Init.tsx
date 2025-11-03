'use client'

import { useAuth } from '@/hooks/useAuth'
import candidateService from '@/services/candidate.service'
import { TokenPayload } from '@/types/auth.type'
import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

export default function Init() {
   const { isLogin, isLoading } = useAuth()
   const [isCandidate, setIsCandidate] = useState(false)

   // Check user role from token
   useEffect(() => {
      if (!isLogin || isLoading) {
         setIsCandidate(false)
         return
      }

      try {
         const accessToken = localStorage.getItem('accessToken')
         if (!accessToken) {
            setIsCandidate(false)
            return
         }

         const decoded = jwtDecode<TokenPayload>(accessToken)
         setIsCandidate(decoded.role === 'CANDIDATE')
      } catch (error) {
         setIsCandidate(false)
      }
   }, [isLogin, isLoading])

   // Fetch saved jobs only for candidates
   useQuery({
      queryKey: ['savedJobs'],
      queryFn: () => candidateService.getSavedJobs(),
      enabled: isCandidate && isLogin && !isLoading,
      staleTime: Infinity,
      gcTime: Infinity,
      retry: false
   })

   return <></>
}
