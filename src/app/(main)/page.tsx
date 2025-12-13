'use client'

import HomeHero from '@/components/features/home/HomeHero'
import FeatureJobItem from '@/components/features/job/FeatureJobItem'
import Pagination from '@/components/ui/pagination'
import { usePaginationClient } from '@/hooks/usePaginationClient'
import { useRecommendQuery } from '@/hooks/useRecommend'

export default function Home() {
   const { recommendedJobs } = useRecommendQuery()
   const { pagedItems, currentPage, totalPages, isNext, isPrev, next, prev, goTo } =
      usePaginationClient({ items: recommendedJobs || [], itemsPerPage: 9 })

   return (
      <div className='w-full bg-[#f0f0f0] h-full'>
         <HomeHero />
         <div className='container min-h-[50vh]'>
            <h2 className='text-primary py-3'>Việc làm tốt nhất</h2>
            <div className='container grid grid-cols-3 gap-4'>
               {pagedItems.map((job) => (
                  <FeatureJobItem key={job.id} job={job} />
               ))}
            </div>
            <div className='my-5 flex w-full justify-center'>
               <Pagination
                  onNext={next}
                  onPrev={prev}
                  disabledNext={!isNext}
                  disabledPrev={!isPrev}
               >
                  <div className='text-sm font-semibold text-gray-400'>
                     {currentPage}/{totalPages} trang
                  </div>
               </Pagination>
            </div>
         </div>
      </div>
   )
}
