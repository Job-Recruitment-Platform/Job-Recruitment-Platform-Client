import RadioFilter from '@/components/ui/radio-filter'
import SalaryFilter from '@/components/ui/salary-filter'
import { experienceOptions, levelOptions, workModeOptions } from '@/types/data'

export default function SidebarFilter() {
   return (
      <div className='w-[295px] overflow-y-auto'>
         <div className='text-primary w-full border-b pb-2 text-start text-[20px] font-semibold'>
            Lọc nâng cao
         </div>
         <div className='max-h-[calc(100vh-200px)] min-h-[calc(100vh-200px)] space-y-4 overflow-y-auto'>
            <RadioFilter
               header='Kinh nghiệm'
               columns={2}
               options={experienceOptions}
               paramKey='experience'
            />

            <RadioFilter
               header='Cấp bậc'
               columns={2}
               options={levelOptions}
               paramKey='seniority'
               className='border-y pb-3.5'
            />

            <SalaryFilter className='border-b pb-3.5' />

            <RadioFilter
               header='Loại hình công việc'
               columns={1}
               options={workModeOptions}
               paramKey='work_mode'
            />
         </div>
      </div>
   )
}
