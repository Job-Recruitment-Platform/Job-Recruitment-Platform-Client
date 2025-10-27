import Button from '@/components/shared/Button'
import {
   Actions,
   Body,
   Company,
   Content,
   JobCard,
   JobTitle,
   Logo,
   Meta,
   Salary,
   TitleBlock,
   TitleContent
} from '@/components/ui/job-card'
import { formatSalary, formatSavedDateTime } from '@/lib/formatters/job.formatter'
import candidateService from '@/services/candidate.service'
import { SavedJobType } from '@/types/job.type'
import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type SavedJobItemProps = {
   job: SavedJobType
}

export default function SavedJobItem({ job }: SavedJobItemProps) {
   const router = useRouter()
   const savedJob = job.job

   return (
      <JobCard jobId={savedJob.id} className='!w-full !h-[170px]'>
         <Body>
            <Logo
               src='https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/fxfYyqrL7o9EbbD42aXNySpJPtohIu15_1745398913____bae212c6e41ad23ff4b62d244094bd41.jpg'
               alt={savedJob.company}
               className='h-[120px] w-[120px]'
            />
            <Content>
               <TitleBlock>
                  <TitleContent>
                     <JobTitle>{savedJob.title}</JobTitle>
                     <Company className='text-[15px] !font-medium'>{savedJob.company}</Company>
                     <Meta>
                        <div className='font-normal'>Đã lưu: {formatSavedDateTime(job.savedAt)}</div>
                     </Meta>
                  </TitleContent>
                  <Salary>
                     {formatSalary(savedJob.salaryMin, savedJob.salaryMax, savedJob.currency)}
                  </Salary>
               </TitleBlock>
               <Actions className='block gap-x-2'>
                  <div className='flex-1'></div>
                  <div className='flex items-center gap-x-3'>
                     <Button
                        variant='primary'
                        className='block rounded-full px-4 !py-[4px]'
                        onClick={() => router.push(`/job/${savedJob.id}/detail`)}
                     >
                        Ứng tuyển
                     </Button>
                     <Button
                        variant='ghost'
                        className='rounded-full px-4 !py-[4px]'
                        onClick={() => {
                           candidateService.removeSavedJob(savedJob.id)
                        }}
                     >
                        <TrashIcon size={16} className='mr-1' />
                        <div>Bỏ lưu</div>
                     </Button>
                  </div>
               </Actions>
            </Content>
         </Body>
      </JobCard>
   )
}
