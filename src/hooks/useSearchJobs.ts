'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLogStore } from '@/hooks/useTracker'
import { searchService } from '@/services/search.service'
import type { PaginationResponse } from '@/types/api.type.'
import type { JobSearchRequest, JobSearchResult } from '@/types/job.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

const LIMIT = 10

export const useSearchJobs = (
   initialPayload: Omit<JobSearchRequest, 'offset' | 'limit'>,
   enabled: boolean = true
) => {
   const [offset, setOffset] = useState(0)
   const { isLogin } = useAuth()

   // Get init bucket 'search' function from store
   const { initBucket /*, startAutoFlush*/ } = useLogStore()

   // Get query (if any) and normalize it
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const query = (initialPayload as any)?.query?.toString().trim() ?? ''

   // Reset page when query changes
   useEffect(() => {
      setOffset(0)
   }, [query])

   // Stabilize weights & payload
   const weights = useMemo(() => ({ dense: 1, sparse: 1 }), [])
   const payload: JobSearchRequest = useMemo(
      () => ({ ...initialPayload, offset, limit: LIMIT, weights }),
      [initialPayload, offset, weights]
   )

   const queryEnabled = enabled && query !== ''

   const { isLoading, data, error } = useQuery({
      queryKey: ['searchJobs', payload],
      queryFn: () => searchService.searchJobs(),
      enabled: queryEnabled,
      staleTime: 5 * 60 * 1000
   })

   // Calculate results before using in effect
   const paginationData =
      (data?.data as unknown as PaginationResponse<JobSearchResult[]>) || undefined
   const results = paginationData?.content ?? []
   const isNext = paginationData?.hasNext ?? false
   const isPrev = paginationData?.hasPrevious ?? false

   // When there are results & user is logged in -> initialize 'search' bucket with query metadata
   useEffect(() => {
      if (!isLogin) return
      if (results.length === 0) return
      if (!query) return

      // initBucket('search', jobIds, { query })
      console.log('Initializing search bucket with results:', results.map((j) => j.id))
      initBucket(
         'search',
         results.map((j) => j.id),
         { query }
      )
      // If you want auto flush: startAutoFlush()
   }, [isLogin, results, query, initBucket])

   const handleNextPage = () => {
      if (isNext) {
         setOffset((prev) => prev + LIMIT)
         window.scrollTo({ top: 0, behavior: 'smooth' })
      }
   }

   const handlePreviousPage = () => {
      if (isPrev) {
         setOffset((prev) => Math.max(0, prev - LIMIT))
         window.scrollTo({ top: 0, behavior: 'smooth' })
      }
   }

   const resetPagination = () => setOffset(0)

   return {
      isLoading,
      results,
      error,
      hasNextPage: isNext,
      hasPreviousPage: isPrev,
      currentOffset: offset,
      totalResults: paginationData?.totalElements || 0,
      totalPages: paginationData?.totalPages || 0,
      currentPage: Math.floor(offset / LIMIT) + 1,
      handleNextPage,
      handlePreviousPage,
      resetPagination
   }
}
