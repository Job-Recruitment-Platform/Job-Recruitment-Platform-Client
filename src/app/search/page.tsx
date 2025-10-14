import JobSearchItem from '@/components/features/job/JobSearchItem'
import RadioFilter from '@/components/ui/radio-filter'
import { experienceOptions } from '@/types/data'

export default function SearchResultsPage() {
   return (
      <div className='bg-smoke p-5'>
         <div className='container flex gap-x-2 px-2'>
            <div className='w-[295px]'>
               <div className='w-full text-center'>Lọc nâng cao</div>
               <div>
                  <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
                  <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
                  <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
               </div>
            </div>
            <div className='flex-1 space-y-3'>
               {Array(7)
                  .fill(0)
                  .map((_, index) => (
                     <JobSearchItem key={index} />
                  ))}
            </div>
         </div>
      </div>
   )
}
