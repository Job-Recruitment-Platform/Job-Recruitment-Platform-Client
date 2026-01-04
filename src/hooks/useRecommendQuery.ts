'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLogStore } from '@/hooks/useTracker'
import { jobService } from '@/services/job.service'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

export const useRecommendQuery = () => {
   const { isLogin } = useAuth()
   const { initBucket } = useLogStore()

   const { data, isLoading, isError } = useQuery({
      queryKey: ['recommended-jobs'],
      queryFn: () => jobService.getRecommendedJobs()
   })

   const recommendedJobs = useMemo(() => data || [], [data])

   // Initialize 'recommended' bucket when there are results & user is logged in
   useEffect(() => {
      if (!isLogin) return
      if (recommendedJobs.length === 0) return

      console.log(
         'Initializing recommended bucket with results:',
         recommendedJobs.map((j) => j.id)
      )
      initBucket(
         'recommended',
         recommendedJobs.map((j) => j.id)
      )
   }, [isLogin, recommendedJobs, initBucket])

   return {
      recommendedJobs,
      isLoading,
      isError
   }
}
