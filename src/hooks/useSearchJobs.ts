import { searchService } from '@/services/search.service'
import type { JobSearchRequest, JobSearchResponse } from '@/types/job.type'
import { useQuery } from '@tanstack/react-query'

export type UseSearchJobsState = {
   data: JobSearchResponse | undefined
   isLoading: boolean
   isFetching: boolean
   isError: boolean
   isPending: boolean
   error: Error | null
   status: 'pending' | 'error' | 'success'
}

/**
 * Custom hook to search jobs using TanStack Query V5
 * Handles API calls, caching, loading, error states automatically
 *
 * @param params - Job search parameters (query, limit, offset)
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query state with data, loading states, and error information
 */
export const useSearchJobs = (
   params: JobSearchRequest,
   enabled: boolean = true
): UseSearchJobsState => {
   const query = useQuery({
      queryKey: ['searchJobs', params.query, params.limit, params.offset],
      queryFn: async () => {
         const result = await searchService.searchJobs(params)
         // Ensure we always return a defined value
         if (!result) {
            return { results: [], total: 0 }
         }
         return result
      },
      enabled: enabled && !!params.query?.trim(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
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
