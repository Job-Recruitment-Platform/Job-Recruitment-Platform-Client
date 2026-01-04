'use client'

import HomeHero from '@/components/features/home/HomeHero'
import FeatureJobItem from '@/components/features/job/FeatureJobItem'
import Pagination from '@/components/ui/pagination'
import { usePaginationClient } from '@/hooks/usePaginationClient'
import { useRecommendQuery } from '@/hooks/useRecommendQuery'
import { useLogStore } from '@/hooks/useTracker'
import { BriefcaseBusinessIcon } from 'lucide-react'

export default function Home() {
   const { recommendedJobs } = useRecommendQuery()
   const { pagedItems, currentPage, totalPages, isNext, isPrev, next, prev, goTo } =
      usePaginationClient({ items: recommendedJobs || [], itemsPerPage: 9 })
   const { markClick } = useLogStore()

   return (
      <div className='h-full w-full bg-[#f0f0f0]'>
         <HomeHero />
         <div className='container min-h-[50vh]'>
            <div className='flex items-center gap-x-2'>
               <BriefcaseBusinessIcon size={25} color='#00b14f' />
               <h2 className='text-primary py-3'>Việc làm tốt nhất</h2>
               <div className='font-bold text-[#00b14f]'>|</div>
               <div className='text-sm pt-1 text-gray-400'>Được đề xuất bởi: BotCV</div>
            </div>

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
