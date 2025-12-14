'use client'

import { PaginationInfo, usePagination } from '@/hooks/usePagination'
import { jobCategoryService } from '@/services/job-category.service'
import { JobFamily } from '@/types/job-category.type'
import { useQuery } from '@tanstack/react-query'

interface UseJobCategoryQueryReturn {
   categories: JobFamily[]
   pagination: PaginationInfo
   isLoading: boolean
   isError: boolean
}

export const useJobCategoryQuery = (
   page: number = 0,
   size: number = 10
): UseJobCategoryQueryReturn => {
   const { data, isLoading, isError } = useQuery({
      queryKey: ['job-categories', page, size],
      queryFn: () => jobCategoryService.getAllCategories(page, size)
   })

   const pagination = usePagination(data, page)

   return {
      categories: data?.content || [],
      pagination,
      isLoading,
      isError
   }
}
