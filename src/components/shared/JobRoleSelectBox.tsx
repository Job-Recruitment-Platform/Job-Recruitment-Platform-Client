import SelectionBox from '@/components/shared/SelectionBox'
import { jobRoleOptions } from '@/types/data'

export default function JobRoleSelectBox() {
   return (
      <div className='w-full'>
         <SelectionBox header='Lĩnh vực công việc' options={jobRoleOptions} paramKey={'jobRole'} />
      </div>
   )
}
