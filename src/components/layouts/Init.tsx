'use client'

import candidateService from '@/services/candidate.service'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function Init() {
   const { isLogin, isLoading } = useAuth()

   useEffect(() => {
      // Only fetch saved jobs if user is authenticated and not loading
      if (isLogin && !isLoading) {
         candidateService.getSavedJobs()
      }
   }, [isLogin, isLoading])

   return <></>
}
