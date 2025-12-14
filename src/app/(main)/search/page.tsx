'use client'

import JobSearchItem from '@/components/features/job/JobSearchItem'
import BoxSearch from '@/components/features/search/BoxSort'
import OptionSearchJob from '@/components/features/search/OptionSearchJob'
import SidebarFilter from '@/components/layouts/FilterSideBar'
import { useSearchJobs } from '@/hooks/useSearchJobs'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function SearchResultsPage() {
   const searchParams = useSearchParams()
   const query = searchParams.get('query') || ''
   const {
      results,
      isLoading,
      hasNextPage,
      hasPreviousPage,
      currentPage,
      handleNextPage,
      handlePreviousPage
   } = useSearchJobs()

   return (
      <div className='bg-smoke w-full'>
         <div className='w-full bg-[#19734e]'>
            <div className='container py-4.5'>
               <OptionSearchJob />
            </div>
         </div>

         <div className='container mt-5 flex gap-x-2 px-2'>
            {/* Sidebar Filters */}
            <SidebarFilter />

            {/* Search Results */}
            <div className='flex-1 space-y-3'>
               <BoxSearch />

               {/* State 1: Loading state */}
               {isLoading && (
                  <div className='py-8 text-center'>
                     <p className='text-gray-600'>Đang tìm kiếm công việc...</p>
                  </div>
               )}

               {/* State 2: No query entered */}
               {!isLoading && query === '' && (
                  <div className='py-8 text-center'>
                     <p className='text-gray-600'>Nhập từ khoá để tìm kiếm</p>
                  </div>
               )}

               {/* State 3: Empty results */}
               {!isLoading && query !== '' && results.length === 0 && (
                  <div className='py-20 text-center'>
                     <p className='text-gray-600'>
                        Không tìm thấy công việc cho từ khoá &quot;{query}&quot;
                     </p>
                  </div>
               )}

               {/* Results with pagination */}
               {results.length > 0 && (
                  <>
                     {/* Job list */}
                     <div className='space-y-3'>
                        {results.map((job) => (
                           <JobSearchItem key={job.id} job={job} query={query} />
                        ))}
                     </div>

                     {/* Pagination controls */}
                     <div className='flex items-center justify-center gap-4 py-6'>
                        <button
                           onClick={handlePreviousPage}
                           disabled={!hasPreviousPage}
                           className='bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-full p-2.5 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                        >
                           <ChevronLeftIcon size={16} />
                        </button>

                        <span className='text-sm font-medium text-gray-600'>
                           Trang {currentPage}
                        </span>

                        <button
                           onClick={handleNextPage}
                           disabled={!hasNextPage}
                           className='bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-full p-2.5 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                        >
                           <ChevronRightIcon size={16} />
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   )
}
