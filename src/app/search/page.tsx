'use client'

import JobSearchItem from '@/components/features/job/JobSearchItem'
import RadioFilter from '@/components/ui/radio-filter'
import { useSearchJobs } from '@/hooks/useSearchJobs'
import { experienceOptions } from '@/types/data'
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
      <div className='bg-smoke p-5'>
         <div className='container flex gap-x-2 px-2'>
            {/* Sidebar Filters */}
            <div className='w-[295px]'>
               <div className='w-full text-center'>Lọc nâng cao</div>
               <div>
                  <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
                  <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
                  <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
               </div>
            </div>

            {/* Search Results */}
            <div className='flex-1 space-y-3'>
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
                     <p className='text-sm text-gray-600'>
                        Tìm thấy <strong>{data.results.length}</strong> công việc
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
