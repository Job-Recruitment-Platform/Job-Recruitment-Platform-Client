import JobInfo from '@/components/features/job/job-info/JobInfo'
import JobCommonInfo from '@/components/features/job/JobCommonInfo'
import JobCompanyInfo from '@/components/features/job/JobCompanyInfo'
import JobDetailInfo from '@/components/features/job/JobDetailInfo'
import OptionSearchJob from '@/components/features/search/OptionSearchJob'

export default function JobDetailPage() {
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
                  <JobInfo />
                  <JobDetailInfo />
               </div>
               <div className='col-span-1 space-y-6'>
                  <JobCompanyInfo />
                  <JobCommonInfo />
               </div>
            </div>
         </div>
      </div>
   )
}
