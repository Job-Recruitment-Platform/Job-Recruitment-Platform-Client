'use client'

import JobInfo from '@/components/features/job/job-info/JobInfo'
import JobCommonInfo from '@/components/features/job/JobCommonInfo'
import JobCompanyInfo from '@/components/features/job/JobCompanyInfo'
import JobDetailInfo from '@/components/features/job/JobDetailInfo'
import OptionSearchJob from '@/components/features/search/OptionSearchJob'
import { useJob } from '@/hooks/useJob'
import { useParams } from 'next/navigation'

export default function JobDetailPage() {
   const params = useParams()
   const jobId = params.id ? parseInt(params.id as string) : null

   const { data: job, isLoading, isError, error } = useJob(jobId)

   if (isLoading) {
      return (
         <div className='w-full'>
            <div className='bg-[#19734e]'>
               <div className='container py-3'>
                  <OptionSearchJob />
               </div>
            </div>
            <div className='flex w-full justify-center bg-[#f4f5f5] pt-6'>
               <div className='py-8 text-center'>
                  <p className='text-gray-600'>Đang tải thông tin công việc...</p>
               </div>
            </div>
         </div>
      )
   }

   if (isError || !job) {
      return (
         <div className='w-full'>
            <div className='bg-[#19734e]'>
               <div className='container py-3'>
                  <OptionSearchJob />
               </div>
            </div>
            <div className='flex w-full justify-center bg-[#f4f5f5] pt-6'>
               <div className='rounded-lg bg-red-50 p-4'>
                  <p className='text-red-700'>
                     Lỗi: {error?.message || 'Không tìm thấy công việc'}
                  </p>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className='w-full'>
         <div className='bg-[#19734e]'>
            <div className='container py-3'>
               <OptionSearchJob />
            </div>
         </div>
         <div className='flex w-full justify-center bg-[#f4f5f5] pt-6'>
            <div className='grid w-[1140px] grid-cols-3 gap-x-6'>
               <div className='col-span-2 space-y-6'>
                  <JobInfo job={job} />
                  <JobDetailInfo job={job} />
               </div>
               <div className='col-span-1 space-y-6'>
                  <JobCompanyInfo job={job} />
                  <JobCommonInfo job={job} />
               </div>
            </div>
         </div>
      </div>
   )
}
