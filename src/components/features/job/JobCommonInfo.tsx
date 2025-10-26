import BasicInfoBox from '@/components/features/job/job-info/BasicInfoBox'
import { JobDetail } from '@/types/job.type'
import { BriefcaseBusinessIcon, CircleStarIcon, GraduationCapIcon, UsersIcon } from 'lucide-react'

type JobCommonInfoType = {
   job: JobDetail
}

export default function JobCommonInfo({ job }: JobCommonInfoType) {
   return (
      <div className='w-full space-y-4 rounded-lg bg-white px-6 py-5'>
         <div className='text-[20px] font-bold'>Thông tin chung</div>
         <BasicInfoBox label='Cấp bậc' value={'Nhân Viên'} icon={CircleStarIcon} />
         <BasicInfoBox label='Trình độ' value={'Đại học'} icon={GraduationCapIcon} />
         <BasicInfoBox label='Số lượng tuyển' value={'1 người'} icon={UsersIcon} />
         <BasicInfoBox
            label='Hình thức làm việc'
            value={job.workMode}
            icon={BriefcaseBusinessIcon}
         />
      </div>
   )
}
