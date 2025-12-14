import CompanyFilter from '@/components/shared/CompanyFilter'
import JobRoleSelectBox from '@/components/shared/JobRoleSelectBox'
import LocationSelectBox from '@/components/shared/LocationSelectBox'
import RadioFilter from '@/components/ui/radio-filter'
import SalaryFilter from '@/components/ui/salary-filter'
import { datePostedOptions, levelOptions, workModeOptions } from '@/types/data'
import { FunnelIcon } from 'lucide-react'

export default function FilterSidebar() {
   return (
      <div className='w-[295px] overflow-y-auto'>
         <div className='text-primary flex items-center w-full border-b px-0.5 pb-2 text-start text-[20px] font-semibold'>
            <FunnelIcon fill='currentColor' size={20} /> 
            <span className='ml-2'>Lọc nâng cao</span>
         </div>
         <div className='max-h-[calc(100vh-200px)] min-h-[calc(100vh-200px)] space-y-4 overflow-y-auto px-0.5'>
            <CompanyFilter />

            <RadioFilter
               header='Cấp bậc'
               columns={2}
               options={levelOptions}
               paramKey='seniority'
               className='border-y pb-3.5'
            />

            <SalaryFilter className='border-b pb-3.5' />

            <RadioFilter
               header='Thời gian đăng tin'
               options={datePostedOptions}
               className='border-b pb-3.5'
               paramKey={'datePosted'}
            />

            <LocationSelectBox />

            <JobRoleSelectBox />

            <RadioFilter
               header='Loại hình công việc'
               columns={1}
               options={workModeOptions}
               paramKey='workMode'
            />
         </div>
      </div>
   )
}
