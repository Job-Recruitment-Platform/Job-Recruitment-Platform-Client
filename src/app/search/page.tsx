'use client'

import JobSearchItem from '@/components/features/job/JobSearchItem'
import BoxSearch from '@/components/features/search/BoxSort'
import OptionSearchJob from '@/components/features/search/OptionSearchJob'
import SidebarFilter from '@/components/layouts/SidebarFilter'
import { useSearchJobs } from '@/hooks/useSearchJobs'
import { useSearchParams } from 'next/navigation'

export default function SearchResultsPage() {
   const searchParams = useSearchParams()
   const keyword = searchParams.get('key_word') || ''

   const { data, isLoading, isError } = useSearchJobs({
      query: keyword,
      limit: 20,
      offset: 0
   })

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
               {/* Loading state */}
               {isLoading && (
                  <div className='py-8 text-center'>
                     <p className='text-gray-600'>Đang tìm kiếm công việc...</p>
                  </div>
               )}

               {/* Empty state */}
               {!isLoading && !isError && (!data?.results || data.results.length === 0) && (
                  <div className='py-8 text-center'>
                     <p className='text-gray-600'>
                        {keyword
                           ? `Không tìm thấy công việc cho từ khóa "${keyword}"`
                           : 'Nhập từ khóa để tìm kiếm'}
                     </p>
                  </div>
               )}

               {/* Results */}
               {!isLoading && !isError && data?.results && data.results.length > 0 && (
                  <>
                     <p className='text-sm font-normal text-gray-600'>
                        Tìm thấy <strong className='text-primary'>{data.results.length}</strong>{' '}
                        công việc
                     </p>
                     {data.results.map((job) => (
                        <JobSearchItem key={job.id} job={job} />
                     ))}
                  </>
               )}
            </div>
         </div>
      </div>
   )
}
