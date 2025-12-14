'use client'

import { jobService } from '@/services/job.service'
import { useQuery } from '@tanstack/react-query'

export const useRecommendQuery = () => {
   const { data, isLoading, isError } = useQuery({
      queryKey: ['recommended-jobs'],
      queryFn: () => jobService.getRecommendedJobs()
   })

   return {
      recommendedJobs: data || [],
      isLoading,
      isError
   }
}
