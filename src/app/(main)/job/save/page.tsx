'use client'

import SavedJobItem from '@/components/features/job/SavedJobItem'
import { cn } from '@/lib/utils'
import { useSavedJobsStore } from '@/store/useSavedJobStore'

export default function JobSavePage() {
   const { jobs } = useSavedJobsStore()

   return (
      <div className='container my-7 grid min-h-screen !max-w-[1130px] grid-cols-3 gap-x-7 px-5'>
         <div className='col-span-2 rounded-lg'>
            {/*  Bannerr  */}
            <div
               className='flex h-[180px] items-center rounded-t-lg px-5'
               style={{
                  backgroundImage:
                     'linear-gradient(90deg, rgb(38, 50, 56), rgb(0, 177, 79) 105.53%)'
               }}
            >
               <div className='space-y-1.5 text-white'>
                  <div className='text-[24px] font-bold'>Việc làm đã lưu</div>
                  <p className='max-w-[588px] text-[15px] leading-5 text-wrap'>
                     Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để
                     không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.
                  </p>
               </div>
            </div>

            {/*  Saved Jobs List  */}
            <div
               className={cn('flex rounded-b-lg bg-white p-5', {
                  'min-h-[316px]': jobs.length === 0
               })}
            >
               {jobs.length === 0 ? (
                  <div className='my-20 text-center text-gray-500'>
                     Bạn chưa lưu việc làm nào. Hãy duyệt qua các việc làm và lưu những việc làm phù
                     hợp với bạn.
                  </div>
               ) : (
                  <div className='flex w-full flex-col gap-y-5'>
                     {jobs.map((job) => (
                        <SavedJobItem key={job.id} job={job} />
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
