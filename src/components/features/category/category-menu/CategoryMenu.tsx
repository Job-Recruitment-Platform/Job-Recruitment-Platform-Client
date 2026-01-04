'use client'

import CategoryItem from '@/components/features/category/category-menu/CategoryItem'
import Pagination from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useJobCategoryQuery } from '@/hooks/useJobCategoryQuery'
import { JobFamily } from '@/types/job-category.type'
import { useState } from 'react'

type CategoryMenuProps = {
   className?: string
   onHoverCategory?: (category: JobFamily | null) => void
}

export default function CategoryMenu({ className, onHoverCategory }: CategoryMenuProps) {
   const [page, setPage] = useState(0)
   const { categories, pagination, isLoading } = useJobCategoryQuery(page, 6)
   const [activeCategory, setActiveCategory] = useState<JobFamily | null>(null)

   const handlePrev = () => {
      if (pagination.isPrevious) {
         setPage((prev) => prev - 1)
      }
   }

   const handleNext = () => {
      if (pagination.isNext) {
         setPage((prev) => prev + 1)
      }
   }

   const handleHover = (category: JobFamily | null) => {
      setActiveCategory(category)
      onHoverCategory?.(category)
   }

   return (
      <div
         className={`flex h-full w-full flex-col rounded-md bg-white pt-2.5 text-black ${className}`}
      >
         <div className='flex flex-1 flex-col justify-start gap-y-4 pt-3.5 pl-5'>
            {isLoading
               ? // Loading skeleton
                 Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className='h-5 w-9/10' />
                 ))
               : categories.map((category) => (
                    <CategoryItem
                       key={category.id}
                       category={category}
                       isActive={activeCategory?.id === category.id}
                       onHover={handleHover}
                    />
                 ))}
         </div>
         {/*  Pagination  */}
         <div className='flex h-[40px] w-full items-center justify-between border-t pr-3 pl-5'>
            <div className='text-sm font-semibold text-gray-400'>
               {pagination.currentPage + 1}/{pagination.totalPages || 1}
            </div>
            <Pagination
               className='!gap-x-2'
               onPrev={handlePrev}
               onNext={handleNext}
               disabledPrev={!pagination.isPrevious}
               disabledNext={!pagination.isNext}
            />
         </div>
      </div>
   )
}
