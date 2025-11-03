'use client'

import { searchService } from '@/services/search.service'
import type { PaginationResponse } from '@/types/api.type.'
import type { JobSearchRequest, JobSearchResult } from '@/types/job.type'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

/**
 * Hook to search for jobs using TanStack Query with pagination support
 * @param initialPayload - Initial search request payload (with query keyword)
 * @param enabled - Whether the query should run (default: true)
 * @returns Object containing isLoading state, results, and pagination controls
 */
export const useSearchJobs = (
   initialPayload: Omit<JobSearchRequest, 'offset' | 'limit'>,
   enabled: boolean = true
) => {
   const [offset, setOffset] = useState(0)
   const LIMIT = 10

   const payload: JobSearchRequest = {
      ...initialPayload,
      offset,
      limit: LIMIT,
      weights: {
         dense: 1,
         sparse: 1
      }
   }

   const { isLoading, data, error } = useQuery({
      queryKey: ['searchJobs', payload],
      queryFn: () => searchService.searchJobs(payload),
      enabled: enabled && initialPayload.query !== '',
      staleTime: 1000 * 60 * 5 // 5 minutes
   })

   const paginationData = data?.data as PaginationResponse<JobSearchResult[]> | undefined
   const results = paginationData?.content || []
   const isNext = paginationData?.hasNext || false
   const isPrev = paginationData?.hasPrevious || false

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

   const resetPagination = () => {
      setOffset(0)
   }

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
