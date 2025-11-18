'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLogStore } from '@/hooks/useTracker'
import { searchService } from '@/services/search.service'
import type { PaginationResponse } from '@/types/api.type.'
import type { JobSearchRequest, JobSearchResult } from '@/types/job.type'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const LIMIT = 10

export const useSearchJobs = (enabled: boolean = true) => {
   const [offset, setOffset] = useState(0)
   const { isLogin } = useAuth()
   const searchParams = useSearchParams()

   // Get init bucket 'search' function from store
   const { initBucket /*, startAutoFlush*/ } = useLogStore()

   // Extract query from URL params (changed from 'key_word' to 'query')
   const query = searchParams.get('query')?.trim() ?? ''

   // Build filters object from URL params
   const filters = useMemo(() => {
      const filterObj: Record<string, unknown> = {
         status: 'PUBLISHED' // Default status
      }

      // Optional filter parameters
      const company = searchParams.get('company')
      if (company) filterObj.company = company

      const jobRole = searchParams.get('jobRole')
      if (jobRole) filterObj.jobRole = jobRole

      const seniority = searchParams.get('seniority')
      if (seniority) filterObj.seniority = seniority

      const workMode = searchParams.get('workMode')
      if (workMode) filterObj.workMode = workMode

      const currency = searchParams.get('currency')
      if (currency && currency !== 'all') filterObj.currency = currency

      const location = searchParams.get('location')
      if (location) filterObj.location = location

      const salaryMin = searchParams.get('salary_min')
      if (salaryMin) filterObj.salaryMin = Number(salaryMin)

      const salaryMax = searchParams.get('salary_max')
      if (salaryMax) filterObj.salaryMax = Number(salaryMax)

      const datePosted = searchParams.get('datePosted')
      if (datePosted) filterObj.datePosted = datePosted

      return filterObj
   }, [searchParams])

   // Reset page when query or filters change
   useEffect(() => {
      setOffset(0)
   }, [query, filters])

   // Build request payload
   const payload: JobSearchRequest = useMemo(
      () => ({
         query,
         limit: LIMIT,
         offset,
         filters
      }),
      [query, offset, filters]
   )

   const queryEnabled = enabled && query !== ''

   const { isLoading, data, error } = useQuery({
      queryKey: ['searchJobs', payload],
      queryFn: () => searchService.searchJobs(payload),
      enabled: queryEnabled,
      staleTime: 5 * 60 * 1000
   })

   // Calculate results before using in effect
   const paginationData = useMemo(
      () => (data?.data as unknown as PaginationResponse<JobSearchResult[]>) || undefined,
      [data?.data]
   )

   const results = useMemo(() => paginationData?.content ?? [], [paginationData])
   const isNext = paginationData?.hasNext ?? false
   const isPrev = paginationData?.hasPrevious ?? false

   // When there are results & user is logged in -> initialize 'search' bucket with query metadata
   useEffect(() => {
      if (!isLogin) return
      if (results.length === 0) return
      if (!query) return

      // initBucket('search', jobIds, { query })
      console.log(
         'Initializing search bucket with results:',
         results.map((j) => j.id)
      )
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
