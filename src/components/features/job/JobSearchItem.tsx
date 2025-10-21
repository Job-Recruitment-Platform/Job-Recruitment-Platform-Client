import Button from '@/components/shared/Button'
import { Badge } from '@/components/ui/badge'
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
import { formatExperience, formatSalary } from '@/lib/formatters/job.formatter'
import type { JobSearchResult } from '@/types/job.type'
import { EyeOffIcon, HeartIcon } from 'lucide-react'

type JobSearchItemProps = {
   job: JobSearchResult
}

export default function JobSearchItem({ job }: JobSearchItemProps) {
   return (
      <JobCard>
         <Body>
            <Logo src='/logo512.png' alt={job.company} className='h-12 w-12' />
            <Content>
               <TitleBlock>
                  <TitleContent>
                     <JobTitle>{job.title}</JobTitle>
                     <Company>{job.company}</Company>
                     <Meta>
                        <Badge variant='outline'>{job.location}</Badge>
                        <Badge variant='outline'>
                           {formatExperience(job.min_experience_years)}
                        </Badge>
                        <Badge variant='outline'>{job.seniority}</Badge>
                     </Meta>
                  </TitleContent>
                  <Salary>{formatSalary(job.salary_min, job.salary_max, job.currency)}</Salary>
               </TitleBlock>
               <Actions className='gap-x-2'>
                  <div className='flex-1'></div>
                  <div className='flex items-center gap-x-3'>
                     <Button
                        variant='primary'
                        className='hidden rounded-full px-4 !py-[4px] group-hover:block'
                     >
                        Ứng tuyển
                     </Button>
                     <Button
                        variant='ghost'
                        className='hidden rounded-full border bg-white !p-1.5 group-hover:block'
                     >
                        <EyeOffIcon color='gray' size={16} />
                     </Button>
                     <Button variant='outline' className='rounded-full !p-1.5'>
                        <HeartIcon size={16} />
                     </Button>
                  </div>
               </Actions>
            </Content>
         </Body>
      </JobCard>
   )
}
