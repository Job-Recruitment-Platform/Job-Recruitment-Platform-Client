import Button from '@/components/shared/Button'
import SavedJobButton from '@/components/shared/SavedJobButton'
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
import { useAuth } from '@/hooks/useAuth'
import { formatExperience, formatSalary } from '@/lib/formatters/job.formatter'
import type { JobSearchResult } from '@/types/job.type'
import { EyeOffIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

type JobSearchItemProps = {
   job: JobSearchResult
}

export default function JobSearchItem({ job }: JobSearchItemProps) {
   const router = useRouter()
   const { isLogin } = useAuth()
   const {} = use

   const handleCardClick = () => {
      
      router.push(`/job/${job.id}/detail`)
   }

   return (
      <JobCard jobId={job.id}>
         <Body>
            <Logo src={job.logo} alt={job.company} className='h-[120px] w-[120px] object-cover' />
            <Content>
               <TitleBlock>
                  <TitleContent>
                     <JobTitle onClick={handleCardClick}>{job.title}</JobTitle>
                     <Company>{job.company}</Company>
                     <Meta>
                        <Badge variant='outline'>{job.location}</Badge>
                        <Badge variant='outline'>{formatExperience(job.minExperienceYears)}</Badge>
                        {/* <Badge variant='outline'>{job.seniority}</Badge> */}
                     </Meta>
                  </TitleContent>
                  <Salary>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</Salary>
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
                     <SavedJobButton jobId={job.id} className='rounded-full !p-1.5' />
                  </div>
               </Actions>
            </Content>
         </Body>
      </JobCard>
   )
}
