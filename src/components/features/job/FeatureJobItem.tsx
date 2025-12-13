import Button from '@/components/shared/Button'
import { Badge } from '@/components/ui/badge'
import {
   Body,
   Company,
   Content,
   Footer,
   JobCard,
   JobTitle,
   Logo,
   TitleBlock,
   TitleContent
} from '@/components/ui/job-card'
import { JobResponse, JobType } from '@/types/job.type'
import { HeartIcon } from 'lucide-react'

type FeatureJobItemProps = {
   job: JobResponse
}

export default function FeatureJobItem({ job }: FeatureJobItemProps) {
   return (
      <JobCard className='!min-h-[124px] bg-white !p-3'>
         <Body>
            <Logo className='h-[64px] w-[64px]' src={job.company} />
            <Content>
               <TitleBlock>
                  <TitleContent className='line-clamp-1 !space-y-0.5'>
                     <JobTitle className='line-clamp-2 text-sm font-semibold text-wrap'>
                        {job.title}
                     </JobTitle>
                     <Company className='text-xs text-gray-500'>{job.company}</Company>
                  </TitleContent>
               </TitleBlock>
            </Content>
         </Body>
         <Footer className='space-x-3'>
            <div className='flex-1 space-x-2'>
               <Badge variant='outline'>{job.location.split(', ')[3]}</Badge>
               <Badge variant='outline'>Lương: {job.salaryMin} - {job.salaryMax}</Badge>
            </div>
            <Button variant='outline' className='rounded-full !p-1.5'>
               <HeartIcon size={10} />
            </Button>
         </Footer>
      </JobCard>
   )
}
