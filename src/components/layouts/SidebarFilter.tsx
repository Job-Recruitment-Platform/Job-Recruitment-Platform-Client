import RadioFilter from '@/components/ui/radio-filter'
import { experienceOptions } from '@/types/data'

export default function SidebarFilter() {
   return (
      <div className='w-[295px]'>
         <div className='w-full text-start font-semibold text-primary text-[20px] border-b pb-2'>Lọc nâng cao</div>
         <div>
            <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
            <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
            <RadioFilter header='Kinh nghiệm' columns={2} options={experienceOptions} />
         </div>
      </div>
   )
}
