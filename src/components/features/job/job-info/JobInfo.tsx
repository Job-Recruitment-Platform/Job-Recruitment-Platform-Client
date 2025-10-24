import BasicInfoBox from '@/components/features/job/job-info/BasicInfoBox'
import Button from '@/components/shared/Button'
import {
   CheckIcon,
   CircleDollarSignIcon,
   ClockIcon,
   HeartIcon,
   MapPinIcon,
   SendIcon
} from 'lucide-react'

type JobInfoProps = {
   jobInfo: JobBasicInfoType
}

export default function JobInfo({ jobInfo }: JobInfoProps) {
   return (
      <div className='flex w-full flex-col gap-y-5 rounded-lg bg-white px-6 py-5'>
         {/*  Job Title  */}
         <div className='flex w-full items-baseline gap-x-2 text-[20px] font-bold text-black/80'>
            <div>{jobInfo.title}</div>
            <div className='bg-primary-green flex h-4 w-4 items-center justify-center rounded-full'>
               <CheckIcon size={12} color='white' className='font-bold' />
            </div>
         </div>
         {/*  Basic Info  */}
         <div className='grid grid-cols-3'>
            <div className='col-span-1'>
               <BasicInfoBox
                  type='secondary'
                  label='Mức lương'
                  value={jobInfo.salary}
                  icon={CircleDollarSignIcon}
               />
            </div>
            <div className='col-span-1'>
               <BasicInfoBox
                  type='secondary'
                  label='Địa điểm'
                  value={jobInfo.location}
                  icon={MapPinIcon}
               />
            </div>
            <div className='col-span-1'>
               <BasicInfoBox
                  type='secondary'
                  label='Kinh nghiệm'
                  value={jobInfo.experience.toString()}
                  icon={ClockIcon}
               />
            </div>
         </div>
         {/*  Deadline  */}
         <div className='flex w-fit items-center gap-x-2 rounded bg-gray-200 px-1 py-0.5 text-sm'>
            <ClockIcon size={16} strokeWidth={2} color='gray' />
            <div>Hạn nộp hồ sơ: {jobInfo.deadline.toLocaleDateString('en-GB')}</div>
         </div>
         {/*  Apply Button  */}
         <div className='flex items-stretch gap-x-2'>
            <Button variant='primary' className='flex-1 py-2'>
               <SendIcon size={16} strokeWidth={2.5} color='white' />
               <div>Ứng tuyển ngay</div>
            </Button>

            <Button variant='outline' className='!px-7'>
               <HeartIcon size={16} strokeWidth={2.5} className='text-primary-green' />
               <div>Lưu tin</div>
            </Button>
         </div>
      </div>
   )
}
