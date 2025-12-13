import { PaginationResponse } from '@/types/api.type.'
import { useMemo } from 'react'

export interface PaginationInfo {
   isNext: boolean
   isPrevious: boolean
   totalPages: number
   currentPage: number
   totalElements: number
   first: boolean
   last: boolean
}

export const usePagination = <T>(
   data: PaginationResponse<T> | undefined,
   currentPage: number
): PaginationInfo => {
   return useMemo(() => {
      if (!data) {
         return {
            isNext: false,
            isPrevious: false,
            totalPages: 0,
            currentPage,
            totalElements: 0,
            first: true,
            last: true
         }
      }

      return {
         isNext: data.hasNext,
         isPrevious: data.hasPrevious,
         totalPages: data.totalPages,
         currentPage: data.page,
         totalElements: data.totalElements,
         first: data.first,
         last: data.last
      }
   }, [data, currentPage])
}
