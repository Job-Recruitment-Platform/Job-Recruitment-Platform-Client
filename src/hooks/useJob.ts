import { jobService } from '@/services/job.service'
import type { JobDetail } from '@/types/job.type'
import { useQuery } from '@tanstack/react-query'

export type UseJobState = {
   data: JobDetail | undefined
   isLoading: boolean
   isFetching: boolean
   isError: boolean
   isPending: boolean
   error: Error | null
   status: 'pending' | 'error' | 'success'
}

/**
 * Custom hook to fetch job detail using TanStack Query V5
 * Handles API calls, caching, loading, error states automatically
 *
 * @param jobId - Job ID to fetch
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query state with job data, loading states, and error information
 */
export const useJob = (jobId: number | null, enabled: boolean = true): UseJobState => {
   const query = useQuery({
      queryKey: ['jobDetail', jobId],
      queryFn: async () => {
         if (!jobId) {
            throw new Error('Job ID is required')
         }
         const result = await jobService.getJobDetail(jobId)
         if (!result) {
            throw new Error('Job not found')
         }
         return result
      },
      enabled: enabled && !!jobId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 20 * 60 * 1000, // 20 minutes (previously cacheTime)
      retry: 2, // Retry failed requests 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000) // Exponential backoff
   })

   return {
      data: query.data,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      isPending: query.isPending,
      error: query.error,
      status: query.status
   }
}

/**
 * Custom hook to fetch multiple jobs by IDs
 */
export const useJobs = (jobIds: number[] | null, enabled: boolean = true) => {
   return useQuery({
      queryKey: ['jobDetails', jobIds],
      queryFn: async () => {
         if (!jobIds || jobIds.length === 0) {
            return []
         }
         return await jobService.getJobsByIds(jobIds)
      },
      enabled: enabled && !!jobIds && jobIds.length > 0,
      staleTime: 10 * 60 * 1000,
      gcTime: 20 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
   })
}
