'use client'

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
import { useLogStore } from '@/hooks/useTracker'
import { formatExperience, formatSalary } from '@/lib/formatters/job.formatter'
import type { JobSearchResult } from '@/types/job.type'
import { EyeOffIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type JobSearchItemProps = {
   job: JobSearchResult
   query: string
}

export default function JobSearchItem({ job, query }: JobSearchItemProps) {
   const router = useRouter()
   const { isLogin } = useAuth()
   const { markClick, markSave } = useLogStore()

   const handleCardClick = () => {
      console.log('Job card clicked:', isLogin)
      if (isLogin) {
         markClick({
            jobId: job.id,
            query: query,
            source: "search"
         })
      }
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
                     </Meta>
                  </TitleContent>
                  <Salary>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</Salary>
               </TitleBlock>

               <Actions className='gap-x-2'>
                  <div className='flex-1' />
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

                     {/* Save job */}
                     <SavedJobButton
                        jobId={job.id}
                        className='rounded-full !p-1.5'
                     />
                  </div>
               </Actions>
            </Content>
         </Body>
      </JobCard>
   )
}
